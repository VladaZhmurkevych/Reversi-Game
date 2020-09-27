import Player from './player';
import Cell from './cell';
import {
  ReversiCellIsNotAvailableError,
  ReversiGameIsEndedError,
  ReversiGameNotStartedError,
  ReversiWrongCoordinatesError
} from './errors';

export interface Coordinates { x: number, y: number}

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

  protected startGame() {
    this.currentPlayer = this.firstPlayer;
    this.prepareField();
    this.updateCellsAvailability();
    this.winner = null;
    this.isEnded = false;
    this.startProcessingPlayersMove()
  }

  private async startProcessingPlayersMove() {
    while (!this.isEnded) {
      const { x, y } = await this.currentPlayer.getNextMove(this.getField());
      this.makeMove(x, y);
    }
  }

  private getCell(x: number, y: number): Cell {
    return this.field[x][y];
  }

  private getCurrentPlayerCells(): Cell[] {
    return this.currentPlayer === this.firstPlayer ? this.firstPlayerCells : this.secondPlayerCells;
  }

  public getCellValue(x: number, y: number): Player | null {
    return this.getCell(x, y).getValue();
  }

  public getIsCellAvailable(x: number, y: number): boolean {
    return this.getCell(x, y).isAvailable;
  }

  private getPlayerWithMoreCells(): Player {
    const isDraw = this.firstPlayerCells.length === this.secondPlayerCells.length;
    if (isDraw) return null

    return this.secondPlayerCells.length > this.firstPlayerCells.length ? this.secondPlayer : this.firstPlayer;
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
      this.endGame(this.getPlayerWithMoreCells());
    }

    let isAnyAvailableCellsForCurrentPlayer = this.isAnyCellAvailable();

    if(!isAnyAvailableCellsForCurrentPlayer) {
      this.moveTurnToAnotherPlayer();
    }
  }

  protected moveTurnToAnotherPlayer() {
    this.switchPlayers();
    this.updateCellsAvailability();
    if (!this.isAnyCellAvailable()) {
      this.endGame(this.getPlayerWithMoreCells());
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
      throw new ReversiGameNotStartedError();
    }

    if (this.isEnded) {
      throw new ReversiGameIsEndedError(x, y);
    }

    if(isNaN(x) || isNaN(y) || x > 8 || x < 0 || y > 8 || y < 0) {
      throw new ReversiWrongCoordinatesError();
    }

    if (!this.getIsCellAvailable(x, y)) {
      throw new ReversiCellIsNotAvailableError(x, y);
    }

    this.markCell(x, y, this.currentPlayer);
    this.markEarnedEnemyCells(x, y);
    this.switchPlayers();
    this.updateCellsAvailability();
    this.checkGameEnd();
  }

  private markEarnedEnemyCells(x, y): void {
    const neighborEnemyCellCoords = this.getNeighborEnemyCells(x, y);
    neighborEnemyCellCoords.forEach((neighborCell) =>{
      const xDiff = neighborCell.x - x;
      const yDiff = neighborCell.y - y;

      let currX = neighborCell.x;
      let currY = neighborCell.y;

      while (currX < this.FIELD_SIZE && currX >= 0 && currY < this.FIELD_SIZE && currY >= 0) {
        if (this.field[currX][currY].isEmpty) {
          break;
        } else if (this.field[currX][currY].getValue() === this.currentPlayer) {
          this.markLineByPlayer({ x, y }, { x: currX, y: currY }, this.currentPlayer);
          break;
        }

        currY += yDiff;
        currX += xDiff;
      }
    })
  }

  private markLineByPlayer(start: Coordinates, end: Coordinates, player: Player): void {
    const xDiff = end.x - start.x > 0 ? 1 : end.x - start.x < 0 ? -1 : 0
    const yDiff = end.y - start.y > 0 ? 1 : end.y - start.y < 0 ? -1 : 0;

    let currX = start.x;
    let currY = start.y;

    while (currX !== end.x || currY !== end.y) {
      currY += yDiff;
      currX += xDiff;

      this.markCell(currX, currY, player);
    }
  }

  private updateCellsAvailability(): void {
    const playerCells = this.getCurrentPlayerCells();
    this.setFieldUnavailable();
    for (let x = 0; x < this.FIELD_SIZE; x++) {
      for (let y = 0; y < this.FIELD_SIZE; y++) {
        if (playerCells.includes(this.field[x][y])) {
          const neighborEnemyCellCoords = this.getNeighborEnemyCells(x, y);
          neighborEnemyCellCoords.forEach((neighborCell) =>{
            const xDiff = neighborCell.x - x;
            const yDiff = neighborCell.y - y;

            let currX = neighborCell.x;
            let currY = neighborCell.y;

            while (currX < this.FIELD_SIZE && currX >= 0 && currY < this.FIELD_SIZE && currY >= 0) {
              currY += yDiff;
              currX += xDiff;

              if (this.field[currX] && this.field[currX][currY].isEmpty) {
                this.field[currX][currY].isAvailable = true;
                break;
              } else if (this.field[currX] && this.field[currX][currY].getValue() === this.currentPlayer) {
                break;
              }
            }
          })
        }
      }
    }
  }

  private setFieldUnavailable(){
    for (let i = 0; i < this.FIELD_SIZE; i++) {
      for (let j = 0; j < this.FIELD_SIZE; j++) {
       this.field[i][j].isAvailable = false;
      }
    }
  }

  private getNeighborEnemyCells(x: number, y: number): Coordinates[] {
    const result = []
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1 ; j++) {
        if(this.field[i] && this.field[i][j] && !this.field[i][j].isEmpty && this.field[i][j].getValue() !== this.currentPlayer) {
          result.push({ x: i, y: j});
        }
      }
    }
    return result
  }

  protected endGame(winner: Player): void {
    this.isEnded = true;
    this.winner = winner;
  }

  protected markCell(x: number, y: number, player: Player) {
    const cell = this.field[x][y];
    const isFirstPlayer = this.currentPlayer === this.firstPlayer;

    if (isFirstPlayer) {
      this.firstPlayerCells.push(cell);
      if (!cell.isEmpty) {
        this.secondPlayerCells = this.secondPlayerCells.filter(secondPlayerCell => secondPlayerCell !== cell)
      }
    } else {
      this.secondPlayerCells.push(cell);

      if (!cell.isEmpty) {
        this.firstPlayerCells = this.firstPlayerCells.filter(firstPlayerCell => firstPlayerCell !== cell);
      }
    }

    cell.markByPlayer(player);
  }

  protected switchPlayers(): void {
    this.currentPlayer = this.currentPlayer === this.firstPlayer ? this.secondPlayer : this.firstPlayer
  }

  protected prepareField(): void {
    this.field = [];
    for (let x = 0; x < this.FIELD_SIZE; x++) {
      this.field[x] = [];
      for (let y = 0; y < this.FIELD_SIZE; y++) {
        this.field[x][y] = new Cell();
      }
    }

    this.field[3][3].markByPlayer(this.secondPlayer);
    this.field[4][4].markByPlayer(this.secondPlayer);
    this.field[3][4].markByPlayer(this.firstPlayer);
    this.field[4][3].markByPlayer(this.firstPlayer);
    this.secondPlayerCells = [this.field[3][3], this.field[4][4]];
    this.firstPlayerCells = [this.field[3][4], this.field[4][3]];
  }

  protected getField(): Cell[][] {
    return this.field.map(row => row.map(cell => cell));
  }

}
