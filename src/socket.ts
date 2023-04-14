import { io } from 'socket.io-client';

const URL : string = 'http://localhost:3020';

export const socket = io(URL);
