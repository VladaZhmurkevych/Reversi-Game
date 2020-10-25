import Cell from './cell';
import {Coordinates} from './reversi';
import Player from './player';
import {Color} from "./color";

export default class ReversiBoard {
  private readonly FIELD_SIZE = 8
  protected field: Cell[][]
  private firstPlayerCells: Cell[] = []
  private secondPlayerCells: Cell[] = []
  
  constructor(board?: ReversiBoard) {
    if (board) {
      this.field = board.getBoard();
      this.field.forEach(row => row.forEach(cell => {
        const cellPlayer = cell.getValue();
        if (!cellPlayer) return;
        
        if (cellPlayer.color === Color.BLACK) {
          this.firstPlayerCells.push(cell);
        } else {
          this.secondPlayerCells.push(cell);
        }
      }));
    }
  }
  
  public get isAnyEmptyCell(): boolean {
    return this.field.some((row) => row.some(cell => cell.isEmpty));
  }

  public markCell(x: number, y: number, player: Player, isFirstPlayer: boolean): void {
    const cell = this.field[x][y];

    if (isFirstPlayer) {
      this.firstPlayerCells.push(cell);
      if (!cell.isEmpty) {
        this.secondPlayerCells = this.secondPlayerCells.filter(secondPlayerCell => secondPlayerCell !== cell);
      }
    } else {
      this.secondPlayerCells.push(cell);

      if (!cell.isEmpty) {
        this.firstPlayerCells = this.firstPlayerCells.filter(firstPlayerCell => firstPlayerCell !== cell);
      }
    }

    cell.markByPlayer(player);
  }

  public prepareField(firstPlayer: Player, secondPlayer: Player): void {
    this.field = [];
    for (let x = 0; x < this.FIELD_SIZE; x++) {
      this.field[x] = [];
      for (let y = 0; y < this.FIELD_SIZE; y++) {
        this.field[x][y] = new Cell();
      }
    }

    this.field[3][3].markByPlayer(secondPlayer);
    this.field[4][4].markByPlayer(secondPlayer);
    this.field[3][4].markByPlayer(firstPlayer);
    this.field[4][3].markByPlayer(firstPlayer);
    this.secondPlayerCells = [this.field[3][3], this.field[4][4]];
    this.firstPlayerCells = [this.field[3][4], this.field[4][3]];
  }

  public getNeighborEnemyCells(x: number, y: number, currentPlayer: Player): Coordinates[] {
    const result = [];
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1 ; j++) {
        if (
          this.field[i]
          && this.field[i][j]
          && !this.field[i][j].isEmpty
          && this.field[i][j].getValue() !== currentPlayer
        ) {
          result.push({ x: i, y: j});
        }
      }
    }
    return result;
  }

  public setFieldUnavailable(): void {
    this.field.forEach((row: Cell[]) => row.forEach((cell: Cell) => cell.isAvailable = false));
  }

  public getBoard(): Cell[][] {
    return this.field.map(row => row.map(cell => cell.copy()));
  }

  public getCell(x: number, y: number): Cell {
    return this.field[x][y];
  }

  public getCurrentPlayerCells(isFirstPlayer: boolean): Cell[] {
    return isFirstPlayer ? this.firstPlayerCells : this.secondPlayerCells;
  }

  public getIsCellAvailable(x: number, y: number): boolean {
    return this.getCell(x, y).isAvailable;
  }

  public get isAnyCellAvailable(): boolean {
    return this.field.some((row) => row.some(cell => cell.isAvailable));
  }

  public markEarnedEnemyCells(x: number, y: number, currentPlayer: Player, isFirstPlayer: boolean): void {
    const neighborEnemyCellCoords = this.getNeighborEnemyCells(x, y, currentPlayer);
    neighborEnemyCellCoords.forEach((neighborCell) =>{
      const xDiff = neighborCell.x - x;
      const yDiff = neighborCell.y - y;

      let currX = neighborCell.x;
      let currY = neighborCell.y;

      while (currX < this.FIELD_SIZE && currX >= 0 && currY < this.FIELD_SIZE && currY >= 0) {
        if (this.field[currX][currY].isEmpty) {
          break;
        } else if (this.field[currX][currY].getValue() === currentPlayer) {
          this.markLineByPlayer({ x, y }, { x: currX, y: currY }, currentPlayer, isFirstPlayer);
          break;
        }

        currY += yDiff;
        currX += xDiff;
      }
    });
  }

  public markLineByPlayer(start: Coordinates, end: Coordinates, player: Player, isFirstPlayer: boolean): void {
    const xDiff = end.x - start.x > 0 ? 1 : end.x - start.x < 0 ? -1 : 0;
    const yDiff = end.y - start.y > 0 ? 1 : end.y - start.y < 0 ? -1 : 0;

    let currX = start.x;
    let currY = start.y;

    while (currX !== end.x || currY !== end.y) {
      currY += yDiff;
      currX += xDiff;

      this.markCell(currX, currY, player, isFirstPlayer);
    }
  }

  public updateCellsAvailability(currentPlayer: Player): void {
    const playerCells = this.getCurrentPlayerCells(currentPlayer.color === Color.BLACK);
    this.setFieldUnavailable();
    for (let x = 0; x < this.FIELD_SIZE; x++) {
      for (let y = 0; y < this.FIELD_SIZE; y++) {
        if (playerCells.includes(this.field[x][y])) {
          const neighborEnemyCellCoords = this.getNeighborEnemyCells(x, y, currentPlayer);
          neighborEnemyCellCoords.forEach((neighborCell) =>{
            const xDiff = neighborCell.x - x;
            const yDiff = neighborCell.y - y;

            let currX = neighborCell.x;
            let currY = neighborCell.y;

            while (currX < this.FIELD_SIZE && currX >= 0 && currY < this.FIELD_SIZE && currY >= 0) {
              currY += yDiff;
              currX += xDiff;
              const fieldExists = this.field[currX] && this.field[currX][currY];
              if (fieldExists && this.field[currX][currY].isEmpty) {
                this.field[currX][currY].isAvailable = true;
                break;
              } else if (fieldExists && this.field[currX][currY]!.getValue() === currentPlayer) {
                break;
              }
            }
          });
        }
      }
    }
  }

  public getPlayerWithMoreCells(firstPlayer: Player, secondPlayer: Player): Player {
    const isDraw = this.firstPlayerCells.length === this.secondPlayerCells.length;
    if (isDraw) return null;

    return this.secondPlayerCells.length > this.firstPlayerCells.length ? secondPlayer : firstPlayer;
  }

  public getPlayerScore(color: Color): number {
    return color === Color.BLACK ? this.firstPlayerCells.length : this.secondPlayerCells.length;
  }
}
