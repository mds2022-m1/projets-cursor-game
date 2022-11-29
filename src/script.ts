const ws : WebSocket = new WebSocket('ws://localhost:8080/');

ws.addEventListener('open', () => {
  console.log('We are connected');
  ws.send('How are you?');
});

ws.addEventListener('message', (event) => {
  console.log(event.data);
});
