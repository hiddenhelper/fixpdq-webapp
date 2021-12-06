export const changeParent = ({ dispatch, payload }) => {
  const {
    itemToMove,
    source: { parent: currentParent, predecessor, successorId },
    destination: { parent: newParent, parentLastChild: newParentLastChild },
  } = payload;
  const updatedWorkitems = [];
  if (newParent) {
    // update new parent
    if (!newParent.children) {
      newParent.children = [];
    }
    newParent.children.push(itemToMove.workitemid);
    updatedWorkitems.push(newParent);
  } else {
    itemToMove.isRoot = true;
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

  // update the predecessor from the source
  if (predecessor) {
    predecessor.next = successorId;
    updatedWorkitems.push(predecessor);
  }

  // update the item itself
  itemToMove.next = "0";
  updatedWorkitems.push(itemToMove);

  dispatch({
    type: "refresh-swarm",
    payload: {
      updatedWorkitems,
    },
  });
};
