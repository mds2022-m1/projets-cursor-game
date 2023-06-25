import React from 'react';
import '../App.css';

type WaitingProps = {
  waitingQueue: number;
};

const Waiting = ({ waitingQueue } : WaitingProps) => (
    <div className="flex justify-center flex-col items-center h-full">
      <h1 className="text-4xl font-bold p-6">Le plateau est plein !</h1>
      <p>Il y a actuellement trop de monde sur le plateau, merci de bien vouloir patienter.</p>
      <p>Votre position dans la file d'attente : <span className="font-bold">{waitingQueue + 1}</span></p>
    </div>
);

export default Waiting;
