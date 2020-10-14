import Player, {Color} from '../model/player';
import readline from "readline";
import {Coordinates} from '../model/reversi';

export default class User extends Player {
  private consoleReader = readline.createInterface({ input: process.stdin })

  constructor(name: string, color: Color) {
    super(name, color);
    this.getNextMove = this.getNextMove.bind(this);
  }

  public getNextMove(): Coordinates | Promise<Coordinates> {
    let command = null;
    return new Promise<Coordinates>((resolve => {
      const handler = (data) => {
        command = data.toString().split(' ');
        switch (command[0]) {
          case 'move':
            const y = parseInt(command[1]) - 1;
            const x = parseInt(command[2]) - 1;
            this.consoleReader.off('line', handler);
            resolve({ x, y });
            break;
        }
      };
      this.consoleReader.on('line', handler);
    }));
  }

}
