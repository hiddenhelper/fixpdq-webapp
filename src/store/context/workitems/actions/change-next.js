export const changeNext = ({ dispatch, payload }) => {
  const {
    itemToMove,
    source: { predecessor: sourcePredeccessor, successorId: sourceSuccessorId },
    destination: { targetId, predecessor: targetPredecessor },
  } = payload;
  const updatedWorkitems = [];
  if (sourcePredeccessor) {
    sourcePredeccessor.next = sourceSuccessorId;
    updatedWorkitems.push(sourcePredeccessor);
  }
  if (targetPredecessor) {
    targetPredecessor.next = itemToMove.workitemid;
    updatedWorkitems.push(targetPredecessor);
  }
  itemToMove.next = targetId;
  updatedWorkitems.push(itemToMove);

  dispatch({
    type: "refresh-swarm",
    payload: {
      updatedWorkitems,
    },
  });
};
