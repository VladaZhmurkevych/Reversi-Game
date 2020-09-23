import ReversiWithEvents from './model/reversiWithEvents';
import Player from './model/player';
import ConsoleOutput from './view/output';
import ConsoleInput from './view/input';

const main = () => {
  const firstPlayer = new Player('A')
  const secondPlayer = new Player('B')
  const game = new ReversiWithEvents(firstPlayer, secondPlayer)
  const output = new ConsoleOutput(firstPlayer, secondPlayer)
  output.listenTo(game)

  const input = new ConsoleInput()
  input.startProcessing(game)
}

main()
