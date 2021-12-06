import { useContext, useState } from "react";
import { toast } from "react-semantic-toasts";
import { SWARM_ROLE } from "../components/swarms/swarms-definitions";
import { ACTION, STATUS } from "../components/workitems/workitems-definitions";
import { updateWorkitem } from "../services/workitems";
import { WorkitemsContext, CurrentSwarmContext } from "../store/context";
import { usePayloadBuilderListView } from "./use-payload-builder-list-view";

const toastStart = () => {
  toast({
    type: "info",
    icon: "check",
    title: "Changing status",
    description: "Changing status in progress",
    animation: "bounce",
    time: 5000,
  });
};

const toastFinish = () => {
  toast({
    type: "success",
    icon: "check",
    title: "Changing status",
    description: "Successfully changed the status",
    animation: "bounce",
    time: 5000,
  });
};

export const useWorkitemsList = () => {
  const {
    swarmActions,
    nodeMapWorkitemId,
    fetchWorkitemsBySwarms,
  } = useContext(WorkitemsContext);
  const { getSwarms } = useContext(CurrentSwarmContext);
  const { reviewStatusAction } = usePayloadBuilderListView();
  const [updateLoading, setUpdateLoading] = useState(false);

  const onChangeLevel = async (params) => {
    const { workitemid, title, value, owner, creator } = params;
    const fields = {};
    fields[title] = value;
    fields.payload = {
      workitemid,
      owner,
      creator,
    };
    try {
      swarmActions.dispatchUpdate({
        itemToUpdate: nodeMapWorkitemId[workitemid],
        propertyName: title,
        propertyValue: value,
      });
      updateWorkitem(workitemid, { ...fields });
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeStatus = async ({ newStatus, workitemid }) => {
    const dispatchStatusChange = () => {
      swarmActions.dispatchUpdate({
        itemToUpdate: nodeMapWorkitemId[workitemid],
        propertyName: "status",
        propertyValue: newStatus,
      });
    };

    try {
      if (newStatus === STATUS.REVIEW) {
        const owner = nodeMapWorkitemId[workitemid].ownerid;
        if (!owner) {
          toast({
            type: "error",
            icon: "check",
            title: "Request Review",
            description: "Work item should have an assigned owner",
            animation: "bounce",
            time: 5000,
          });
        } else {
          toastStart();
          dispatchStatusChange();
          const payload = reviewStatusAction({
            workitemid,
            owner,
            typeList: [SWARM_ROLE.ADMIN, SWARM_ROLE.CREATOR, SWARM_ROLE.OWNER],
          });
          await updateWorkitem(workitemid, {
            action: { name: ACTION.REQUEST_REVIEW, payload },
          });
          toastFinish();
        }
      } else {
        toastStart();
        dispatchStatusChange();
        await updateWorkitem(workitemid, { status: newStatus });
        toastFinish();
      }
    } catch (error) {
      toast({
        type: "error",
        icon: "check",
        title: "Changing status",
        description: `Error changing the status`,
        animation: "bounce",
        time: 5000,
      });
      console.log(error);
    }
  };

  const onChangeOwner = async ({
    workitemid,
    currentOwner,
    currentOwnerEmail,
    newOwner,
    newOwnerEmail,
    swarmUsers,
  }) => {
    swarmActions.dispatchUpdate({
      itemToUpdate: nodeMapWorkitemId[workitemid],
      propertyName: "ownerid",
      propertyValue: newOwner,
    });
    const fields = {};
    fields.action = {
      name: ACTION.ASSIGN,
      payload: {
        currentOwner,
        currentOwnerEmail,
        newOwner,
        newOwnerEmail,
        swarmUsers,
      },
    };
    setUpdateLoading(true);
    toast({
      type: "info",
      icon: "user",
      title: "Changing owner",
      description: "Changing owner in progress",
      animation: "bounce",
      time: 5000,
    });
    try {
      const result = await updateWorkitem(workitemid, { ...fields });
      if (result && !result.errorCode) {
        toast({
          type: "success",
          icon: "user",
          title: "Changing owner",
          description: "Successfully changed the owner",
          animation: "bounce",
          time: 5000,
        });
        await fetchWorkitemsBySwarms(getSwarms());
      } else {
        toast({
          type: "error",
          icon: "user",
          title: "Changing owner",
          description: `Error changing the owner`,
          animation: "bounce",
          time: 5000,
        });
        swarmActions.dispatchUpdate({
          itemToUpdate: nodeMapWorkitemId[workitemid],
          propertyName: "ownerid",
          propertyValue: currentOwner,
        });
      }
      setUpdateLoading(false);
    } catch (err) {
      toast({
        type: "error",
        icon: "user",
        title: "Changing owner",
        description: `Error changing the owner ${JSON.stringify(err.message)}`,
        animation: "bounce",
        time: 5000,
      });
      swarmActions.dispatchUpdate({
        itemToUpdate: nodeMapWorkitemId[workitemid],
        propertyName: "ownerid",
        propertyValue: currentOwner,
      });
      setUpdateLoading(false);
    }
  };
  
  return {
    onChangeLevel,
    onChangeStatus,
    onChangeOwner,
    updateLoading,
  };
};
