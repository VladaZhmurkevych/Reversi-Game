import TreeNode from './treeNode';

export default class Tree<T> {
  public root: TreeNode<T>;

  constructor(data: T) {
    this.root = new TreeNode<T>(data);
  }

  public addChild(data: T, toData: T) {
    const node = new TreeNode<T>(data);

    const callback = (searchedNode: TreeNode<T>) => {
      if (searchedNode.data === toData) {
        node.parent = searchedNode;
        searchedNode.children.push(node);
        return true;
      }
      return false;
    };

    this.traverseDF(callback);
  }

  private traverseDF(callback) {
    let shouldStop = false;
    (function recurse(currentNode: TreeNode<T>) {
      if (shouldStop) return;
      for (let i = 0, length = currentNode.children.length; i < length; i++) {
        recurse(currentNode.children[i]);
      }
      if (callback(currentNode)) {
        shouldStop = true;
      }
    })(this.root);
  }
}
