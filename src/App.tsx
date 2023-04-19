import React, { FormEvent, useEffect, useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import './App.css';
import './index.css';
import { socket } from './socket';

import Cursor from './components/Cursor';

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const GET_PLAYERS = gql`
        query getPlayers {
            player {
                uuid
                color
                name
                position_x
                position_y
            }
            player_aggregate {
                aggregate {
                    count
                }
            }
        }`;

  const UPDATE_PLAYER = gql`
        mutation updatePlayer($uuid: uuid!, $position_x: Int!, $position_y: Int!) {
            update_player_by_pk(pk_columns:  {uuid: $uuid}, _inc: {position_x: $position_x, position_y: $position_y}) {
                uuid
                position_x
                position_y
            }
        }`;
  const [updatePlayer] = useMutation(UPDATE_PLAYER);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input !== '') {
      socket.emit('chat_message', input);
      setInput('');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e.clientX, e.clientY);
    updatePlayer({
      variables: {
        uuid: localStorage.getItem('player_uuid'),
        position_x: e.clientX,
        position_y: e.clientY,
      },
    }).then((res) => {
      console.log(res);
    });
  };

  const { loading, data: queryData } = useQuery(GET_PLAYERS);
  console.log(queryData);

  useEffect(() => {
    const onChatMessage = (data: any) => {
      setMessages((oldMessages) => [...oldMessages, data.message]);
    };
    socket.on('chat_message', onChatMessage);

    return () => {
      socket.off('chat_message');
    };
  }, []);

  return (
    <div>
    {loading ? (<p>Chargement...</p>) : (
      <div className="w-full flex">

          <div id="cursor-playground" className="w-full" onMouseMove={handleMouseMove}>
              { queryData.player.map((player: any) => (
                  <Cursor
                    key={player.uuid}
                    cursorId={player.uuid}
                    position={{ x: player.position_x, y: player.position_y }}
                    color={player.color} />
              ))}
          </div>

          <div className="w-96 min-h-screen border-l-2 border-blue-700 flex flex-col">
              <div id="game-infos" className="text-center py-4 border-b-2 border-blue-700">
                  <h2 className="font-medium text-2xl mt-0 mb-2 text-blue-700">Bienvenue {queryData.player.name}</h2>
                  <p><span className="font-bold">{queryData.player_aggregate.aggregate.count}</span> joueur{queryData.player_aggregate.aggregate.count > 1 ? 's' : ''} connecté{queryData.player_aggregate.aggregate.count > 1 ? 's' : ''}</p>
              </div>
              <div className="h-full flex flex-col justify-between p-1">
                <ul id="messages" className="m-0 p-0 list-none">{messages.map((msg) => <li key={msg}>{msg}</li>)}</ul>
                  <form id="form" className="flex" onSubmit={handleSubmit}>
                      <input id="input" autoComplete="off" value={input} onChange={(e) => setInput(e.target.value)}
                             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
                      <button
                          className="text-white bg-blue-700 hover:bg-blue-800 font-medium text-sm rounded-r-lg focus:outline-none px-5 py-2.5">Envoyer
                      </button>
                  </form>
              </div>
          </div>
      </div>
    )}
    </div>
  );
};

export default App;
