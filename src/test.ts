import { makeParentTree } from './core/makeParentTree';
import { groupData } from './core/dataGrouper';
import { DataItem, DataItemGrouped, GroupingHierarchyLevel } from './core/_types';
import { testEmployees, testCompanies } from './testData';

console.log('testEmployees', testEmployees);
console.log('testCompanies', testCompanies);

const employeesTree = makeParentTree(testEmployees, null, 'parent_id:id');
console.log('employeesTree', employeesTree);

const companiesTree = makeParentTree(testEmployees, null, 'parent_id:id');
console.log('companiesTree', companiesTree);

// const groupingHierarchy: GroupingHierarchyLevel[] = [
//   {
//     key: (item: DataItem) => 'Company:' + item.job_start,
//     nodeItem: (item: DataItem) => testCompanies!.find(_ => _.name === item.company),
//     nodeItemData: () => testCompanies,
//     title: (item: DataItem) => testCompanies!.find(_ => _.name === item.company)?.name,
//   },
//   {
//     key: (item: DataItem) => 'JobStart:' + item.job_start,
//     title: (item: DataItem) => item.job_start,
//   }
// ];

// const graphByCondition: DataItemGrouped[] = groupData(employeesTree, groupingHierarchy);
// console.log('graphByCondition', graphByCondition);

const groupingHierarchy: GroupingHierarchyLevel[] = [
  {
    // nodeItem: (item: DataItem, data: any) => ({  }),
    title: (item: DataItem) => item.job_start,
  },
  {
    data: () => companiesTree,
    nodeItem: (item: DataItem, data: any) => data.find(_ => _.id === item.id),
    title: (item: DataItem) => testCompanies!.find(_ => _.name === item.company)?.name,
  }
];

const graphByCondition: DataItemGrouped[] = groupData(employeesTree, groupingHierarchy);
console.log('graphByCondition', graphByCondition);
