import React, { useEffect, useState } from 'react';
import { Player } from '../global/types';
import './App.css';
import './index.css';
import { socket } from './socket';

import Gameboard from './pages/Gameboard';
import Connection from './pages/Connection';
import Waiting from './pages/Waiting';

const App = () => {
  const [playersInGame, setPlayersInGame] = useState<number>(0);
  const [waitingPlayers, setWaitingPlayers] = useState<string[]>([]);

  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    /**
     * La socket est connecté
     */
    const onConnect = () => {
      setIsConnected(true);
    };
    socket.on('connect', onConnect);

    /**
     * La socket est déconnecté
     */
    const onDisconnect = () => {
      setIsConnected(false);
    };
    socket.on('disconnect', onDisconnect);

    /**
     * Un joueur arrive dans la file d'attente
     * @param data
     */
    const onPlayerConnection = (data: any) => {
      if (data.socketId === socket.id) {
        setCurrentPlayer(data);
      }
    };
    socket.on('playerConnection', onPlayerConnection);

    const onDisconnectedPlayer = (data: any) => {
      console.log(`${data.name} - Disconnected from server`);
    };
    socket.on('disconnectedPlayer', onDisconnectedPlayer);

    const playersCount = (data: any) => {
      setPlayersInGame(data.nbPlayersInGame);
      setWaitingPlayers(data.waitingPlayers);
    };
    socket.on('playersCount', playersCount);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('playerConnection');
      socket.off('disconnectedPlayer');
      socket.off('nbPlayers');
    };
  }, []);

  if (isConnected && currentPlayer !== undefined) {
    const currentPlayerWaitingPosition = waitingPlayers.findIndex((player) => player === currentPlayer.uuid);
    console.log(currentPlayerWaitingPosition);
    if (playersInGame >= 1 && !currentPlayer?.isInGame && currentPlayerWaitingPosition !== -1) {
      return <div className="h-full w-full m-0 p-0"><Waiting waitingQueue={currentPlayerWaitingPosition} /></div>;
    }
    socket.emit('enterGame');
    currentPlayer.isInGame = true;
    return <div className="h-full w-full m-0 p-0"><Gameboard connectedPlayers={playersInGame} currentPlayer={currentPlayer} /></div>;
  }
  return <div className="h-full w-full m-0 p-0"><Connection /></div>;
};
export default App;
