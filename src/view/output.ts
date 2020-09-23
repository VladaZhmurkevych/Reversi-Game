import ReversiWithEvents, {ReversiEvent} from '../model/reversiWithEvents';
import Player from '../model/player';
import Cell from '../model/cell';

export default class ConsoleOutput {
  public listenTo(game: ReversiWithEvents) {
    game.subscribe(ReversiEvent.DRAW, this.handleDraw)
    game.subscribe(ReversiEvent.GAME_STARTED, this.handleGameStarted)
    game.subscribe(ReversiEvent.FIELD_UPDATE, this.handleFieldUpdated)
    game.subscribe(ReversiEvent.PLAYER_WON, this.handlePlayerWon)
  }

  private handleDraw() {
    console.log('Game is over! No winner found');
  }

  private handlePlayerWon(player: Player) {
    console.log(`Game is over! Player ${player.name} won!`);
  }

  private handleFieldUpdated(field: Cell[][]) {
    for (let i = 0; i < 8; i++) {
      if (i !== 0) {
        console.log('═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══\n')
      }
      console.log(` ${field[i].join(' ║ ')} \n`)
    }
  }

  private handleGameStarted() {
    console.log('Game is started! Make your first move with MOVE X Y')
  }
}
