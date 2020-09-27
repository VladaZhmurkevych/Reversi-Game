import Player from './player';
import Cell from './cell';

export default class Reversi {
  private readonly FIELD_SIZE = 8
  private field: Cell[][]
  protected currentPlayer: Player
  private winner: Player
  private isEnded: boolean = false
  private firstPlayerCells: Cell[] = []
  private secondPlayerCells: Cell[] = []

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

  private getCurrentPlayerCells(): Cell[] {
    return this.currentPlayer === this.firstPlayer ? this.firstPlayerCells : this.secondPlayerCells
  }

  public getCellValue(x: number, y: number): Player | null {
    return this.getCell(x, y).getValue();
  }

  public getIsCellAvailable(x: number, y: number): boolean {
    return this.getCell(x, y).isAvailable;
  }

  private getPlayerWithMoreCells(): Player {
    const isDraw = this.firstPlayerCells.length === this.secondPlayerCells.length
    if (isDraw) return null

    return this.secondPlayerCells.length > this.firstPlayerCells.length ? this.secondPlayer : this.firstPlayer
  }

  private checkGameEnd(): void {
    let isAnyEmptyCell = false
    for(let x = 0; x < this.FIELD_SIZE; x++) {
      for(let y = 0; y < this.FIELD_SIZE; y++) {
        if (this.field[x][y].isEmpty) {
          isAnyEmptyCell = true;
          break;
        }
      }
    }

    if (!isAnyEmptyCell) {
      this.endGame(this.getPlayerWithMoreCells())
    }

    let isAnyAvailableCellsForCurrentPlayer = this.isAnyCellAvailable();

    if(!isAnyAvailableCellsForCurrentPlayer) {
      this.moveTurnToAnotherPlayer()
    }
  }

  protected moveTurnToAnotherPlayer() {
    this.switchPlayers();
    this.updateCellsAvailability();
    if (!this.isAnyCellAvailable()) {
      this.endGame(this.getPlayerWithMoreCells())
    }
  }

  private isAnyCellAvailable(): boolean {
    for(let x = 0; x < this.FIELD_SIZE; x++) {
      for(let y = 0; y < this.FIELD_SIZE; y++) {
        if (this.field[x][y].isAvailable) {
          return true;
        }
      }
    }

    return false;
  }

  public makeMove(x: number, y: number): void {
    if (!this.field) {
      throw new Error('Game wasn\'t started - call startGame() at first');
    }

    if (this.isEnded) {
      throw new Error(`Can not make move to (${x},${y}) - game is ended`);
    }

    if (!this.getIsCellAvailable(x, y)) {
      throw new Error(`Can not make move to (${x},${y}) - this cell is not available`);
    }

    this.markCell(x, y, this.currentPlayer)
    this.switchPlayers()
    this.updateCellsAvailability()
    this.checkGameEnd()
  }

  private markEarnedEnemyCells(x, y): void {

  }

  private updateCellsAvailability(): void {
    const playerCells = this.getCurrentPlayerCells();
    for (let x = 0; x < this.FIELD_SIZE; x++) {
      for (let y = 0; y < this.FIELD_SIZE; y++) {
        this.field[x][y].isAvailable = false
        if (playerCells.includes(this.field[x][y])) {
          const neighborEnemyCellCoords = this.getNeighborEnemyCells(x, y);
          neighborEnemyCellCoords.forEach((neighborCell) =>{
            const xDiff = neighborCell.x - x
            const yDiff = neighborCell.y - y

            let currX = neighborCell.x
            let currY = neighborCell.y

            while (currX < this.FIELD_SIZE && currX >= 0 && currY < this.FIELD_SIZE && currY >= 0) {
              currY += yDiff;
              currX += xDiff;

              if (this.field[currX][currY].isEmpty) {
                this.field[currX][currY].isAvailable = true
                break;
              } else if (this.field[currX][currY].getValue() === this.currentPlayer) {
                break;
              }
            }
          })
        }
      }
    }
  }

  private getNeighborEnemyCells(x: number, y: number): { x: number, y: number}[] {
    const result = []
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1 ; j++) {
        if(this.field[x] && this.field[x][y] && !this.field[x][y].isEmpty && this.field[x][y].getValue() !== this.currentPlayer) {
          result.push({ x: i, y: j})
        }
      }
    }
    return result
  }

  protected endGame(winner: Player): void {
    this.isEnded = true
    this.winner = winner
  }

  protected markCell(x: number, y: number, player: Player) {
    const cell = this.field[x][y];
    const isFirstPlayer = this.currentPlayer === this.firstPlayer;

    if (isFirstPlayer) {
      this.firstPlayerCells.push(cell)
      if (!cell.isEmpty) {
        this.secondPlayerCells = this.secondPlayerCells.filter(secondPlayerCell => secondPlayerCell !== cell)
      }
    } else {
      this.secondPlayerCells.push(cell)

      if (!cell.isEmpty) {
        this.firstPlayerCells = this.firstPlayerCells.filter(firstPlayerCell => firstPlayerCell !== cell)
      }
    }

    cell.markByPlayer(player)
  }

  protected switchPlayers(): void {
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
