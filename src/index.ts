import readline from 'readline';
import Bot from './players/bot';
import ReversiBoardWithBlackHole from './model/antiReversi/reversiBoardWithBlackHole';
import AntiReversi from './model/antiReversi/antiReversi';
import MonteCarloAIPlayerWithOutput from './players/mcts/MonteCarloAIPlayerWithOutput';
import {Color} from './model/color.enum';
import {convertFromStringToCoordinates} from './utils';
import {GameInfo} from './gameInfo.interface';

const getGameInfo = (): Promise<GameInfo> => new Promise((resolve) => {
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

const main = async () => {
  const { color, blackHole, firstOpponentMove } = await getGameInfo();
  const blackHoleCoords = convertFromStringToCoordinates(blackHole);
  let firstOpponentMoveCoords;

  if (firstOpponentMove) {
    firstOpponentMoveCoords = convertFromStringToCoordinates(firstOpponentMove);
  }

  const botColor = color === Color.BLACK ? Color.WHITE : Color.BLACK;

  const bot = new Bot(botColor, firstOpponentMoveCoords);
  const ai = new MonteCarloAIPlayerWithOutput(4000, bot, color);
  const board = new ReversiBoardWithBlackHole(null, blackHoleCoords);
  const [firstPlayer, secondPlayer] = color === Color.BLACK ? [ai, bot] : [bot, ai];
  const game = new AntiReversi(board, firstPlayer, secondPlayer);
  game.startGame();
};

main();