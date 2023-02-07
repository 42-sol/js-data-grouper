export class GroupNode {
  __id;
  node;
  hieLevel;
  $nodeName;
  $active;
  __isThatNode: true
  nextLevelNodes = [];
  innerItems = [];
  subNodes = [];
  prevParents = [];
  allRecursiveChildren = [];

  constructor(node, hieLevel, name, id, lastBranch) {
    this.__id = id;
    this.node = node;
    this.hieLevel = hieLevel;
    this.$nodeName = name;
    this.$active = true;

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
