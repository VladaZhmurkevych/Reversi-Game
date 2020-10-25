import { Coordinates } from './reversi';
import ReversiBoard from './reversiBoard';
import {Color} from "./color";

export default abstract class Player {
  protected constructor(
    public readonly name: string,
    public readonly color: Color
  ) {}

  public abstract getNextMove(board?: ReversiBoard): Coordinates | Promise<Coordinates>;
}
