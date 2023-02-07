import { DataItem, DataItemParental } from './_types';

export function makeParentTree(
  data: DataItem[],
  parentId: number | string | null = null,
  relation: string = 'parent_id:id'
):
DataItemParental[] {
  const [childKey, parentKey] = relation.split(':');
  const children = data.filter(data => data[childKey] === parentId);

  return children.map((child) => ({
    ...child,
    children: makeParentTree(data, child[parentKey])
  }));
}
