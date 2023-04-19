import React, { FormEvent, useEffect, useState } from 'react';
import { Player, CursorPlayer } from '../global/types';
import './App.css';
import './index.css';
import { socket } from './socket';

import Cursor from './components/Cursor';

const App = () => {
  const [connectedPlayers, setConnectedPlayers] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [cursors, setCursors] = useState<CursorPlayer[]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input !== '') {
      socket.emit('chat_message', input);
      setInput('');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cursorMessage = { position: { x: e.clientX, y: e.clientY }, player: currentPlayer };
    socket.emit('cursor_player', JSON.stringify(cursorMessage));
  };

  useEffect(() => {
    const onChatMessage = (data: any) => {
      setMessages((oldMessages) => [...oldMessages, data.message]);
    };
    socket.on('chat_message', onChatMessage);

    const onCursorPlayer = (data: CursorPlayer) => {
      setCursors((oldCursors) => (oldCursors.find((cursor) => cursor.player.uuid === data.player.uuid) ? oldCursors.map((cursor) => (cursor.player.uuid === data.player.uuid ? data : cursor)) : [...oldCursors, data]));
    };
    socket.on('cursor_player', onCursorPlayer);

    const onPlayerConnection = (data: any) => {
      setConnectedPlayers(data.nbPlayers);
      setCurrentPlayer(data.connectedPlayer);
      console.log(`${data.connectedPlayer.name} - Connected from server`);
    };
    socket.on('playerConnection', onPlayerConnection);

    const onDisconnectedPlayer = (data: any) => {
      console.log(`${data.connectedPlayer.name} - Disconnected from server`);
      setConnectedPlayers(data.nbPlayers);
      setCursors((oldCursors) => oldCursors.filter((cursor) => cursor.player.uuid !== data.connectedPlayer.uuid));
    };
    socket.on('disconnectedPlayer', onDisconnectedPlayer);

    return () => {
      socket.off('connect');
      socket.off('chat_message');
      socket.off('cursor_player');
      socket.off('playerConnection');
      socket.off('disconnectedPlayer');
    };
  }, []);

  return (
      <div className="w-full flex">
          <div id="cursor-playground" className="w-full" onMouseMove={handleMouseMove}>
              { cursors.map((cursor) => (
                  <Cursor
                    key={cursor.player.uuid}
                    cursorId={cursor.player.uuid}
                    position={cursor.position}
                    color={cursor.player.color} />
              ))}
          </div>
          <div className="w-96 min-h-screen border-l-2 border-blue-700 flex flex-col">
              <div id="game-infos" className="text-center py-4 border-b-2 border-blue-700">
                  <h2 className="font-medium text-2xl mt-0 mb-2 text-blue-700">Bienvenue {currentPlayer?.name}</h2>
                  <p><span className="font-bold">{connectedPlayers}</span> joueur{connectedPlayers > 1 ? 's' : ''} connecté{connectedPlayers > 1 ? 's' : ''}</p>
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
  );
};

export default App;
