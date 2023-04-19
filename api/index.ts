import { Server } from 'socket.io';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import cors from 'cors';
import { Player } from '../global/types';

const app = express();
const port = 3020;
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

let players : Array<Player> = [];

app.use(express.json(), cors());

let playerUsername = faker.name.firstName();
let playerColor = faker.internet.color();

app.post('/connection', (req) => {
  console.log(req.body);
  playerUsername = req.body.name;
  playerColor = req.body.color;
});

/**
 * Se déclenche lorsqu'un joueur se connecte au serveur
 */
io.on('connection', (socket) => {
  /**
   * On génère un joueur aléatoire
   */
  const connectedPlayer : Player = {
    uuid: uuidv4(),
    name: playerUsername,
    color: playerColor,
  };
  players = [...players, connectedPlayer];

  /**
   * Détermine le nombre de joueurs connectés
   */
  let nbPlayers = io.engine.clientsCount;

  const data = { nbPlayers, connectedPlayer };
  io.emit('playerConnection', data);

  /**
   * Un joueur envoie un message
   */
  socket.on('chat_message', (msg) => {
    const msgPlayer = { message: `${connectedPlayer.name} : ${msg}`, color: connectedPlayer.color };
    io.emit('chat_message', msgPlayer);
  });

  /**
   * Un joueur bouge son curseur
   */
  socket.on('cursor_player', (data) => {
    const newData = JSON.parse(data);
    newData.player = connectedPlayer;
    io.emit('cursor_player', newData);
  });

  /**
   * Déconnexion d'un joueur
   */
  socket.on('disconnect', () => {
    nbPlayers = io.engine.clientsCount;
    const disconnectedPlayer = { nbPlayers, connectedPlayer };
    io.emit('disconnectedPlayer', disconnectedPlayer);
  });
});

/**
 * On lance le serveur sur le port 3000
 */
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
