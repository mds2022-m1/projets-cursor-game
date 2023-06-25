export interface Player {
  uuid: string;
  name: string;
  color: string;
  socketId: string;
  isInGame: boolean;
}

export interface CursorPlayer {
  position: {
    x: number;
    y: number;
  };
  player: Player;
}
