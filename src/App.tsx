import React, { FormEvent, useEffect, useState } from 'react';
import { Player } from '../global/types';
import './App.css';
import './index.css';
import { socket } from './socket';

const App = () => {
  const [connectedPlayers, setConnectedPlayers] = useState<number>(0);
  const [username, setUsername] = useState<Player>();
  const [color, setColor] = useState<string>('#000000');
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [playground, setPlayground] = useState<any>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input !== '') {
      socket.emit('chat_message', input);
      setInput('');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cursorMessage = { position: { x: e.clientX, y: e.clientY }, socketId: socket.id };
    socket.emit('cursor_player', JSON.stringify(cursorMessage));
  };

  const createOrUpdateCursor = (player: Player) => {
    const cursorId = `cursor-${player.uuid}`;
    const cursor = document.getElementById(cursorId);

    if (cursor === null) {
      const newCursor = document.createElement('div');
      newCursor.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="1064.7701 445.5539 419.8101 717.0565" xml:space="preserve"><polygon fill="${player.color}" points="1283.1857,1127.3097 1406.1421,1077.6322 1314.2406,850.1678 1463.913,852.7823 1093.4828,480.8547 1085.4374,1005.6964 1191.2842,899.8454 "/></svg>`;
      newCursor.id = cursorId;
      newCursor.classList.add('cursor');
      playground?.appendChild(newCursor);
    }

    return cursor;
  };

  useEffect(() => {
    const onChatMessage = (data) => {
      console.log(data);
      const parseData = JSON.parse(data);
      setMessages((oldMessages) => [...oldMessages, parseData.message]);
    };
    socket.on('chat_message', onChatMessage);

    const onCursorPlayer = (data) => {
      const parseData = JSON.parse(data);
      const cursor = createOrUpdateCursor(parseData.player);
      if (cursor) {
        cursor.style.left = `${parseData.position.x}px`;
        cursor.style.top = `${parseData.position.y}px`;
      }
    };
    socket.on('cursor_player', onCursorPlayer);

    const onPlayerConnection = (data) => {
      setConnectedPlayers(data.nbPlayers);
      setUsername(data.connectedPlayer.name);
      console.log(`${data.connectedPlayer.name} - Connected from server`);
    };
    socket.on('playerConnection', onPlayerConnection);

    const onDisconnectedPlayer = (data) => {
      console.log(`${data.connectedPlayer.name} - Disconnected from server`);
      setConnectedPlayers(data.nbPlayers);

      const oldCursor = document.getElementById(`cursor-${data}`);
      if (oldCursor) {
        oldCursor.remove();
      }
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
          <div id="cursor-playground" className="w-full" onMouseMove={handleMouseMove}></div>
          <div className="w-96 min-h-screen border-l-2 border-blue-700 flex flex-col">
              <div id="game-infos" className="text-center py-4 border-b-2 border-blue-700">
                  <h2 className="font-medium text-2xl mt-0 mb-2 text-blue-700">Bienvenue {username}</h2>
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
