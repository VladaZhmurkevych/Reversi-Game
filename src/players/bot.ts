import Player, {Color} from '../model/player';
import { Coordinates } from '../model/reversi';
import readline from "readline";
import {convertFromStringToCoordinates} from '../index';

export default class Bot extends Player {
  private prevMove: Coordinates;
  private nextMove: Coordinates;
  private consoleReader = readline.createInterface({ input: process.stdin })

  constructor(color: Color, firstMove?: Coordinates) {
    super('Bot', color);
    if (firstMove) {
      this.nextMove = firstMove;
    }
    this.listenToInput();
  }

  private listenToInput(): void {
    this.consoleReader.on('line', (data) => {
      this.nextMove = convertFromStringToCoordinates(data);
    });
  }

  getNextMove(): Coordinates | Promise<Coordinates> {
    // console.log('NEXT BOT MOVE', this.nextMove);
    return new Promise((resolve) => {
      if (this.prevMove === this.nextMove) {
        setTimeout(() => {
          this.prevMove = this.nextMove;
          resolve(this.nextMove);
        }, 100);
      } else {
        this.prevMove = this.nextMove;
        resolve(this.nextMove);
      }
    })

  }
}
