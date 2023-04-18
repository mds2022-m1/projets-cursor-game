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

/* app.get('/', (req, res) => {
  console.log(req);
  res.send('hello world');
});

app.post('/connection', (req) => {
  // @ts-ignore
  playerUsername = req.body[0][1];
  playerColor = req.body[1][1];
}); */

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
    color: faker.internet.color(),
  };
  players = [...players, connectedPlayer];
  console.log('players', players);

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
