import Reversi from '../reversi';
import Player from '../player';

export default class AntiReversi extends Reversi {
  protected endGame(winner: Player): void {
    const antiWinner = winner === this.firstPlayer ? this.secondPlayer : this.firstPlayer;
    super.endGame(antiWinner);
    process.exit(0);
  }

  public startGame(): void {
    super.startGame();
  }

  protected moveTurnToAnotherPlayer(): void {
    super.moveTurnToAnotherPlayer();
    this.switchPlayers();
    this.board.updateCellsAvailability(this.getCurrentPlayer());
  }

  protected async startProcessingPlayersMove(): Promise<void> {
    while (!this.isGameEnded()) {
      const move = await this.getCurrentPlayer().getNextMove(this.board);
      if (!move) {
        this.switchPlayers();
        this.board.updateCellsAvailability(this.getCurrentPlayer());
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
}
