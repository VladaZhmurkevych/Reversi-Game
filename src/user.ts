import Player from './model/player';
import readline from "readline";
import {Coordinates} from './model/reversi';

export default class User extends Player {
  private consoleReader = readline.createInterface({ input: process.stdin })

  constructor(name: string) {
    super(name);
  }

  public getNextMove(): Coordinates | Promise<Coordinates> {
    let command = null;
    console.log('Make your move with the command: MOVE X Y')
    return new Promise<Coordinates>((resolve => {
      this.consoleReader.on('line', (data) => {
        command = data.toString().split(' ')
        switch (command[0]) {
          case 'move':
            const y = parseInt(command[1]) - 1
            const x = parseInt(command[2]) - 1
            resolve({ x, y })
            break;
        }
      })
    }))
  }



}
