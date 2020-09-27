import ReversiWithEvents from '../model/reversiWithEvents';
import readline from 'readline'
import {
  ReversiCellIsNotAvailableError,
  ReversiGameIsEndedError,
  ReversiGameNotStartedError,
  ReversiWrongCoordinatesError
} from '../model/errors';

export enum Commands {
  START = 'start',
  EXIT = 'exit',
}

export default class ConsoleInput {
  private consoleReader = readline.createInterface({ input: process.stdin })

  public startProcessing(game: ReversiWithEvents): void {
    let command = null;
    console.log('Welcome to greatest Reversi game! Type START to play ')

    this.consoleReader.on('line', (data) => {
      command = data.toString().split(' ')
      switch (command[0]) {
        case Commands.START:
          game.startGame()
          break;
        case Commands.EXIT:
          this.consoleReader.close()
          break;
      }
    })
  }

  private handleError(error: Error): void {
    if (error instanceof ReversiWrongCoordinatesError) {
      console.log(`Wrong coordinates. Try again!`);
    } else if(error instanceof ReversiGameIsEndedError) {
      console.log(`Can not make move to (${error.y + 1},${error.x + 1}) - game is ended`);
    } else if(error instanceof ReversiCellIsNotAvailableError) {
      console.log(`Can not make move to (${error.y + 1},${error.x + 1}) - this cell is not available`);
    } else if (error instanceof ReversiGameNotStartedError) {
      console.log('Game wasn\'t started - enter start command at first');
    }
  }
}
