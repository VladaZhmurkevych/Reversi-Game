import SmartAIPlayer from './SmartAIPlayer';
import ReversiBoard from '../model/reversiBoard';
import { Coordinates } from '../model/reversi';
import {convertFromCoordinatesToString} from '../index';
import {appendFile} from 'fs';
import {promisify} from 'util';

const writeFile = promisify(appendFile);

export const logToFile = (data) => writeFile('logs.txt', data, 'utf8').catch(e => console.error(e));

export default class SmartAIPlayerWithOutput extends SmartAIPlayer {
  getNextMove(board: ReversiBoard): Coordinates | Promise<Coordinates> {
    // console.log('logToFile');
    logToFile('\n getNextMove CALLED');

    const move = super.getNextMove(board) as Coordinates;

    if (move) {
      console.log(convertFromCoordinatesToString(move));
    } else  {
      console.log('pass');
    }

    return move;
  }
}
