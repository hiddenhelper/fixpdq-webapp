export const traverseFromRoot = ({ cb, root }) => {
  for (let i = 0; i < root.length; i++) {
    traverseRecursively(cb, root[i], `${i + 1}`);
  }
};

export const traverseRecursively = (cb, tree, parentId = "1", num = 0) => {
  const idWithDots = tree.isRoot ? parentId : `${parentId}.${num + 1}`;
  tree.id = idWithDots;
  if (cb) {
    cb(tree);
  }
  if (tree._children) {
    for (let i = 0; i < tree._children.length; i++) {
      traverseRecursively(cb, tree._children[i], idWithDots, i);
    }
  }
};

export const convertToNodeMap = (root) => {
  const nodeMap = {};
  traverseFromRoot({
    root,
    cb: (node) => {
      nodeMap[node.workitemid] = node;
    },
  });

  return nodeMap;
};
