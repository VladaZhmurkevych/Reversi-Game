import Player, {Color} from '../../model/player';
import { Coordinates } from '../../model/reversi';
import TreeNode from './treeNode';
import AntiReversiSimulator from './AntiReversiSimulator';
import ReversiBoard from '../../model/reversiBoard';

export default class SmartAIMonteCarloPlayer extends Player {
  private MAX_DEPTH: number;
  private enemy: Player;
  private currentNode: TreeNode;
  private currentGameSimulation: AntiReversiSimulator;

  constructor(maxDepth: number, color: Color, enemy: Player) {
    super('SmartAIMonteCarloPlayer', color);
    this.MAX_DEPTH = maxDepth;
    this.enemy = enemy;
  }

  getNextMove(inputBoard?: ReversiBoard, maxTime = 1000): Coordinates | Promise<Coordinates> {
    const antiReversiSimulator = new AntiReversiSimulator(inputBoard, this, this.enemy);
    const root = new TreeNode(null, null, antiReversiSimulator);
    const startTime = (new Date()).getTime();
    const timeLimit = startTime + maxTime;
    for(let iterations = 0; iterations < this.MAX_DEPTH && (new Date()).getTime() < timeLimit; iterations += 1) {
      this.currentNode = root;
      this.currentGameSimulation = new AntiReversiSimulator(inputBoard, this, this.enemy);
      this.selection();
      this.expansion();
      this.simulation();
      this.backPropagation();
    }

    this.currentNode = null;
    this.currentGameSimulation = null;

    if (!root.mostVisitedChild()) {
      return null;
    }

    return root.mostVisitedChild().moveCoordinates;
  }

  private selection() {
    while (this.currentNode.uncheckedMoves.length == 0 && this.currentNode.children.length > 0) {
      this.currentNode = this.currentNode.selectChildNode();
      this.currentGameSimulation.makeMove(this.currentNode.moveCoordinates);
    }
  }

  private expansion() {
    if (this.currentNode.uncheckedMoves.length > 0) {
      //RENAME
      const actionIndex = Math.floor(Math.random() * this.currentNode.uncheckedMoves.length);
      this.currentGameSimulation.makeMove(this.currentNode.uncheckedMoves[actionIndex]);
      this.currentNode = this.currentNode.appendNode(this.currentGameSimulation, actionIndex);
    }
  }

  private simulation() {
    let coords = this.currentGameSimulation.getAvailableCells();
    while(coords.length > 0) {
      this.currentGameSimulation.makeMove(coords[Math.floor(Math.random() * coords.length)]);
      coords = this.currentGameSimulation.getAvailableCells();
      if (coords.length === 0){
        coords = this.currentGameSimulation.getAvailableEnemyCells();
      }
    }
  }

  private backPropagation() {
    const result = this.currentGameSimulation.getWinner();
    while(this.currentNode) {
      this.currentNode.updateScore(result);
      this.currentNode = this.currentNode.parentNode;
    }
  }
}


