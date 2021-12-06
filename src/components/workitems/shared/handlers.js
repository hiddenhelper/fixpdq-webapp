import { updateWorkitem } from "../../../services/workitems";
import { POSITION_ACTION } from "../workitems-definitions";

const changeSwarm = async ({
  workitemToEdit,
  workitemsEditForm,
  swarms,
  neighbors,
}) => {
  const { predecessorId, successorId, descendantIds } = neighbors;
  const swarmName = swarms.find((s) => s.swarmid === workitemsEditForm.swarm)
    .name;
  const positionActions = [];
  positionActions.push({
    name: POSITION_ACTION.CHANGE_SWARM,
    payload: {
      source: {
        parent: workitemsEditForm.currentParentId,
        predecessor: predecessorId,
        successor: successorId,
        descendants: descendantIds,
      },
      destination: {
        swarm: workitemsEditForm.swarm,
        swarmName,
      },
    },
  });

  try {
    await updateWorkitem(workitemToEdit, { positionActions });
  } catch (err) {
    console.log(err);
  }
};

const changeParent = async ({
  workitemToEdit,
  workitemsEditForm,
  prevState,
  changeParentPayload,
}) => {
  if (prevState.swarm === workitemsEditForm.swarm) {
    const {
      source: { parent, predecessor, successorId },
      destination: { parent: newParent, parentLastChild: newParentLastChild },
    } = changeParentPayload;
    const positionActions = [];
    positionActions.push({
      name: POSITION_ACTION.CHANGE_PARENT,
      payload: {
        source: {
          parent: parent ? parent.workitemid : "0",
          predecessor: predecessor ? predecessor.workitemid : "0",
          successor: successorId,
        },
        destination: {
          parent: newParent ? newParent.workitemid : "0",
          parentLastChild: newParentLastChild
            ? newParentLastChild.workitemid
            : undefined,
        },
      },
    });
    try {
      await updateWorkitem(workitemToEdit, { positionActions });
    } catch (err) {
      console.log(err);
    }
  }
};

const changeNext = async ({
  workitemToEdit,
  workitemsEditForm,
  prevState,
  changeNextPayload,
}) => {
  const {
    source: { predecessor: sourcePredeccessor, successorId: sourceSuccessorId },
    destination: { predecessor: targetPredecessor },
  } = changeNextPayload;
  const positionActions = [];
  if (!workitemsEditForm.next.includes("/")) {
    positionActions.push({
      name: POSITION_ACTION.CHANGE_NEXT,
      payload: {
        source: {
          predecessor: sourcePredeccessor ? sourcePredeccessor.workitemid : "0",
          successor: sourceSuccessorId,
        },
        destination: {
          workitemid: workitemsEditForm.next,
          predecessor: targetPredecessor ? targetPredecessor.workitemid : "0",
        },
      },
    });
  } else if (
    prevState.next !== undefined &&
    prevState.next !== "" &&
    prevState.next !== "0"
  ) {
    const workitemid_Next_Null = workitemsEditForm.next.split("/")[0];

    positionActions.push({
      name: POSITION_ACTION.CHANGE_NEXT,
      payload: {
        source: {
          predecessor: sourcePredeccessor ? sourcePredeccessor.workitemid : "0",
          successor: sourceSuccessorId,
        },
        destination: {
          workitemid: "",
          predecessor: workitemid_Next_Null,
        },
      },
    });
  }
  try {
    await updateWorkitem(workitemToEdit, { positionActions });
  } catch (err) {
    console.log(err);
  }
};

const remove = async ({ itemToRemove, removePayload }) => {
  const { parent, successorId, predecessor, descendantIds } = removePayload;
  const payload = {
    positionActions: [
      {
        name: POSITION_ACTION.DELETE,
        payload: {
          successor: successorId,
          parent: parent ? parent.workitemid : "0",
          predecessor: predecessor ? predecessor.workitemid : "0",
          descendants: descendantIds,
        },
      },
    ],
  };
  try {
    await updateWorkitem(itemToRemove, payload);
  } catch (error) {
    console.log(error);
  }
};

export default {
  changeSwarm,
  changeParent,
  changeNext,
  remove,
};
