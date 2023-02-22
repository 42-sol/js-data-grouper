import { makeParentTree, groupData } from './core';
import { DataItem, DataItemGrouped, GroupingHierarchyLevel, NodeItem } from './core/types';
import { testEmployees, testCompanies } from './testData';

console.log('testEmployees', testEmployees);
console.log('testCompanies', testCompanies);

const employeesTree = makeParentTree(testEmployees, null);
console.log('employeesTree', employeesTree);

/**
 * groupingHierarchy functions' params explanation
 */
interface groupingLevelCbParams {
  item?: DataItem,
  nodeItem?: NodeItem,
  nodeData?: NodeItem[]
}

const groupingHierarchy: GroupingHierarchyLevel[] = [
  {
    nodeData: () => testCompanies,
    nodeItem: ({ item, nodeData }) => nodeData.find((_: NodeItem) => _.id === item.company_id),
    nodeTitle: ({ nodeItem }) => nodeItem.name,
  },
  {
    nodeTitle: ({ item }) => item.job_start,
  }
];

const tree: DataItemGrouped[] = groupData(employeesTree, groupingHierarchy);
console.log('tree', tree);
