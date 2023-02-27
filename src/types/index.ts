export type DataItem = Record<string | number | symbol, any> // eslint-disable-line
export type NodeItem = Record<string | number | symbol, any> // eslint-disable-line

export interface DataItemParental extends DataItem {
  children?: (DataItemParental | DataItem)[];
}

export interface DataItemGrouped extends DataItem {
  children?: (DataItemGrouped | DataItemParental | DataItem)[];
}

export interface GroupingHierarchyLevel {
  nodeItem?: Function;
  nodeData?: Function;
  nodeTitle?: Function;
}
