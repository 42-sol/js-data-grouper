# DataGrouper

## DEV
```shell
# to run test page
npm run dev
# to show lint warns or fix them
npm run lint
npm run lint:fix
# to compile dist/
npm run build
```

## Install
```shell
npm install @42sol/js-data-grouper
# or
yarn add @42sol/js-data-grouper
```

## Why?
Imagine you need to make a tree structure by arrays of companies and it's employees.

```javascript
// nodeItems - data to create nodes of structure
const companies = [
  { id: 1, parentId: null, name: 'Meta' },
  { id: 2, parentId: 1, name: 'Instagram' },
  { id: 3, parentId: null, name: "IBM" },
  { id: 4, parentId: null, name: "IBM" }
];

// data which should be grouped
const employees = [
  { id: 1, parentId: null, name: "Isabel", job_start: "2020-01-01", company: 'Instagram' },
  { id: 2, parentId: 1, name: "John", job_start: "2020-01-01", company: 'Instagram' },
  { id: 3, parentId: 2, name: "Bill", job_start: "2020-02-01", company: 'Meta' },
  { id: 4, parentId: null, name: "Paula", job_start: "2020-03-01", company: 'IBM' }
];
```

```
// result graph
[
  {
    "$nodeName": "Meta",
    "children": [
      {
        "$nodeName": "Instagram",
        "children": [
          {
            "$nodeName": "2020-01-01",
            "children": [
              { "name": "Isabel", "job_start": "2020-01-01", "company_id": 2},
              { "name": "John", "job_start": "2020-01-01", "company_id": 2 }
            ]
          }
        ]
      },

      {
        "$nodeName": "2020-02-01",
        "children": [
          { "name": "Bill", "job_start": "2020-02-01", "company_id": 1 }
        ]
      }
    ]
  },
  {...
]
```

## Usage

```javascript
import { groupData } from '@42sol/js-data-grouper';

const hierarchy = [
  {
    nodeData: ({ item }) => companies,
    nodeItem: ({ item, nodeData }) => nodeData.find((_) => _.id === item.company_id),
    nodeTitle: ({ item ,nodeData, nodeItem }) => nodeItem.name,
  },
  {
    nodeTitle: ({ item ,nodeData, nodeItem }) => item.job_start
  }
];

const tree = groupData(employees, hierarchy);
```

In this example you could use 'item', 'nodeData', 'nodeItem'.
- item - one of employees (this is used on employees' iteration)
- nodeData - array you should define earlier
- nodeItem - one of nodeData (this is used on inner recursive iterations)

## API
### *main methods:*
<table>
  <tr><th>Name</th><th>Params</th><th>Return</th><th>Description</th></tr>
  <tr><td>groupData</td><td>Params</td><td>Return</td><td></td></tr>
  <tr><td>makePatentTree</td><td>Params</td><td>Return</td><td></td></tr>
</table>

### *grouping hierarchy config:*
<table>
  <tr><th>Name</th><th>Params</th><th>Type</th><th>Description</th></tr>
  <tr><td>nodeData</td><td>Params</td><td>Type</td><td></td></tr>
  <tr><td>nodeItem</td><td>Params</td><td>Type</td><td></td></tr>
  <tr><td>nodeTitle</td><td>Params</td><td>Type</td><td></td></tr>
  <tr><td>maxParentalDepth</td><td>Params</td><td>Type</td><td></td></tr>
</table>
