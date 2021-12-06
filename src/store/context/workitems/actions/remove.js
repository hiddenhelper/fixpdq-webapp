import { STATUS } from "../../../../components/workitems/workitems-definitions";

export const remove = ({ dispatch, payload }) => {
  const {
    itemToRemove,
    parent,
    predecessor,
    successorId,
    descendants,
  } = payload;
  const updatedWorkitems = [];
  if (parent) {
    const index = parent.children.findIndex(
      (item) => item.workitemid === itemToRemove.workitemid
    );
    parent.children.splice(index, 1);
    updatedWorkitems.push(parent);
  }

  if (predecessor) {
    predecessor.next = successorId;
    updatedWorkitems.push(predecessor);
  }

  if (descendants && descendants.length > 0) {
    descendants.forEach((item) => {
      item.status = STATUS.DELETED;
      updatedWorkitems.push(item);
    });
  }

  // itemToRemove.isStagingAndRemoved = true;
  itemToRemove.status = STATUS.DELETED;
  updatedWorkitems.push(itemToRemove);

  dispatch({
    type: "refresh-swarm",
    payload: { updatedWorkitems },
  });
};
