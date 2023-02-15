import { GroupNode } from './GroupNode';
import {
  DataItem,
  DataItemGrouped,
  DataItemParental,
  GroupingHierarchyLevel
} from './_types';

const shouldIterateDeeper = (hieLevel, groupingHierarchy) => hieLevel < groupingHierarchy.length - 1;

/**
 * Recursive function to create new or create existed
 */
function findWhereToPush(item, lastBranch, groupingHierarchy, hieLevel = 0): void {
  const currentNode: GroupNode = getNodeToPush(item, lastBranch, groupingHierarchy, hieLevel);

  shouldIterateDeeper(hieLevel, groupingHierarchy)
    ? findWhereToPush(item, currentNode.nextLevelNodes, groupingHierarchy, hieLevel + 1)
    : currentNode.innerItems.push(item);
};

function getNodeToPush(item, lastBranch, groupingHierarchy, hieLevel): GroupNode {
  const level = groupingHierarchy[hieLevel];
  const nodeItem = level.nodeItem?.(item);

  // if possible to get correct node (existed or new)
  if (nodeItem) {
    const nodeTitle = level.title(nodeItem);

    // if it is neccessary create parental tree to nodes
    if (nodeItem.parent_id && level.data) {
      const maxParentalDepth = level.params?.maxParentalDepth || 0;

      let parentChain = makeParentChain(nodeItem, level.data, maxParentalDepth).reverse();

      let lastSubPlace = lastBranch;
      let currentNode;
      const allParentNodes = [];

      parentChain.forEach((el) => {
        const currentNode = useExistedOrNew(lastSubPlace, `${hieLevel}:${el.id}`, el, hieLevel, level.title(el));
        currentNode.prevParents = [...allParentNodes];
        allParentNodes.push(currentNode);
        lastSubPlace = currentNode.subNodes;
      });

      return currentNode;
    }
    // else use just one node
    else return useExistedOrNew(lastBranch, `${hieLevel}:${level.key}`, nodeItem, hieLevel, nodeTitle);
  }
  // else create "others" node
  else return useExistedOrNew(lastBranch, `other:${hieLevel}`, undefined, hieLevel, 'Прочее');
};

function makeParentChain(dataItem, data, maxDepth = 0) {
  let result = [dataItem];

  if (dataItem.parent_id) {
    let parent = data.find(_ => _.id === dataItem.parent_id);
    if (parent) {
      result = result.concat(makeParentChain(parent, data));
    }
  }

  return result.slice(-maxDepth);
}

function useExistedOrNew(lastBranch, uid, nodeItem, hieLevel, nodeTitle) {
  for (let i = 0; i < lastBranch.length; i++) {
    if(lastBranch[i].__id === uid) {
      return lastBranch[i];
    }
  }

  return new GroupNode(nodeItem, hieLevel, nodeTitle, lastBranch);
};

/**
 *  Function with one iteration to push item
 *  in a right graph's branch by findind or creating neccessary nodes
 */
export function groupData(
  data: (DataItemParental & DataItem)[],
  groupingHierarchy: GroupingHierarchyLevel[]
): (DataItemGrouped | DataItemParental | DataItem)[]
{
  const rootNodes = [];
  data.forEach((item) => findWhereToPush(item, rootNodes, groupingHierarchy));
  return rootNodes;
};
