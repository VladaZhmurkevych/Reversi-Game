import { Coordinates } from './reversi';
import ReversiBoard from './reversiBoard';

export enum Color {
  BLACK = 'black',
  WHITE = 'white'
}

export default abstract class Player {
  protected constructor(
    public readonly name: string,
    public readonly color: Color
  ) {}

  public abstract getNextMove(board?: ReversiBoard): Coordinates | Promise<Coordinates>;
}
