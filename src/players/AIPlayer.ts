import Player from '../model/player';
import Cell from '../model/cell';
import { Coordinates } from '../model/reversi';
import ReversiBoard from '../model/reversiBoard';
import {Color} from "../model/color";

export default class AIPlayer extends Player {
  constructor(color: Color) {
    super('Computer', color);
  }

  public getNextMove(board: ReversiBoard): Coordinates {
    const availableCells = this.getAvailableCells(board.getBoard());
    const cellIndex = Math.floor(Math.random() * Math.floor(availableCells.length));
    return availableCells[cellIndex];
  }

  private getAvailableCells(field: Cell[][]) {
    return field.flatMap((row, x) => {
      return row.reduce((acc, cell, y) => (
        cell.isAvailable ? [...acc, { x, y }] : acc), []
      );
    });
  }
}
