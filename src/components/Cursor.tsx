import React from 'react';
import '../App.css';

type CursorProps = {
  cursorId: string;
  position: { x: number; y: number };
  color: string;
};

const Cursor = ({ cursorId, position, color }: CursorProps) => (
    <div id={`cursor-${cursorId}`} className="cursor" style={{ left: position.x, top: position.y }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="1064.7701 445.5539 419.8101 717.0565" xmlSpace="preserve">
            <polygon fill={color} points="1283.1857,1127.3097 1406.1421,1077.6322 1314.2406,850.1678 1463.913,852.7823 1093.4828,480.8547 1085.4374,1005.6964 1191.2842,899.8454 "/>
        </svg>
    </div>
);

export default Cursor;
