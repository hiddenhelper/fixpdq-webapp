export const addNext = ({ dispatch, payload }) => {
  const {
    newWorkitem,
    parent,
    current,
    currentTitle,
    successorId,
    swarm,
    swarmName,
    creatorid,
  } = payload;
  const updatedWorkitems = [];
  const updatedParent = parent && {
    ...parent,
  };
  // update parent
  if (
    updatedParent &&
    !updatedParent.children.includes(newWorkitem.workitemid)
  ) {
    updatedParent.children.push(newWorkitem.workitemid);
    updatedWorkitems.push(updatedParent);
  }
  // update current
  if (current) {
    current.name = currentTitle;
    current.next = newWorkitem.workitemid;
    current.stagingItem = {
      workitemid: newWorkitem.workitemid,
      swarm,
      swarmName,
      creatorid,
    };
    // delete current.sort;
    updatedWorkitems.push(current);
  }

  // update new work item
  newWorkitem.next = successorId;
  newWorkitem.date_created = new Date().getTime();
  updatedWorkitems.push(newWorkitem);
  dispatch({
    type: "refresh-swarm",
    payload: {
      updatedWorkitems,
    },
  });
};
