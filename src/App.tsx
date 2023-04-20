import React, { useEffect, useState } from 'react';
import { Player, CursorPlayer } from '../global/types';
import './App.css';
import './index.css';
import { socket } from './socket';

import Gameboard from './pages/Gameboard';
import Connection from './pages/Connection';

const App = () => {
  const [connectedPlayers, setConnectedPlayers] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [cursors, setCursors] = useState<CursorPlayer[]>([]);

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
    };
    socket.on('playerConnection', onPlayerConnection);

    const onDisconnectedPlayer = (data: any) => {
      console.log(`${data.connectedPlayer.name} - Disconnected from server`);
      setConnectedPlayers(data.nbPlayers);
      setCursors((oldCursors) => oldCursors.filter((cursor) => cursor.player.uuid !== data.connectedPlayer.uuid));
    };
    socket.on('disconnectedPlayer', onDisconnectedPlayer);

    return () => {
      socket.off('chat_message');
      socket.off('cursor_player');
      socket.off('playerConnection');
      socket.off('disconnectedPlayer');
    };
  }, []);

  return (
      <div className="h-full w-full m-0 p-0">
        {currentPlayer !== undefined ? (
          <Gameboard
            connectedPlayers={connectedPlayers}
            currentPlayer={currentPlayer}
            messages={messages}
            input={input}
            setInput={setInput}
            cursors={cursors} />
        ) : (
          <Connection />
        )}
      </div>
  );
};

export default App;
