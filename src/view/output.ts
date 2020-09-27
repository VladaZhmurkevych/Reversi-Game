import ReversiWithEvents, {ReversiEvent} from '../model/reversiWithEvents';
import Player from '../model/player';
import Cell from '../model/cell';
import player from '../model/player';

const COLORS_MAP = {
  'red':  '\x1b[31m' + '⬤' + '\x1b[0m',
  'blue':  '\x1b[34m' + '⬤' + '\x1b[0m'
}

export default class ConsoleOutput {
  private playerToColorMap = {}

  constructor(firstPlayer: Player, secondPlayer: Player) {
    this.playerToColorMap = {
      [firstPlayer.name]: 'red',
      [secondPlayer.name]: 'blue'
    }
  }


  public listenTo(game: ReversiWithEvents) {
    game.subscribe(ReversiEvent.DRAW, this.handleDraw)
    game.subscribe(ReversiEvent.GAME_STARTED, this.handleGameStarted.bind(this))
    game.subscribe(ReversiEvent.FIELD_UPDATE, this.handleFieldUpdated.bind(this))
    game.subscribe(ReversiEvent.PLAYER_WON, this.handlePlayerWon)
    game.subscribe(ReversiEvent.SWITCH_PLAYERS, this.handleSwitchPlayers)
  }

  private handleSwitchPlayers(player: Player) {
    const playerColor = COLORS_MAP[this.playerToColorMap[player.name]]
    console.log(`Now the move of Player: ${player.name} ${playerColor}`)
  }

  private handleDraw() {
    console.log('Game is over! No winner found');
  }

  private handlePlayerWon(player: Player) {
    console.log(`Game is over! Player ${player.name} won!`);
  }

  private handleFieldUpdated(field: Cell[][]) {
    const getFieldDisplayValue = (cell: Cell) => cell.isEmpty ? ' ' : COLORS_MAP[this.playerToColorMap[cell.getValue().name]]
    console.log('   ╬ 1 ╬ 2 ╬ 3 ╬ 4 ╬ 5 ╬ 6 ╬ 7 ╬ 8 ╬')
    console.log('═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╬')
    for (let i = 0; i < 8; i++) {
      if (i !== 0) {
        console.log('═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╬')
      }
      console.log(` ${i + 1} ║ ${field[i].map(getFieldDisplayValue).join(' ║ ')} ║`)
    }
    console.log('════════════════════════════════════')
  }

  private handleGameStarted(field: Cell[][]) {
    this.handleFieldUpdated(field);
    console.log('Game is started! Make your first move with MOVE X Y')
  }
}
