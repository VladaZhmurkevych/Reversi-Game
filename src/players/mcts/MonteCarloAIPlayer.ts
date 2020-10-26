import Player from '../../model/player';
import { Coordinates } from '../../model/reversi';
import TreeNode from './treeNode';
import AntiReversiSimulator from './AntiReversiSimulator';
import ReversiBoard from '../../model/reversiBoard';
import {Color} from '../../model/color.enum';

export default class MonteCarloAIPlayer extends Player {
  private currentNode: TreeNode;
  private currentGameSimulation: AntiReversiSimulator;

  constructor(
    private maxTime: number,
    private enemy: Player,
    color: Color,
  ) {
    super('SmartAIMonteCarloPlayer', color);
  }

  getNextMove(inputBoard?: ReversiBoard): Coordinates | Promise<Coordinates> {
    const antiReversiSimulator = new AntiReversiSimulator(new ReversiBoard(inputBoard), this, this.enemy);
    const root = new TreeNode(null, null, antiReversiSimulator);
    const startTime = Date.now();
    const deadline = startTime + this.maxTime;

    while (Date.now() < deadline) {
      this.currentNode = root;
      this.currentGameSimulation = new AntiReversiSimulator(new ReversiBoard(inputBoard), this, this.enemy);
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
      const moveIndex = Math.floor(Math.random() * this.currentNode.uncheckedMoves.length);
      this.currentGameSimulation.makeMove(this.currentNode.uncheckedMoves[moveIndex]);
      this.currentNode = this.currentNode.appendNode(this.currentGameSimulation, moveIndex);
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


