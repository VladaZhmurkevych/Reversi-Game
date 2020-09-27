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

  public startGame() {
    super.startGame();
    this.eventEmitter.emit(ReversiEvent.GAME_STARTED, this.getField())
  }

  protected endGame(winner: Player) {
    super.endGame(winner);
    if (winner === null) {
      this.eventEmitter.emit(ReversiEvent.DRAW)
    } {
      this.eventEmitter.emit(ReversiEvent.PLAYER_WON, winner)
    }
  }

  protected switchPlayers() {
    super.switchPlayers()
    this.eventEmitter.emit(ReversiEvent.SWITCH_PLAYERS, this.currentPlayer)
  }

  public makeMove(x: number, y: number) {
    super.makeMove(x, y);
    this.eventEmitter.emit(ReversiEvent.FIELD_UPDATE, this.getField())
  }

  public subscribe(event: ReversiEvent, handler): void {
    this.eventEmitter.on(event, handler);
  }
}
