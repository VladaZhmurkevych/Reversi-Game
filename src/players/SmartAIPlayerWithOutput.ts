import ReversiBoard from '../model/reversiBoard';
import { Coordinates } from '../model/reversi';
import {convertFromCoordinatesToString} from '../index';
import SmartAIMonteCarloPlayer from './mcts/SmartAIMonteCarloPlayer';

export default class SmartAIPlayerWithOutput extends SmartAIMonteCarloPlayer {
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
