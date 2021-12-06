import { ListConvertor } from "./list-convertor";
import { traverseFromRoot } from "./tree-traverse";

export const getTreeHash = (tree) => {
  const hashArray = [];
  const root = tree.slice();
  traverseFromRoot({
    root,
    cb: (node) => {
      hashArray.push(
        `${node.workitemid}_${node.id}_${node.parentid}_${node.next}_${node.sort}_${node.isStaging}_${node.ownerid}_${node.status}_${node.priority}_${node.difficulty}_${node.name}_${node.display}`
      );
    },
  });
  return JSON.stringify(hashArray.sort());
};

export const getTreeHashForFilter = (tree) => {
  const hashArray = [];
  const root = tree.slice();
  traverseFromRoot({
    root,
    cb: (node) => {
      hashArray.push(`${node.workitemid}_${node.ownerid}_${node.status}`);
    },
  });
  return JSON.stringify(hashArray.sort());
};

export const listToTree = (list) => {
  return new ListConvertor({ list }).sortNodes().getRoot();
};

export const splitDots = (idWithDots) => {
  return typeof id === "number"
    ? [idWithDots]
    : idWithDots
        .toString()
        .split(".")
        .map((id) => parseInt(id));
};
