import {
  DataItemParental,
  NodeItem
} from './types';

export class GroupNode {
  id: string;
  node: NodeItem | void;
  $nodeName: string;

  /**
   * "Inner collections"
   */
  // GroupNodes of the next hierarchy level (in case this is the deepest node of the current level):
  nextLevelNodes: GroupNode[] = [];
  // For DataItems(original items that should be grouped):
  innerItems: DataItemParental[] = [];
  // For parental-tree elements of GroupNodes data (in case it has parental-tree):
  subNodes: GroupNode[] = [];
  // Chain of upper GroupNodes (in case it has parental-tree):
  prevParents = [];
  // All DataItems that are deeper through all inner branches (returns non-tree array):
  allRecursiveChildren: DataItemParental[] = [];

  /**
   * Important params
   */
  $isGroupNode: true = true;
  // TODO possiblity to define next params by constructor:
  $active = true;

  constructor(
    node: NodeItem | void,
    uid: string,
    name: string
  ) {
    this.id = uid;
    this.node = node;
    this.$nodeName = name;
  }

  /**
   * Push this new GroupNode to the lastBranch (lastBranch - is an array or one of "inner collections" of the previous GroupNode)
   */
  addTo(lastBranch: GroupNode[]) {
    lastBranch.push(this);
    return this;
  }

  /**
   * Returns queue of inner GroupNodes or grouped items
   */
  get children(): (DataItemParental | GroupNode)[] {
    return [
      ...this.nextLevelNodes,
      ...this.innerItems,
      ...this.subNodes
    ];
  }
};
