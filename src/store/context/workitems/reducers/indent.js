import { refreshItems } from "../shared";

export const swarmIndentReducer = (state, { payload }) => {
  const { filter, currentSwarm, workitems } = state;
  const {
    itemToMove,
    currentTitle,
    source: { parent: currentParent, successorId },
    destination: { parent: newParent, lastChild: newParentLastChild },
  } = payload;

  const updatedWorkitems = [];
  // update new parent
  if (newParent && !newParent.children) {
    newParent.children = [];
  }
  if (newParent && !newParent.children.includes(itemToMove.workitemid)) {
    newParent.children.push(itemToMove.workitemid);
    newParent.next = successorId;
    updatedWorkitems.push(newParent);
  }

  // update current parent
  if (currentParent && currentParent.children) {
    const index = currentParent.children.findIndex(
      (child) => child === itemToMove.workitemid
    );
    if (index > -1) {
      currentParent.children.splice(index, 1);
    }
    updatedWorkitems.push(currentParent);
  }

  // update new parent's last child
  if (newParentLastChild) {
    newParentLastChild.next = itemToMove.workitemid;
    updatedWorkitems.push(newParentLastChild);
  }

  // update the item itself
  itemToMove.name = currentTitle;
  updatedWorkitems.push(itemToMove);
  const { refreshedWorkitems, refreshedTree, nodeMap } = refreshItems({
    workitems,
    updatedWorkitems,
    filter,
    currentSwarm,
  });
  return {
    ...state,
    workitems: refreshedWorkitems,
    tree: refreshedTree,
    nodeMap: nodeMap,
  };
};
