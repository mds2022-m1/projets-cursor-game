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

io.on('connection', (socket) => {
  const connectedPlayer : Player = {
    uuid: uuidv4(),
    name: faker.name.firstName(),
    color: faker.color.rgb(),
  };
  players = [...players, connectedPlayer];

  socket.on('chat_message', (msg) => {
    const msgPlayer = { message: `${connectedPlayer.name} : ${msg}`, color: connectedPlayer.color };
    io.emit('chat_message', JSON.stringify(msgPlayer));
  });

  socket.on('cursor_player', (data) => {
    const newData = JSON.parse(data);
    newData.player = connectedPlayer;
    io.emit('cursor_player', JSON.stringify(newData));
  });

  // Voir avec "Server Engine" pour la liste des clients connectés
  socket.on('player', (data) => {
    console.log('received: %s', data);

    players.forEach((player) => {
      io.emit('player', JSON.stringify(player));
    });
  });
});

httpServer.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
