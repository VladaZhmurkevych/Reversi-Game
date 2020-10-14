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

  public copy(): Cell {
    const cell = new Cell();
    cell.markByPlayer(this.markedByPlayer);
    cell.isAvailable = this.isAvailable;
    return cell;
  }
}
