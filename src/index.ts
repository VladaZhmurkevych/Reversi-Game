import readline from 'readline';
import {Color} from './model/player';
import Bot from './players/bot';
import ReversiBoardWithBlackHole from './model/antiReversi/reversiBoardWithBlackHole';
import AntiReversi from './model/antiReversi/antiReversi';
import {Coordinates} from './model/reversi';
import SmartAIPlayerWithOutput, {logToFile} from './players/SmartAIPlayerWithOutput';
import AIPlayer from './players/AIPlayer';
import {ReversiCellIsNotAvailableError} from './model/errors';

const getGameInfo = (): Promise<{ color: Color, blackHole: string, firstOpponentMove: string }> => new Promise((resolve) => {
  const consoleReader = readline.createInterface({ input: process.stdin });

  let blackHole = null;
  let color = null;
  let firstOpponentMove = null;

  consoleReader.on('line', (data) => {
    if (!blackHole) {
      blackHole = data;
      return;
    } else if (!color) {
      color = data;

      if (data === Color.WHITE) {
        return;
      }
    } else if (!firstOpponentMove) {
      firstOpponentMove = data;
    }

    consoleReader.close();
  });

  consoleReader.on('close', () => {
    resolve({ color, blackHole, firstOpponentMove });
  });
});

const LETTERS_ARRAY = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const convertFromStringToCoordinates = (data: string): Coordinates => {
  const [letter, number] = data.split('');
  const x = parseInt(number) - 1;
  const y = LETTERS_ARRAY.indexOf(letter);
  return { x, y }; 
};

export const convertFromCoordinatesToString = (coords: Coordinates) => {
  const letter = LETTERS_ARRAY[coords.y];
  const number = coords.x + 1;
  
  return `${letter}${number}`;
};

const main = async () => {
  const { color, blackHole, firstOpponentMove } = await getGameInfo();
  const blackHoleCoords = convertFromStringToCoordinates(blackHole);
  let firstOpponentMoveCoords;

  if (firstOpponentMove) {
    firstOpponentMoveCoords = convertFromStringToCoordinates(firstOpponentMove);
  }

  const bot = new Bot(color === Color.BLACK ? Color.WHITE : Color.BLACK, firstOpponentMoveCoords);
  // const bot = new AIPlayer(color === Color.BLACK ? Color.WHITE : Color.BLACK);
  const ai = new SmartAIPlayerWithOutput(3, color, bot);
  const board = new ReversiBoardWithBlackHole(null, blackHoleCoords);
  const [firstPlayer, secondPlayer] = color === Color.BLACK ? [ai, bot] : [bot, ai];
  const game = new AntiReversi(board, firstPlayer, secondPlayer);
  game.startGame();
};

main();

process.on('uncaughtException', (e: ReversiCellIsNotAvailableError) => {

  // logToFile('error' + e.message + '   ' + JSON.stringify(e.stack, null, 2));
  if (e.x) {
    console.log(e, 'x: ', e.x, ' y: ', e.y);
  }

  process.exit(1);
});

process.on('unhandledRejection', (e: ReversiCellIsNotAvailableError) => {
  if (e.x) {
    console.log('ERR' + 'x: ' + e.x + ' y: ' + e.y + ' coords ' + convertFromCoordinatesToString({ x: e.x, y: e.y }));
  }

  console.log(e);
  process.exit(1);
});
