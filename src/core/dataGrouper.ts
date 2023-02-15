import { GroupNode } from './GroupNode';
import {
  DataItem,
  DataItemGrouped,
  DataItemParental,
  GroupingHierarchyLevel,
  NodeItem
} from './types';

let $groupingHierarchy;

/**
 * Returns neccessarity of recursion (get "getNodeToPush()" again)
 */
function shouldIterateDeeper(hieLevel: number, maxHieLevel: number): boolean {
  return hieLevel < maxHieLevel;
};

/**
 * Recursive function to create new or get existed
 */
function findWhereToPush(item: DataItemParental, lastBranch: GroupNode[], hieLevel: number = 0): void {
  const currentNode: GroupNode = getNodeToPush(item, lastBranch, hieLevel);

  // collect all inner items through the graph branch
  currentNode.prevParents?.forEach((node) => node.allRecursiveChildren.push(item));
  currentNode.allRecursiveChildren.push(item);

  // *Recursion:
  shouldIterateDeeper(hieLevel, $groupingHierarchy.length - 1)
    ? findWhereToPush(item, currentNode.nextLevelNodes, hieLevel + 1)
    : currentNode.innerItems.push(item);
};

/**
 * Returns GroupNode in the graph for item
 */
function getNodeToPush(item: DataItemParental, lastBranch: GroupNode[], hieLevel: number): GroupNode {
  const level = $groupingHierarchy[hieLevel];
  const levelData = level.nodeData?.({ item });
  const nodeItem = level.nodeItem?.({ item, nodeData: levelData });
  const nodeTitle = level.nodeTitle?.({ item, nodeItem, nodeData: levelData });
  const uid = (postfix: number | string) => `${hieLevel}:${postfix}`;

  // if possible to get correct node (existed or new)
  if (nodeItem) {
    // if it is neccessary create parental tree to nodes
    if (nodeItem.parent_id && levelData?.length) {
      const maxParentalDepth = level.params?.maxParentalDepth || 0;
      let parentChain: NodeItem[] = makeParentChain(nodeItem, levelData, maxParentalDepth).reverse();

      let lastSubPlace: GroupNode[] = lastBranch;
      let subNode: GroupNode;
      const allParentNodes: GroupNode[] = [];

      parentChain.forEach((el) => {
        const subNodeTitle = level.nodeTitle({ item, nodeItem: el, nodeData: levelData });
        subNode = findExistedNode(lastBranch, uid(subNodeTitle)) || new GroupNode(el, uid(subNodeTitle), subNodeTitle).addTo(lastSubPlace);
        subNode.prevParents = [...allParentNodes];
        allParentNodes.push(subNode);
        lastSubPlace = subNode.subNodes;
      });

      return subNode;
    }
    // else use just one node
    return findExistedNode(lastBranch, uid(nodeItem.id)) || new GroupNode(nodeItem, uid(nodeItem.id), nodeTitle).addTo(lastBranch);
  }

  // if no data or nodeItem, but only title for new node (.title is used instead .id)
  if (nodeTitle) {
    return findExistedNode(lastBranch, uid(nodeTitle)) || new GroupNode(null, uid(nodeTitle), nodeTitle).addTo(lastBranch);
  }

  // else create "others" node
  return findExistedNode(lastBranch, uid('other')) || new GroupNode(null, uid('other'), 'Прочее').addTo(lastBranch);
};

/**
 * Returns array of item, it's parent, parent of it's parent, etc.
 */
function makeParentChain(nodeItem: NodeItem, nodeData: NodeItem[], maxDepth: number = 0) {
  let result = [nodeItem];

  if (nodeItem.parent_id) {
    let parent = nodeData.find(_ => _.id === nodeItem.parent_id);
    if (parent) {
      result = result.concat(makeParentChain(parent, nodeData));
    }
  }

  return result.slice(-maxDepth);
};

/**
 * Returns existed sibling GroupNode or undefined (if nothing is found)
 */
function findExistedNode(lastBranch: GroupNode[], uid: string): GroupNode | undefined {
  for (let i = 0; i < lastBranch.length; i++) {
    if(lastBranch[i].id === uid) {
      return lastBranch[i];
    }
  }
};

/**
 *  Function with one iteration to push item
 *  in a right graph's branch by findind or creating neccessary nodes
 */
export function groupData(
  data: (DataItemParental & DataItem)[],
  groupingHierarchy: GroupingHierarchyLevel[]
): (DataItemGrouped | DataItemParental | DataItem)[] {
  const rootNodes = [];
  $groupingHierarchy = groupingHierarchy;

  data.forEach((item) => findWhereToPush(item, rootNodes));

  $groupingHierarchy = null;
  return rootNodes;
};
