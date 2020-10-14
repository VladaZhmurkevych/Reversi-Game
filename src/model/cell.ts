import Player from './player';

export default class Cell {
  private markedByPlayer: Player | null = null;

  public isAvailable = false

  public get isEmpty(): boolean {
    return !this.markedByPlayer;
  }

  public getValue(): Player | null {
    return this.markedByPlayer;
  }

  public markByPlayer(player: Player): void {
    this.markedByPlayer = player;
  }
}
