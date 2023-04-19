export interface Player {
  uuid: string;
  name: string;
  color: string;
}

export interface CursorPlayer {
  position: {
    x: number;
    y: number;
  };
  player: Player;
}
