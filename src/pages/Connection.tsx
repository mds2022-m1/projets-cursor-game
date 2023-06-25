import React, { useEffect, useState } from 'react';
import '../App.css';
import { socket } from '../socket';

const Connection = () => {
  const [newPlayer, setNewPlayer] = useState({ name: '', color: '' });
  const [isNameError, setIsNameError] = useState(false);
  const [allPlayers, setAllPlayers] = useState<[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (allPlayers.find((playerName: string) => playerName === newPlayer.name)) {
      setIsNameError(true);
    } else {
      socket.emit('playerConnection', { name: newPlayer.name, color: newPlayer.color, socketId: socket.id });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewPlayer({ ...newPlayer, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const playersList = (data: any) => {
      setAllPlayers(data);
    };
    socket.on('players', playersList);

    return () => {
      socket.off('players');
    };
  }, []);

  console.log(allPlayers);

  return (
        <div className="flex justify-center flex-col items-center h-full">
            <h1 className="text-4xl font-bold p-6">Bienvenue sur CursorGame</h1>
            <form id="inscription" onSubmit={handleSubmit} className="flex justify-center flex-col items-center w-1/4" action="" method="GET">
                <div className="mb-6 w-full">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Entrez votre nom</label>
                    <input name="name" type="text" id="username" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required maxLength={12} />
                    { isNameError && <p className="text-red-700 text-sm">Ce nom est déjà utilisé sur le plateau</p> }
                </div>
                <div className="mb-6 w-full">
                    <label htmlFor="playerColor" className="block mb-2 text-sm font-medium text-gray-900">Choisissez une couleur</label>
                    <input name="color" type="color" id="playerColor" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-3" placeholder="#a34d3e" required />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Jouer</button>
            </form>
        </div>
  );
};

export default Connection;
