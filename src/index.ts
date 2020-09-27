import ReversiWithEvents from './model/reversiWithEvents';
import ConsoleOutput from './view/output';
import ConsoleInput from './view/input';
import readline from "readline";
import User from './user';
import AIPlayer from './AIPlayer';

const main = () => {
  const consoleReader = readline.createInterface({ input: process.stdin })
  console.log('Do you want play vs Computer(1) or vs another Player(2)? Type number in the console.')
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
  })

}

main()
