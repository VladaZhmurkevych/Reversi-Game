import Player from './player';
import {
  ReversiCellIsNotAvailableError,
  ReversiGameIsEndedError,
  ReversiGameNotStartedError,
  ReversiWrongCoordinatesError
} from './errors';
import ReversiBoard from './reversiBoard';
import Cell from './cell';

export interface Coordinates { x: number, y: number}

export default class Reversi {
  private winner: Player
  private isEnded = false
  private currentPlayer: Player;

  constructor(
    protected readonly board: ReversiBoard,
    public readonly firstPlayer: Player,
    public readonly secondPlayer: Player
  ) {}

  public makeMove(x: number, y: number): void {
    if (!this.board.getBoard()) {
      throw new ReversiGameNotStartedError();
    }

    if (this.isEnded) {
      throw new ReversiGameIsEndedError(x, y);
    }

    if(isNaN(x) || isNaN(y) || x > 8 || x < 0 || y > 8 || y < 0) {
      throw new ReversiWrongCoordinatesError();
    }

    if (!this.board.getIsCellAvailable(x, y)) {
      throw new ReversiCellIsNotAvailableError(x, y);
    }

    this.board.markCell(x, y, this.currentPlayer, this.isFirstPlayerMove);
    this.board.markEarnedEnemyCells(x, y, this.currentPlayer, this.isFirstPlayerMove);
    this.switchPlayers();
    this.board.updateCellsAvailability(this.currentPlayer, this.isFirstPlayerMove);
    this.checkGameEnd();
  }

  protected get isFirstPlayerMove(): boolean {
    return this.currentPlayer === this.firstPlayer;
  }

  protected isGameEnded(): boolean {
    return this.isEnded;
  }

  protected getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  protected startGame(): void {
    this.currentPlayer = this.firstPlayer;
    this.board.prepareField(this.firstPlayer, this.secondPlayer);
    this.board.updateCellsAvailability(this.currentPlayer, this.isFirstPlayerMove);
    this.winner = null;
    this.isEnded = false;
    this.startProcessingPlayersMove();
  }

  protected moveTurnToAnotherPlayer(): void {
    this.switchPlayers();
    this.board.updateCellsAvailability(this.currentPlayer, this.isFirstPlayerMove);
    if (!this.board.isAnyCellAvailable) {
      this.endGame(this.board.getPlayerWithMoreCells(this.firstPlayer, this.secondPlayer));
    }
  }

  protected endGame(winner: Player): void {
    this.isEnded = true;
    this.winner = winner;
  }

  protected async startProcessingPlayersMove(): Promise<void> {
    while (!this.isEnded) {
      const { x, y } = await this.currentPlayer.getNextMove(this.board);
      try {
        this.makeMove(x, y);
      } catch (err) {
        this.startProcessingPlayersMove();
        throw err;
      }
    }
  }

  private checkGameEnd(): void {
    if (!this.board.isAnyEmptyCell) {
      return this.endGame(this.board.getPlayerWithMoreCells(this.firstPlayer, this.secondPlayer));
    }

    if(!this.board.isAnyCellAvailable) {
      this.moveTurnToAnotherPlayer();
    }
  }

  protected switchPlayers(): void {
    this.currentPlayer = this.isFirstPlayerMove ? this.secondPlayer : this.firstPlayer;
  }

  public getField(): Cell[][] {
    return this.board.getBoard();
  }
}
