import ReversiWithEvents from './model/reversiWithEvents';
import ConsoleOutput from './view/output';
import ConsoleInput from './controll/input';
import readline from "readline";
import User from './players/user';
import AIPlayer from './players/AIPlayer';
import {
  ReversiCellIsNotAvailableError,
  ReversiGameIsEndedError,
  ReversiGameNotStartedError,
  ReversiWrongCoordinatesError
} from './model/errors';

const main = () => {
  const consoleReader = readline.createInterface({ input: process.stdin });
  console.log('Do you want play vs Computer(1) or vs another Player(2)? Type number in the console.');
  consoleReader.question('', (response) => {
    const numResponse = parseInt(response);
    if (numResponse !== 1 && numResponse !== 2) {
      console.log('Wrong input. Player vs Player mode is chosen by default');
    }
    const firstPlayer = new User('A');
    const secondPlayer = numResponse === 1 ? new AIPlayer() :  new User('B');

    const game = new ReversiWithEvents(firstPlayer, secondPlayer);
    const output = new ConsoleOutput(firstPlayer, secondPlayer);
    output.listenTo(game);

    const input = new ConsoleInput();
    input.startProcessing(game);

    process.on('unhandledRejection', (error) => {
      if (error instanceof ReversiWrongCoordinatesError) {
        console.log(`Wrong coordinates. Try again!`);
      } else if(error instanceof ReversiGameIsEndedError) {
        console.log(`Can not make move to (${error.y + 1},${error.x + 1}) - game is ended`);
      } else if(error instanceof ReversiCellIsNotAvailableError) {
        console.log(`Can not make move to (${error.y + 1},${error.x + 1}) - this cell is not available`);
      } else if (error instanceof ReversiGameNotStartedError) {
        console.log('Game wasn\'t started - enter start command at first');
      } else throw error;
    });
  });

};

main();
