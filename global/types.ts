export interface Player {
  uuid: string;
  name: string;
  color: string;
}

export interface cursorPlayer {
  position: {
    x: number;
    y: number;
  };
  player: Player;
}
