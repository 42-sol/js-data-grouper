export type DataItem = {
  [key: number | string]: any // eslint-disable-line
}

export interface GroupingHierarchyLevel {
  key: Function,
  title: Function
}

export interface DataItemOverwritten extends DataItem {
  directoriesNeet: {}[]
}