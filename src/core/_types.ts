export type DataItem = Record<string | number | symbol, any> // eslint-disable-line

export interface DataItemParental extends DataItem {
  children?: (DataItemParental | DataItem)[]
}

export interface GroupingHierarchyLevel {
  key: Function
  nodeItem?: Function
  nodeItemData?: Function
  title?: Function
  params?: GroupingHierarchyLevelParams
}

export interface GroupingHierarchyLevelParams {
  [key: number | string]: any // eslint-disable-line
  node?: boolean
  innerParent?: boolean
}

export interface DataItemGrouped extends DataItem {
  children?: (DataItemGrouped | DataItemParental | DataItem)[]
}
