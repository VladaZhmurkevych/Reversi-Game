import Cell from './cell';
import { Coordinates } from './reversi';

export default abstract class Player {
  constructor(public name: string) {}

  public abstract getNextMove(field?: Cell[][]): Coordinates | Promise<Coordinates>;
}

