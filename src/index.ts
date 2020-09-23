import ReversiWithEvents from './model/reversiWithEvents';
import Player from './model/player';
import ConsoleOutput from './view/output';
import ConsoleInput from './view/input';

const main = () => {
  const game = new ReversiWithEvents(new Player('A'), new Player('B'))
  const output = new ConsoleOutput()
  output.listenTo(game)

  const input = new ConsoleInput()
  input.startProcessing(game)
}

main()
