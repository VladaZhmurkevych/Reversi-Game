import ReversiBoard from '../../model/reversiBoard';
import { Coordinates } from '../../model/reversi';
import {convertFromCoordinatesToString} from '../../utils';
import MonteCarloAIPlayer from './MonteCarloAIPlayer';

export default class MonteCarloAIPlayerWithOutput extends MonteCarloAIPlayer {
  getNextMove(board: ReversiBoard): Coordinates | Promise<Coordinates> {
    const move = super.getNextMove(board) as Coordinates;

    if (move) {
      console.log(convertFromCoordinatesToString(move));
    } else  {
      console.log('pass');
    }

    return move;
  }
}
