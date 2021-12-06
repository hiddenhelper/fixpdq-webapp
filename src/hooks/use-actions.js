import { SWARM_ROLE } from "../components/swarms/swarms-definitions";
import { ACTION } from "../components/workitems/workitems-definitions";
import { usePayloadBuilderListView } from "./use-payload-builder-list-view";

export const useActions = ({
  workitemsEditForm,
  prevState,
  handleAction,
  users,
}) => {
  const {
    getSwarmUsersByWorkitemId,
    getSwarmUsersByWorkitemIdAndType,
  } = usePayloadBuilderListView();
  const handleWorkOnClick = async () => {
    await handleAction(ACTION.START_WORK, {
      ownerid: prevState.owner,
    });
  };

  const handlePauseClick = async () => {
    await handleAction(ACTION.STOP_WORK, {});
  };

  const handleSentToReviewClick = async () => {
    await handleAction(ACTION.REQUEST_REVIEW, {
      owner: workitemsEditForm.owner,
      reviewer: workitemsEditForm.reviewer,
      swarmUsers: getSwarmUsersByWorkitemId({
        workitemid: workitemsEditForm.workitemid,
      }),
      reviewers: getSwarmUsersByWorkitemIdAndType({
        workitemid: workitemsEditForm.workitemid,
        userType: SWARM_ROLE.ADMIN,
      }),
    });
  };

  const handleApproveClick = async () => {
    await handleAction(ACTION.APPROVE, {
      actionid: workitemsEditForm.actionid,
    });
  };

  const handleRejectClick = async () => {
    await handleAction(ACTION.REJECT, {
      actionid: workitemsEditForm.actionid,
    });
  };

  return {
    statusActionHandlers: {
      handleWorkOnClick,
      handlePauseClick,
      handleSentToReviewClick,
      handleApproveClick,
      handleRejectClick,
    },
  };
};
