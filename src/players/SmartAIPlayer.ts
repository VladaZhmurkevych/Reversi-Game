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

  private VALUE_MATRIX = [
    [-99, 48, -8, 6, 6, -8, 48,-99],
    [ 48, -8,-16, 3, 3,-16, -8, 48],
    [ -8,-16,  4, 4, 4,  4,-16, -8],
    [  6,  3,  4, 0, 0,  4,  3,  6],
    [  6,  3,  4, 0, 0,  4,  3,  6],
    [ -8,-16,  4, 4, 4,  4,-16, -8],
    [ 48, -8,-16, 3, 3,-16, -8, 48],
    [-99, 48, -8, 6, 6, -8, 48,-99],
  ]

  private getCellValue({x, y}: Coordinates): number {
    return this.VALUE_MATRIX[x][y];
  }

  // public minMax(board: ReversiBoard, depth: number, isAITurn: boolean, alpha: number, beta: number, lastMove?: Coordinates): number {
  //   if (depth === this.MAX_DEPTH) {
  //     return this.getCellValue(lastMove);
  //   }
  //
  //   const currentPlayer = isAITurn ? this : this.enemy;
  //
  //   board.updateCellsAvailability(currentPlayer, currentPlayer.color === Color.BLACK);
  //
  //   const availableCells = this.getAvailableCells(board.getBoard());
  //   if(availableCells.length === 0) {
  //     const copyBoard = new ReversiBoard(board);
  //     const nextPlayer = currentPlayer === this ? this.enemy : this;
  //     copyBoard.updateCellsAvailability(nextPlayer, nextPlayer.color === Color.BLACK);
  //     if(this.getAvailableCells(copyBoard.getBoard()).length === 0) {
  //       const AIScore = copyBoard.getPlayerScore(this.color);
  //       const enemyScore = copyBoard.getPlayerScore(this.enemy.color);
  //       return AIScore > enemyScore ? Number.MAX_VALUE : Number.MIN_VALUE;
  //     }
  //   }
  //
  //   let bestScore;
  //
  //   if (isAITurn) {
  //     bestScore = Number.MAX_VALUE;
  //
  //     if (availableCells.length === 0) {
  //       const boardCopy = new ReversiBoard(board);
  //       const score = this.minMax(boardCopy, depth + 1, false, alpha, beta, lastMove);
  //       if (score < bestScore) {
  //         bestScore = score;
  //       }
  //
  //       return bestScore;
  //     }
  //
  //     // const availableBoards = this.getAvailableBoards(board, availableCells, this);
  //     // // availableBoards.sort((a, b) => a.getPlayerScore(this.color) - b.getPlayerScore(this.color));
  //     //
  //     //
  //     // for (const boardCopy of availableBoards) {
  //     //   const score = this.minMax(boardCopy, depth + 1, false, alpha, beta);
  //     //   if (score < bestScore) {
  //     //     bestScore = score;
  //     //   }
  //     //   beta = Math.min(beta, bestScore);
  //     //   if (beta <= alpha) {
  //     //     break;
  //     //   }
  //     // }
  //
  //     for (const cell of availableCells) {
  //       const boardCopy = new ReversiBoard(board);
  //       boardCopy.markCell(cell.x, cell.y, this, this.color === Color.BLACK);
  //       boardCopy.markEarnedEnemyCells(cell.x, cell.y, this, this.color === Color.BLACK);
  //       const score = this.minMax(boardCopy, depth + 1, false, alpha, beta, cell);
  //       if (score < bestScore) {
  //         bestScore = score;
  //       }
  //       beta = Math.min(beta, bestScore);
  //       if (beta <= alpha) {
  //         break;
  //       }
  //     }
  //
  //   } else {
  //     bestScore = Number.MIN_VALUE;
  //
  //     if (availableCells.length === 0) {
  //       const boardCopy = new ReversiBoard(board);
  //       const score = this.minMax(boardCopy, depth + 1, true, alpha, beta, lastMove);
  //       if (score > bestScore) {
  //         bestScore = score;
  //       }
  //
  //       return bestScore;
  //     }
  //
  //     // const availableBoards = this.getAvailableBoards(board, availableCells, this.enemy);
  //     // // availableBoards.sort((a, b) => b.getPlayerScore(this.color) - a.getPlayerScore(this.color));
  //     //
  //     // for (const boardCopy of availableBoards) {
  //     //   const score = this.minMax(boardCopy, depth + 1, true, alpha, beta);
  //     //   if (score > bestScore) {
  //     //     bestScore = score;
  //     //   }
  //     //   alpha = Math.max(alpha, bestScore);
  //     //   if (alpha >= beta) {
  //     //     break;
  //     //   }
  //     // }
  //
  //     for (const cell of availableCells) {
  //       const boardCopy = new ReversiBoard(board);
  //       boardCopy.markCell(cell.x, cell.y, this.enemy, this.enemy.color === Color.BLACK);
  //       boardCopy.markEarnedEnemyCells(cell.x, cell.y, this.enemy, this.enemy.color === Color.BLACK);
  //       const score = this.minMax(boardCopy, depth + 1, true, alpha, beta, cell);
  //       if (score > bestScore) {
  //         bestScore = score;
  //       }
  //       alpha = Math.max(alpha, bestScore);
  //       if (alpha >= beta) {
  //         break;
  //       }
  //     }
  //   }
  //
  //   return bestScore;
  // }
  //

  public minMax(board: ReversiBoard, depth: number, isAITurn: boolean, alpha: number, beta: number): number {
    if (depth === this.MAX_DEPTH) {
      return board.getPlayerScore(this.color);
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
      bestScore = Number.MAX_VALUE;

      if (availableCells.length === 0) {
        return Number.MIN_VALUE;
        const boardCopy = new ReversiBoard(board);
        const score = this.minMax(boardCopy, depth + 1, false, alpha, beta);
        if (score < bestScore) {
          bestScore = score;
        }

        return bestScore;
      }

      const availableBoards = this.getAvailableBoards(board, availableCells, this);
      // availableBoards.sort((a, b) => a.getPlayerScore(this.color) - b.getPlayerScore(this.color));


      for (const boardCopy of availableBoards) {
        const score = this.minMax(boardCopy, depth + 1, false, alpha, beta);
        if (score < bestScore) {
          bestScore = score;
        }
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) {
          break;
        }
      }

    } else {
      bestScore = Number.MIN_VALUE;

      if (availableCells.length === 0) {
        return Number.MAX_VALUE;
        const boardCopy = new ReversiBoard(board);
        const score = this.minMax(boardCopy, depth + 1, true, alpha, beta);
        if (score > bestScore) {
          bestScore = score;
        }

        return bestScore;
      }

      const availableBoards = this.getAvailableBoards(board, availableCells, this.enemy);
      // availableBoards.sort((a, b) => b.getPlayerScore(this.color) - a.getPlayerScore(this.color));

      for (const boardCopy of availableBoards) {
        const score = this.minMax(boardCopy, depth + 1, true, alpha, beta);
        if (score > bestScore) {
          bestScore = score;
        }
        alpha = Math.max(alpha, bestScore);
        if (alpha >= beta) {
          break;
        }
      }
    }

    return bestScore;
  }

  public getNextMove(board: ReversiBoard): Coordinates | Promise<Coordinates> {
    let coordinates: Coordinates = null;
    let bestScore = Number.MAX_VALUE;
    const availableCells = this.getAvailableCells(board.getBoard());

    availableCells.forEach((cell: Coordinates) => {
      const boardCopy = new ReversiBoard(board);
      boardCopy.markCell(cell.x, cell.y, this, this.color === Color.BLACK);
      boardCopy.markEarnedEnemyCells(cell.x, cell.y, this, this.color === Color.BLACK);
      const score = this.minMax(boardCopy, 0, false, Number.MIN_VALUE, Number.MAX_VALUE);
      if (score < bestScore) {
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

  private createAvailableBoard(board: ReversiBoard, cell: Coordinates, player: Player): ReversiBoard {
    const boardCopy = new ReversiBoard(board);
    boardCopy.markCell(cell.x, cell.y, player, player.color === Color.BLACK);
    boardCopy.markEarnedEnemyCells(cell.x, cell.y, player, player.color === Color.BLACK);
    return boardCopy;
  }

  private getAvailableBoards(board: ReversiBoard, availableCells: Coordinates[], player): ReversiBoard[] {
    return availableCells.map((coordinates) => this.createAvailableBoard(board, coordinates, player));
  }
}
