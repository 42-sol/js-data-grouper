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
function findWhereToPush(item, lastBranch, groupingHierarchy, hieLevel = 0) {
  const currentNode = getNodeToPush(item, lastBranch, groupingHierarchy, hieLevel);

  shouldIterateDeeper(hieLevel, groupingHierarchy)
    ? findWhereToPush(item, currentNode.nextLevelNodes, groupingHierarchy, hieLevel + 1)
    : currentNode.innerItems.push(item);
}

function getNodeToPush(item, lastBranch, groupingHierarchy, hieLevel) {
  const level = groupingHierarchy[hieLevel];
  const nodeItem = level.nodeItem?.(item);

  // if possible to get correct node (existed or new)
  if (nodeItem) {
    const nodeName = level.title(nodeItem);
    const uid = `${hieLevel}:${level.key}`;

    // create parental tree to nodes
    if (nodeItem.parent_id) {
      let parentNodeItem = nodeItem;
      let parentsTreeLine = [parentNodeItem];
      while (parentNodeItem.parent_id) {
        parentNodeItem = level.nodeItem(item, reference, parentNodeItem.parent_id);
        parentsTreeLine.push(parentNodeItem);
      }
      const maxDepth = level.params?.maxDepth || 0;
      parentsTreeLine = parentsTreeLine.slice(-maxDepth);

      let lastSubPlace = lastBranch;
      const prevParents = [];
      for (let i = parentsTreeLine.length - 1; i >= 0; i--) {
        const subNodeName = level.nodeName(parentsTreeLine[i]);
        const specId = `${hieLevel}:${parentsTreeLine[i].id}`;
        node = useExistedOrNew(lastSubPlace, subUid, parentsTreeLine[i], hieLevel, subNodeName, specId);
        node.prevParents = [...prevParents];
        prevParents.push(node);
        lastSubPlace = node.subNodes;
        if (i === 0) {
          return node;
        }
      }
    }
    // just use one node
    else {
      return useExistedOrNew(lastBranch, uid, nodeItem, hieLevel, nodeName, undefined);
    }
  }
  // else create "others" node
  else {
    return useExistedOrNew(lastBranch, `other:${hieLevel}`, undefined, null, hieLevel, 'Прочее', `other:${hieLevel}`);
  }
}

function useExistedOrNew(lastBranch, uid, nodeItem, hieLevel, nodeName, specId) {
  for (let i = 0; i < lastBranch.length; i++) {
    if(lastBranch[i].__id === uid) {
      return lastBranch[i];
    }
  }

  return new GroupNode(nodeItem, hieLevel, nodeName, specId, lastBranch);
};

export function groupData(
  data: (DataItemParental & DataItem)[],
  groupingHierarchy: GroupingHierarchyLevel[]
):
(DataItemGrouped | DataItemParental | DataItem)[] {
  const rootNodes = [];

  /**
   *  Only one iteration to push item in a right graph's branch
   *  by findind or creating neccessary nodes
   */
  data.forEach((item) => findWhereToPush(item, rootNodes, groupingHierarchy));

  return rootNodes;
}
