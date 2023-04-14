import React from "react";
import axios from "axios/index";

const Connection = () => {

    const form = document.getElementById('inscription') as HTMLFormElement;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // @ts-ignore
        const { entries } = new FormData(e.target);
        axios.post('http://localhost:3020/connection', [...entries()]);

        window.location.href = '../gameboard/index.html';
    });


    return (
        <div className="flex justify-center flex-col items-center h-full">
            <h1 className="text-4xl font-bold p-6">Bienvenue sur CursorGame</h1>
            <form id="inscription" className="flex justify-center flex-col items-center w-1/4"
                  action="/src/gameboard/index.html" method="GET">
                <div className="mb-6 w-full">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Entrez votre
                        nom</label>
                    <input name="username" type="text" id="username"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                           required>
                </div>
                <div className="mb-6 w-full">
                    <label htmlFor="playerColor" className="block mb-2 text-sm font-medium text-gray-900">Choisissez une
                        couleur</label>
                    <input name="color" type="text" id="playerColor"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                           placeholder="#a34d3e" required>
                </div>
                <button type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Jouer
                </button>
            </form>
        </div>
    );
};

export default Connection;
