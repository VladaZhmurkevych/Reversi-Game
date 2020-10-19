import Player, {Color} from '../model/player';
import Cell from '../model/cell';
import ReversiBoard from '../model/reversiBoard';
import {Coordinates} from '../model/reversi';

export default class SmartAIPlayer extends Player {
  private MAX_DEPTH: number;
  private enemy: Player;

  constructor(maxDepth: number, color: Color, enemy: Player) {
    super('SmartAIPlayer', color);
    this.MAX_DEPTH = maxDepth;
    this.enemy = enemy;
  }

  public minMax(board: ReversiBoard, depth: number, isAITurn: boolean): number {
    if (depth === this.MAX_DEPTH) {
      return board.getPlayerScore(this.enemy.color);
    }

    const currentPlayer = isAITurn ? this : this.enemy;

    board.updateCellsAvailability(currentPlayer, currentPlayer.color === Color.BLACK);

    const availableCells = this.getAvailableCells(board.getBoard());
    if(availableCells.length === 0) {
      const copyBoard = new ReversiBoard(board);
      const nextPlayer = currentPlayer === this ? this.enemy : this;
      copyBoard.updateCellsAvailability(nextPlayer, nextPlayer.color === Color.BLACK);
      if(this.getAvailableCells(copyBoard.getBoard()).length === 0) {
       const AIScore = copyBoard.getPlayerScore(this.color);
       const enemyScore = copyBoard.getPlayerScore(this.enemy.color);
       return AIScore > enemyScore ? Number.MAX_VALUE : Number.MIN_VALUE;
      }
    }

    let bestScore;

    if (isAITurn) {
      bestScore = Number.MIN_VALUE;

      availableCells.forEach((cell: Coordinates) => {
        const boardCopy = new ReversiBoard(board);
        boardCopy.markCell(cell.x, cell.y, this, this.color === Color.BLACK);
        boardCopy.markEarnedEnemyCells(cell.x, cell.y, this, this.color === Color.BLACK);
        const score = this.minMax(boardCopy, depth + 1, false);
        if (score > bestScore) {
          bestScore = score;
        }
      });

    } else {
      bestScore = Number.MAX_VALUE;

      availableCells.forEach((cell: Coordinates) => {
        const boardCopy = new ReversiBoard(board);
        boardCopy.markCell(cell.x, cell.y, this.enemy, this.enemy.color === Color.BLACK);
        boardCopy.markEarnedEnemyCells(cell.x, cell.y, this.enemy, this.enemy.color === Color.BLACK);
        const score = this.minMax(boardCopy, depth + 1, true);
        if (score < bestScore) {
          bestScore = score;
        }
      });
    }

    return bestScore;
  }

  public getNextMove(board: ReversiBoard): Coordinates | Promise<Coordinates> {
    let coordinates: Coordinates = null;
    let bestScore = Number.MIN_VALUE;
    const availableCells = this.getAvailableCells(board.getBoard());

    availableCells.forEach((cell: Coordinates) => {
      const boardCopy = new ReversiBoard(board);
      boardCopy.markCell(cell.x, cell.y, this, this.color === Color.BLACK);
      boardCopy.markEarnedEnemyCells(cell.x, cell.y, this, this.color === Color.BLACK);
      const score = this.minMax(boardCopy, 0, false);
      if (score > bestScore) {
        bestScore = score;
        coordinates = cell;
      }
    });

    return coordinates || availableCells[0] || null;
  }

  private getAvailableCells(field: Cell[][]): Coordinates[] {
    return field.flatMap((row, x) => {
      return row.reduce((acc, cell, y) => (
        cell.isAvailable ? [...acc, { x, y }] : acc), []
      );
    });
  }
}
