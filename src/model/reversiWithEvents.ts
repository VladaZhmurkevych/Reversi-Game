import { EventEmitter } from 'events';
import Reversi from './reversi';
import Player from './player';

export enum ReversiEvent {
  GAME_STARTED = 'gameStarted',
  DRAW = 'draw',
  PLAYER_WON = 'playerWon',
  FIELD_UPDATE = 'fieldUpdate',
}

export default class ReversiWithEvents extends Reversi {
  private eventEmitter = new EventEmitter()

  protected prepareField() {
    super.prepareField();
    this.eventEmitter.emit(ReversiEvent.GAME_STARTED)
  }

  protected endGame(winner: Player) {
    super.endGame(winner);
    if (winner === null) {
      this.eventEmitter.emit(ReversiEvent.DRAW)
    } {
      this.eventEmitter.emit(ReversiEvent.PLAYER_WON, winner)
    }
  }

  protected markCell(x: number, y: number, player: Player) {
    super.markCell(x, y, player);
    this.eventEmitter.emit(ReversiEvent.FIELD_UPDATE, this.getField())
  }
}
