import { STATUS } from "../../../../components/workitems/workitems-definitions";
import { refreshItems } from "../shared";

export const swarmRemoveReducer = (state, { payload }) => {
  const { filter, currentSwarm, workitems } = state;
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
    if (index !== -1) {
      parent.children.splice(index, 1);
    }
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
