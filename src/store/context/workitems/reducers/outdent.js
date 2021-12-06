import { refreshItems } from "../shared";

export const swarmOutdentReducer = (state, { payload }) => {
  const { filter, currentSwarm, workitems } = state;
  const {
    itemToMove,
    currentTitle,
    source: {
      parent: currentParent,
      successorOfParentId,
      predecessor,
      successorId,
    },
    destination: { parent: newParent },
  } = payload;
  const updatedWorkitems = [];

  // update current parent
  if (currentParent && currentParent.children) {
    const index = currentParent.children.findIndex(
      (child) => child === itemToMove.workitemid
    );
    if (index > -1) {
      currentParent.children.splice(index, 1);
    }
    currentParent.next = itemToMove.workitemid;
    updatedWorkitems.push(currentParent);
  }

  // update predecessor from source position
  if (predecessor) {
    predecessor.next = successorId;
    updatedWorkitems.push(predecessor);
  }

  // update new parent
  if (newParent) {
    if (!newParent.children) {
      newParent.children = [];
    }
    if (!newParent.children.includes(itemToMove.workitemid)) {
      newParent.children.push(itemToMove.workitemid);
    }
    updatedWorkitems.push(newParent);
  }

  // update the item itself
  itemToMove.name = currentTitle;
  itemToMove.next = successorOfParentId;
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
    nodeMap,
  };
};
