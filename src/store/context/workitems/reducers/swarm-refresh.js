import { STATUS } from "../../../../components/workitems/workitems-definitions";
import { buildTreeForSwarm, getMap } from "../shared";

const getRefreshedWorkitems = (state, { payload }) => {
  const { workitems: workitemsFromState } = state;
  const existingItems = workitemsFromState
    ? workitemsFromState.map((w) => w.workitemid)
    : [];
  const { updatedWorkitems, stagingItemData } = payload;
  if (stagingItemData) {
    const stagingIndex = updatedWorkitems.findIndex(
      (item) => item.workitemid === stagingItemData.newWorkitemId
    );
    updatedWorkitems.splice(stagingIndex, 1);
  }
  const newState = workitemsFromState
    ? workitemsFromState.map(
        (prev) =>
          updatedWorkitems.find(
            (next) => next.workitemid === prev.workitemid
          ) || prev
      )
    : [];
  const newWorkitems = updatedWorkitems.filter(
    (item) => !existingItems.includes(item.workitemid)
  );
  const refreshedWorkitems = [...newState, ...newWorkitems];
  if (stagingItemData) {
    // currentWorkitemId - id of an item user pressed enter on
    // currentWorkitemId is a predecessor of a newWorkitemId
    const {
      parentid,
      newWorkitemId,
      currentWorkitemId,
      successorId,
    } = stagingItemData;
    const parentIndex = refreshedWorkitems.findIndex(
      (item) => item.workitemid === parentid
    );
    const currentIndex = refreshedWorkitems.findIndex(
      (item) => item.workitemid === currentWorkitemId
    );
    const stagingIndex = refreshedWorkitems.findIndex(
      (item) => item.workitemid === newWorkitemId
    );
    if (
      refreshedWorkitems[parentIndex] &&
      refreshedWorkitems[parentIndex].children &&
      newWorkitemId
    ) {
      if (!refreshedWorkitems[parentIndex].children.includes(newWorkitemId)) {
        refreshedWorkitems[parentIndex].children.push(newWorkitemId);
      }
    }
    if (refreshedWorkitems[currentIndex] && newWorkitemId) {
      refreshedWorkitems[currentIndex].next = newWorkitemId;
    }
    if (
      refreshedWorkitems[stagingIndex] &&
      successorId &&
      successorId !== "0"
    ) {
      refreshedWorkitems[stagingIndex].next = successorId;
    }
  }
  return refreshedWorkitems
    .filter((w) => w.status !== STATUS.DELETED)
    .filter((w) => !w.isStagingAndRemoved);
};

export const swarmRefreshReducer = (state, { payload }) => {
  const { filter, currentSwarm } = state;
  const refreshedWorkitems = getRefreshedWorkitems(state, {
    payload,
  });
  const refreshedTree = buildTreeForSwarm({
    items: refreshedWorkitems,
    filter,
    currentSwarm,
  });
  return {
    ...state,
    workitems: refreshedWorkitems,
    tree: refreshedTree,
    nodeMap: getMap(refreshedTree),
  };
};
