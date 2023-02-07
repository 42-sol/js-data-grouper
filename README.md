# DataGrouper

```javascript
const testEmployees = [
  { id: 1, parentId: null, name: "Isabel", job_start: "2020-01-01", company: 'Instagram' },
  { id: 2, parentId: 1, name: "John", job_start: "2020-01-01", company: 'Instagram' },
  { id: 3, parentId: 2, name: "Bill", job_start: "2020-02-01", company: 'Meta' },
  { id: 4, parentId: null, name: "Paula", job_start: "2020-03-01", company: 'IBM' },
];

const testCompanies = [
  { id: 1, parentId: null, name: 'Meta' },
  { id: 2, parentId: 1, name: 'Instagram' },
  { id: 3, parentId: null, name: "IBM" },
  { id: 4, parentId: null, name: "IBM" },
];
```

```javascript
const groupingHierarchy: GroupingHierarchyLevel[] = [
  {
    key: () => {},
    title: (item: DataItem) => testCompanies!.find(_ => _.name === item.company)?.name
  },
  {
    key: () => {},
    title: (item: DataItem) => item.job_start
  },
  {
    key: () => {},
    title: (item: DataItem, data: DataItem[]) => data.find(_ => _.id === item.parent_id)?.name
  },
];
```