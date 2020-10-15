import Player from './player';

export default class Cell {
  private markedByPlayer: Player | null = null;

  private _isAvailable = false;

  public get isAvailable(): boolean {
    return this._isAvailable;
  }

  public set isAvailable(value: boolean) {
    this._isAvailable = value;
  }

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
