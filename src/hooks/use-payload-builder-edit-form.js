import { useContext } from "react";
import { SWARM_ROLE } from "../components/swarms/swarms-definitions";
import { ACTION, STATUS } from "../components/workitems/workitems-definitions";
import { UsersContext } from "../store/context";
import { getUser } from "../utils/user";
import { usePayloadBuilderListView } from "./use-payload-builder-list-view";
import { useWorkitemsEditModal } from "./use-workitem-edit-modal";

export const usePayloadBuilderEditForm = ({ workitemsEditForm, prevState }) => {
  const { openWorkitemEditModalTimestamp } = useWorkitemsEditModal();
  const { users: allUsers } = useContext(UsersContext);
  const {
    assignStatusAction,
    reviewStatusAction,
    getSwarmUsersByWorkitemId,
  } = usePayloadBuilderListView();

  const getPayload = () => {
    let fields = {};
    let changes = {};
    const setAtomicFields = () => {
      const ownerEmail = getUser({
        userid: workitemsEditForm.owner,
        allUsers: allUsers,
      }).getPropertyValue("email");
      const creatorEmail = getUser({
        userid: workitemsEditForm.creator,
        allUsers: allUsers,
      }).getPropertyValue("email");

      fields.name = workitemsEditForm.name;
      if (prevState.name !== workitemsEditForm.name) {
        changes["name"] = workitemsEditForm.name;
      }
      fields.creatorid = workitemsEditForm.creator;
      fields.ownerid = workitemsEditForm.owner;
      fields.owner_email = ownerEmail;
      fields.creator_email = creatorEmail;
      if (workitemsEditForm["description"]) {
        fields["description"] = workitemsEditForm["description"];
      }
      if (workitemsEditForm["starts"]) {
        fields["start_time"] = new Date(workitemsEditForm["starts"]).getTime();
      }
      if (workitemsEditForm["ends"]) {
        fields["end_time"] = new Date(workitemsEditForm["ends"]).getTime();
      }
      fields.status = workitemsEditForm.status;
      if (prevState.status !== workitemsEditForm.status) {
        changes["status"] = workitemsEditForm.status;
      }
      fields.files = workitemsEditForm.files;
      if (prevState.priority !== workitemsEditForm.priority) {
        fields.priority = workitemsEditForm.priority;
        changes["priority"] = workitemsEditForm.priority;
        if (workitemsEditForm.priority === "INSANE") {
          fields.payload = {
            workitemid: workitemsEditForm.workitemid,
            owner: workitemsEditForm.owner,
            creator: workitemsEditForm.creator,
          };
        }
      }
      fields.difficulty = workitemsEditForm.difficulty;
      if (prevState.difficulty !== workitemsEditForm.difficulty) {
        changes["difficulty"] = workitemsEditForm.difficulty;
      }
      fields.partyMembers = workitemsEditForm.partyMembers;
      fields.openWorkitemEditModalTimestamp = openWorkitemEditModalTimestamp;
    };

    const setStatusAction = () => {
      if (prevState.owner !== workitemsEditForm.owner) {
        changes["ownerid"] = workitemsEditForm.owner;
        const payload = assignStatusAction({
          owner: workitemsEditForm.owner,
          workitemid: workitemsEditForm.workitemid,
        });
        fields.action = {
          name: ACTION.ASSIGN,
          payload,
        };
      }
      if (workitemsEditForm.status === STATUS.REVIEW) {
        changes["status"] = workitemsEditForm.status;
        const payload = reviewStatusAction({
          workitemid: workitemsEditForm.workitemid,
          owner: workitemsEditForm.owner,
          typeList: [SWARM_ROLE.ADMIN, SWARM_ROLE.CREATOR, SWARM_ROLE.OWNER],
        });
        fields.action = {
          name: ACTION.REQUEST_REVIEW,
          payload,
        };
      }
    };
    setAtomicFields();
    setStatusAction();

    return { payload: fields, changes: changes };
  };

  return {
    getPayload,
    getSwarmUsersByWorkitemId,
  };
};
