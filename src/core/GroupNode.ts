export class GroupNode {
  node;
  hieLevel;
  $nodeName;
  $active = true;
  __isThatNode: true
  nextLevelNodes = [];
  innerItems = [];
  subNodes = [];
  prevParents = [];
  allRecursiveChildren = [];

  constructor(node, hieLevel, name, lastBranch) {
    this.node = node;
    this.hieLevel = hieLevel;
    this.$nodeName = name;

    lastBranch.push(this);
  }

  get children() {
    return [
      ...this.nextLevelNodes,
      ...this.innerItems,
      ...this.subNodes
    ];
  }
}
