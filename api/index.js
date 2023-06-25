import { Server } from 'socket.io';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
import cors from 'cors';

const app = express();
const port = 3020;
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

let players = [];
let waitingPlayers = [];

app.use(express.json(), cors());

/**
 * Se déclenche lorsqu'un joueur se connecte au serveur
 */
io.on('connection', (socket) => {
  // On ajoute le joueur à la salle de connexion
  socket.join('isLogging');

  const connectedPlayer = {
    uuid: uuidv4(),
    socketId: socket.id,
    name: '',
    color: '',
    isInGame: false,
  };

  let nbPlayersInGame = io.of('/').adapter.rooms.get('enterGame')?.size || 0;

  // On envoie la liste des noms des joueurs connectés
  io.emit('players', players.map((player) => player.name));

  // On envoie les informations sur le nombre de joueurs connectés
  io.emit('playersCount', { nbPlayersInGame, waitingPlayers });

  /**
   * On crée un joueur avec un id unique, un nom et une couleur
   */
  socket.on('playerConnection', (data) => {
    if (connectedPlayer.socketId === data.socketId) {
      connectedPlayer.name = data.name;
      connectedPlayer.color = data.color;
      players = [...players, connectedPlayer];
    }
    io.emit('players', players.map((player) => player.name));

    // On change la salle du joueur
    socket.leave('isLogging');
    socket.join('waitingRoom');
    // On met le joueur dans la file attente
    waitingPlayers = [...waitingPlayers, connectedPlayer.uuid];

    // Détermine le nombre de joueurs connectés
    nbPlayersInGame = io.of('/').adapter.rooms.get('enterGame')?.size || 0;
    io.emit('playersCount', { nbPlayersInGame, waitingPlayers });

    io.emit('playerConnection', connectedPlayer);
  });

  /**
   * Déclenché lorsqu'un joueur quitte la file d'attente et entre dans le jeu
   */
  socket.on('enterGame', () => {
    // On change la salle du joueur
    socket.leave('waitingRoom');
    socket.join('enterGame');

    // On retire le joueur de la file d'attente
    waitingPlayers = waitingPlayers.filter((player) => player !== connectedPlayer.uuid);
    nbPlayersInGame = io.of('/').adapter.rooms.get('enterGame')?.size || 0;
    io.emit('playersCount', { nbPlayersInGame, waitingPlayers });
  });

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
    nbPlayersInGame = io.of('/').adapter.rooms.get('enterGame')?.size || 0;
    players = players.filter((player) => player.socketId !== socket.id);
    waitingPlayers = waitingPlayers.filter((player) => player !== connectedPlayer.uuid);

    io.emit('players', players.map((player) => player.name));
    io.emit('playersCount', { nbPlayersInGame, waitingPlayers });
    io.emit('disconnectedPlayer', connectedPlayer);
  });
});

/**
 * On lance le serveur sur le port 3000
 */
httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
