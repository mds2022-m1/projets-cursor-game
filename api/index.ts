import { Server } from 'socket.io';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { Player } from '../global/types';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

let players : Array<Player> = [];

/**
 * Se déclenche lorsqu'un joueur se connecte au serveur
 */
io.on('connection', (socket) => {
  /**
   * On génère un joueur aléatoire
   */
  const connectedPlayer : Player = {
    uuid: uuidv4(),
    name: faker.name.firstName(),
    color: faker.color.rgb(),
  };
  players = [...players, connectedPlayer];

  /**
   * Détermine le nombre de joueurs connectés
   */
  let nbPlayers = io.engine.clientsCount;
  io.emit('connectedPlayer', nbPlayers);

  /**
   * Un joueur envoie un message
   */
  socket.on('chat_message', (msg) => {
    const msgPlayer = { message: `${connectedPlayer.name} : ${msg}`, color: connectedPlayer.color };
    io.emit('chat_message', JSON.stringify(msgPlayer));
  });

  /**
   * Un joueur bouge son curseur
   */
  socket.on('cursor_player', (data) => {
    const newData = JSON.parse(data);
    newData.player = connectedPlayer;
    io.emit('cursor_player', JSON.stringify(newData));
  });

  /**
   * Déconnexion d'un joueur
   */
  socket.on('disconnect', () => {
    nbPlayers = io.engine.clientsCount;
    io.emit('connectedPlayer', nbPlayers);
  });
});

/**
 * On lance le serveur sur le port 3000
 */
httpServer.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
