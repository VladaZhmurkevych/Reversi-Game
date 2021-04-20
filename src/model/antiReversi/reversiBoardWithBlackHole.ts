import ReversiBoard from '../reversiBoard';
import Player from '../player';
import {Coordinates} from '../reversi';
import BlackHoleCell from './blackHoleCell';

export default class ReversiBoardWithBlackHole extends ReversiBoard {

  private blackHole: Coordinates;

  constructor(board?: ReversiBoard, blackHole?: Coordinates) {
    super(board);
    this.blackHole = blackHole;
  }

  prepareField(firstPlayer:Player, secondPlayer:Player): void {
    super.prepareField(firstPlayer, secondPlayer);
    this.field[this.blackHole.x][this.blackHole.y] = new BlackHoleCell();
  }

}
