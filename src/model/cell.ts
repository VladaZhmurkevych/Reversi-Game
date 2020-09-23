import Player from './player';

export default class Cell {
  private markedByPlayer: Player | null = null;
  public isAvailable = false

  constructor() {}

  get isEmpty(): boolean {
    return !this.markedByPlayer
  }

  getValue(): Player | null {
    return this.markedByPlayer;
  }

  public markByPlayer(player: Player): void {
    this.markedByPlayer = player
  }
}
