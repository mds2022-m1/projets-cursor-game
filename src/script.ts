import { io } from 'socket.io-client';
import { Player } from '../global/types';

const socket = io('http://localhost:3000');

const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = <HTMLInputElement>document.getElementById('input');
const playground = document.getElementById('cursor-playground');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat_message', input.value);
    input.value = '';
  }
});

socket.on('connect', () => {
  console.log('PLAYER - Connected to server');

  if (playground) {
    playground.addEventListener('mousemove', (e) => {
      const cursorMessage = { position: { x: e.clientX, y: e.clientY }, socketId: socket.id };
      socket.emit('cursor_player', JSON.stringify(cursorMessage));
    });
  }
});

socket.on('chat_message', (data) => {
  const parseData = JSON.parse(data);
  const msgToShow = document.createElement('li');

  msgToShow.textContent = parseData.message;
  console.log(parseData);
  msgToShow.style.backgroundColor = parseData.color;
  messages?.appendChild(msgToShow);
});

const createOrUpdateCursor = (socketId : string, player: Player) => {
  const cursorId = `cursor-${socketId}`;
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

socket.on('cursor_player', (data) => {
  const parseData = JSON.parse(data);
  const cursor = createOrUpdateCursor(parseData.socketId, parseData.player);
  if (cursor) {
    cursor.style.left = `${parseData.position.x}px`;
    cursor.style.top = `${parseData.position.y}px`;
  }
});

export {};
