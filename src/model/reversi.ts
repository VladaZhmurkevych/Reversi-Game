import Player from './player';
import Cell from './cell';

export default class Reversi {
  private readonly FIELD_SIZE = 8
  private field: Cell[][]
  private currentPlayer: Player
  private winner: Player
  private isEnded: boolean = false

  constructor(
    private readonly firstPlayer: Player,
    private readonly secondPlayer: Player
  ) {}

  public startGame() {
    this.currentPlayer = this.firstPlayer
    this.prepareField()
  }

  private getCell(x: number, y: number): Cell {
    return this.field[x][y];
  }

  public getCellValue(x: number, y: number): Player | null {
    return this.getCell(x, y).getValue();
  }

  public getIsCellAvailable(x: number, y: number): boolean {
    return this.getCell(x, y).isAvailable;
  }

  private checkGameEnd(): void {
    // Check for game end here
  }

  public makeMove(x: number, y: number): void {
    if (!this.field) {
      throw new Error('Game wasn\'t started - call startGame() at first');
    }

    if (this.isEnded) {
      throw new Error(`Can not make move to (${x},${y}) - game is ended`);
    }

    // if (!this.getIsCellAvailable(x, y)) {
    //   throw new Error(`Can not make move to (${x},${y}) - this cell is not available`);
    // }

    this.markCell(x, y, this.currentPlayer)
    this.switchPlayers()
    this.updateCellsAvailability()
    this.checkGameEnd()
  }

  private markEarnedEnemyCells(x, y): void {

  }

  private updateCellsAvailability(): void {

  }

  protected endGame(winner: Player): void {
    this.isEnded = true
    this.winner = winner
  }

  protected markCell(x: number, y: number, player: Player) {
    this.field[x][y].markByPlayer(player)
  }

  private switchPlayers(): void {
    this.currentPlayer = this.currentPlayer === this.firstPlayer ? this.secondPlayer : this.firstPlayer
  }

  protected prepareField(): void {
    this.field = []
    for (let x = 0; x < this.FIELD_SIZE; x++) {
      this.field[x] = []
      for (let y = 0; y < this.FIELD_SIZE; y++) {
        this.field[x][y] = new Cell()
      }
    }

    this.field[3][3].markByPlayer(this.firstPlayer)
    this.field[4][4].markByPlayer(this.firstPlayer)
    this.field[3][4].markByPlayer(this.secondPlayer)
    this.field[4][3].markByPlayer(this.secondPlayer)
  }

  protected getField(): Cell[][] {
    return this.field.map(row => row.map(cell => cell))
  }

}
