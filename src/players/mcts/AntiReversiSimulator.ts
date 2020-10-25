import ReversiBoard from '../../model/reversiBoard';
import {Coordinates} from '../../model/reversi';
import Player, {Color} from '../../model/player';

export default class AntiReversiSimulator {
  private currentPlayer: Player;
  private board: ReversiBoard;

  constructor(board?: ReversiBoard, private aiPlayer?: Player, private enemy?: Player) {
    this.board = board;
    this.currentPlayer = aiPlayer;
  }

  public getAvailableCells(): Coordinates[] {
    return this.board.getBoard().flatMap((row, x) => {
      return row.reduce((acc, cell, y) => (
        cell.isAvailable ? [...acc, { x, y }] : acc), []
      );
    });
  }

  public getAvailableEnemyCells(): Coordinates[] {
    this.switchPlayers();
    this.board.updateCellsAvailability(this.currentPlayer);
    return this.getAvailableCells();
  }

  public makeMove(cell: Coordinates): void {
    this.board.markCell(cell.x, cell.y, this.currentPlayer, this.currentPlayer.color === Color.BLACK);
    this.board.markEarnedEnemyCells(cell.x, cell.y, this.currentPlayer, this.currentPlayer.color === Color.BLACK);
    this.switchPlayers();
    this.board.updateCellsAvailability(this.currentPlayer);
  }


  public getWinner(): Player {
    const firstScore = this.board.getPlayerScore(this.aiPlayer.color);
    const secondScore = this.board.getPlayerScore(this.enemy.color);
    return firstScore < secondScore ? this.enemy : this.aiPlayer;
  }

  public get activePlayer(): Player {
    return this.currentPlayer;
  }

  private switchPlayers() {
    this.currentPlayer = this.aiPlayer === this.currentPlayer ? this.enemy : this.aiPlayer;
  }
}
