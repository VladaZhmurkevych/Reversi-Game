import AntiReversiSimulator from './AntiReversiSimulator';
import {Coordinates} from '../../model/reversi';
import Player from '../../model/player';

export default class TreeNode {
  public children: TreeNode[] = [];
  public wins = 0;
  public visits = 0;
  public uncheckedMoves: Coordinates[] = [];
  public currentPlayer: Player;

  constructor(
    public parentNode: TreeNode,
    public moveCoordinates: Coordinates,
    antiReversiSimulator: AntiReversiSimulator,
  ) {
    this.uncheckedMoves = antiReversiSimulator.getAvailableCells();
    this.currentPlayer = antiReversiSimulator.activePlayer;
  }

  public appendNode(game: AntiReversiSimulator, index: number): TreeNode {
    const node = new TreeNode(this, this.uncheckedMoves[index], game);
    this.uncheckedMoves = this.uncheckedMoves.filter((_, i: number) => index !== i);
    this.children.push(node);
    return node;
  }

  public selectChildNode(): TreeNode {
    let selectedNode: TreeNode = null;
    let bestValue = Number.NEGATIVE_INFINITY;
    this.children.forEach((child: TreeNode) => {
      const uctValue = this.getUCTScore(child);
      if (uctValue > bestValue) {
        selectedNode = child;
        bestValue = uctValue;
      }
    });

    return selectedNode;
  }

  public updateScore(winner: Player): void {
    this.visits += 1;
    this.wins += winner === this.currentPlayer ? 1 : 0;
  }

  public mostVisitedChild(): TreeNode {
    return this.children.reduce((mostVisitedChild: TreeNode, child: TreeNode) => {
      return child.visits > mostVisitedChild.visits ? child : mostVisitedChild;
    }, this.children[0]);
  }

  private getUCTScore(child: TreeNode) {
    return child.wins / child.visits + Math.sqrt(2 * Math.log(this.visits) / child.visits);
  }
}
