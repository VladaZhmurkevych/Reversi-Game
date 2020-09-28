import { EventEmitter } from 'events';
import Reversi from './reversi';
import Player from './player';

export enum ReversiEvent {
  GAME_STARTED = 'gameStarted',
  DRAW = 'draw',
  PLAYER_WON = 'playerWon',
  FIELD_UPDATE = 'fieldUpdate',
  SWITCH_PLAYERS = 'switchPlayers',
}

export default class ReversiWithEvents extends Reversi {
  private eventEmitter = new EventEmitter()

  public startGame(): void {
    super.startGame();
    this.eventEmitter.emit(ReversiEvent.GAME_STARTED, this.getField());
    this.eventEmitter.emit(ReversiEvent.SWITCH_PLAYERS, this.getCurrentPlayer());
  }

  protected endGame(winner: Player): void {
    super.endGame(winner);
    if (winner === null) {
      this.eventEmitter.emit(ReversiEvent.DRAW);
    } {
      this.eventEmitter.emit(ReversiEvent.PLAYER_WON, winner);
    }
  }

  public makeMove(x: number, y: number): void {
    super.makeMove(x, y);
    this.eventEmitter.emit(ReversiEvent.FIELD_UPDATE, this.getField());

    if (!this.isGameEnded()) {
      this.eventEmitter.emit(ReversiEvent.SWITCH_PLAYERS, this.getCurrentPlayer());
    }
  }

  public subscribe(event: ReversiEvent, handler: () => void): void {
    this.eventEmitter.on(event, handler);
  }
}
