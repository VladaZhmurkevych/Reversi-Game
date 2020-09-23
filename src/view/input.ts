import ReversiWithEvents from '../model/reversiWithEvents';
import readline from 'readline'

export enum Commands {
  START = 'start',
  EXIT = 'exit',
  MOVE = 'move',
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
        case Commands.MOVE:
          const x = parseInt(command[1]) - 1
          const y = parseInt(command[2]) - 1
          game.makeMove(y, x)
          break;
      }
    })
  }
}
