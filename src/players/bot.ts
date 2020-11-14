import Player from '../model/player';
import { Coordinates } from '../model/reversi';
import readline from "readline";
import {convertFromStringToCoordinates} from '../utils';
import {Color} from '../model/color.enum';

export default class Bot extends Player {
  private movesQueue: Coordinates[] = []
  private consoleReader = readline.createInterface({ input: process.stdin })

  constructor(color: Color, firstMove?: Coordinates) {
    super('Bot', color);
    if (firstMove) {
      this.movesQueue.push(firstMove);
    }
    this.listenToInput();
  }

  private listenToInput(): void {
    this.consoleReader.on('line', (data) => {
      this.movesQueue.push(convertFromStringToCoordinates(data));
    });
  }

  getNextMove(): Coordinates | Promise<Coordinates> {
    return new Promise((resolve) => {
      if (this.movesQueue.length === 0) {
        const interval = setInterval(() => {
          if (this.movesQueue.length !== 0) {
            clearInterval(interval);
            resolve(this.movesQueue.pop());
          }
        }, 100);
      }
      else {
        resolve(this.movesQueue.pop());
      }
    });
  }
}