import SmartAIPlayer from './SmartAIPlayer';
import ReversiBoard from '../model/reversiBoard';
import { Coordinates } from '../model/reversi';
import {convertFromCoordinatesToString} from '../index';
import {appendFile, writeFile} from 'fs';
import {promisify} from 'util';

const writeToFile = promisify(writeFile);
const appendToFile = promisify(appendFile);

// export const logToFile = (data) => writeFile('logs.txt', data, 'utf8').catch(e => console.error(e));
export const logToFile = (data) => {
  return
};

const log = (data) => appendToFile('time_logs.txt', data, 'utf8').catch(e => console.error(e));

export const logToFileTime = (data) => writeToFile('time_logs.txt', data, 'utf8').catch(e => console.error(e));

export const lotABPrunning = (count) => writeToFile('time_logs.txt', count, 'utf8').catch(e => console.error(e));

export default class SmartAIPlayerWithOutput extends SmartAIPlayer {
  timeArray = [];
  maxTime = 0;
  getNextMove(board: ReversiBoard): Coordinates | Promise<Coordinates> {
    // console.log('logToFile');
    logToFile('\n getNextMove CALLED');
    const start = Date.now();


    const move = super.getNextMove(board) as Coordinates;

    // console.log(`move: ${move}\n`);
    if (move) {
      console.log(convertFromCoordinatesToString(move));
    } else  {
      console.log('pass');
    }

    const end = Date.now();
    this.timeArray.push(end - start);
    if (end - start > this.maxTime) {
      this.maxTime = end - start;
    }
    const res = `Average Time: ${this.timeArray.reduce((acc, item) => acc + item, 0) / this.timeArray.length}\nMax Time: ${this.maxTime}`;
    if (res) logToFileTime(res);
    // console.log('end');
    return move;

  }
}
