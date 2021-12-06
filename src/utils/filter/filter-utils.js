
import { isObject } from "lodash";

export const getFilters = (filter) => {
  return Object.entries(filter)
    .map(([key]) => key)
    .filter((key) => isObject(filter[key]))
    .filter((key) => filter[key].active);
};

export const shouldBeVisible = (node, filter) => {
  return getFilters(filter)
    .map((slice) =>
      filter[slice].values.length > 0 ? filter[slice].values.includes(node[slice]) : true
    )
    .every((val) => val === true);
};

export const areChildrenVisible = (node, workitemIds) => {
  const childrenIds = node._children.map((item) => item.workitemid);
  return childrenIds.every((id) => workitemIds.includes(id));
};

export const areChildrenIsDisplay = (item) => {
  if (item._children.length === 0) {
    return false;
  }
  return item._children
    .map((child) => {
      return { display: child.display };
    })
    .every((item) => item.display === true);
};

export const checkChildrenIds = (node) => {
  return node._children
    .map((child) => child.inIds)
    .every((item) => item === false);
};
