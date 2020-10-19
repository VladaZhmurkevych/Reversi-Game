import Reversi from '../reversi';
import Player from '../player';
import {logToFile} from '../../players/SmartAIPlayerWithOutput';
import {convertFromCoordinatesToString} from '../../index';
import Cell from '../cell';

export default class AntiReversi extends Reversi {
  protected endGame(winner: Player): void {
    const antiWinner = winner === this.firstPlayer ? this.secondPlayer : this.firstPlayer;
    super.endGame(antiWinner);
    process.exit(0);
  }

  public startGame(): void {
    super.startGame();
  }

  protected moveTurnToAnotherPlayer() {
    super.moveTurnToAnotherPlayer();
    this.switchPlayers();
    this.board.updateCellsAvailability(this.getCurrentPlayer(), this.isFirstPlayerMove);
  }

  protected async startProcessingPlayersMove(): Promise<void> {
    while (!this.isGameEnded()) {
      const move = await this.getCurrentPlayer().getNextMove(this.board);
      if (!move) {
        this.switchPlayers();
        this.board.updateCellsAvailability(this.getCurrentPlayer(), this.isFirstPlayerMove);
        continue;
      }
      const { x, y } = move;
      try {
        this.makeMove(x, y);
      } catch (err) {
        this.startProcessingPlayersMove();
        throw err;
      }
    }
  }

  makeMove(x: number, y: number) {
    super.makeMove(x, y);

    let data = '\n ' + JSON.stringify({ x, y }) + '  ' + convertFromCoordinatesToString({ x, y }) + '\n';

    data += '   ╬ A ╬ B ╬ C ╬ D ╬ E ╬ F ╬ G ╬ H ╬\n';
    data += '═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╬\n';
    for (let i = 0; i < 8; i++) {
      if (i !== 0) {
       data += '═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╬\n';
      }
      data +=` ${i + 1} ║ ${this.getField()[i].map((cell: Cell) => this.getFieldDisplayValue(cell)).join(' ║ ')} ║\n`;
    }
    data += ('════════════════════════════════════\n\n\n');
    logToFile(data);

  }

  private getFieldDisplayValue(cell: Cell) {
    if(cell.isEmpty) {
      return cell.isAvailable ? 'x' : ' ';
    } else {
      return cell.getValue().color[0];
    }
  }

}
