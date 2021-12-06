import { traverseFromRoot } from "../../../../utils/workitems";

export const getMap = (tree) => {
  if (tree.length > 0) {
    const ids = {};
    const workitemids = {};
    traverseFromRoot({
      root: tree,
      cb: (node) => {
        ids[node.id] = node;
        workitemids[node.workitemid] = node;
      },
    });
    if (ids && workitemids) {
      return { ids, workitemids };
    }
  }
  return {};
};
