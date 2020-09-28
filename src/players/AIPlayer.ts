import Player from '../model/player';
import Cell from '../model/cell';
import { Coordinates } from '../model/reversi';

export default class AIPlayer extends Player {
  constructor() {
    super('Computer');
  }

  public getNextMove(field: Cell[][]): Coordinates {
    const availableCells = this.getAvailableCells(field);
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
