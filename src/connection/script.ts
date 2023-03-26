// @ts-ignore
import axios from 'axios';

const form = document.getElementById('inscription') as HTMLFormElement;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(e.target);
  axios.post('http://localhost:3020/connection', [...data.entries()]);

  window.location.href = '/src/index.html';
});
