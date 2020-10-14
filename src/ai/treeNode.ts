export default class TreeNode<T> {
  public children: TreeNode<T>[];
  public parent: TreeNode<T>;
  public data: T;

  constructor(data: T) {
    this.data = data;
  }
}
