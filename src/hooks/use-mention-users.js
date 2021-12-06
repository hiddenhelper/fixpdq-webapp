import { useContext } from "react";
import { POSITION_ACTION } from "../components/workitems/workitems-definitions";
import { updateWorkitem } from "../services/workitems";
import {
  AuthContext,
  SwarmsContext,
  UsersContext,
  WorkitemsContext,
} from "../store/context";
import { usePayloadBuilderListView } from "./use-payload-builder-list-view";
import { useWorkitemsTree } from "./use-workitems-tree";

export const useMentionUsers = () => {
  const { pickWorkitem } = useContext(WorkitemsContext);
  const { getUserName } = useContext(AuthContext);
  const { getCurrentSwarmProperty } = useContext(SwarmsContext);
  const { pickUser } = useContext(UsersContext);
  const { getLastChild } = useWorkitemsTree();
  const { getSwarmUsersBySwarmId } = usePayloadBuilderListView();

  const checkIfOwnerOrCreator = ({ wid, userid }) => {
    const workitem = pickWorkitem(wid);
    const owner = workitem.pickProp("ownerid");
    const creator = workitem.pickProp("creatorid");
    return userid === owner || userid === creator;
  };

  const createWorkitemsForMentionedUsers = async ({ wid, mentionedUsers }) => {
    const currentUser = getUserName();
    const lastChild = getLastChild(wid);
    const mentionedUsersFiltered = mentionedUsers
      .filter(
        (u) =>
          u !== currentUser &&
          !checkIfOwnerOrCreator({
            wid,
            userid: u,
          })
      )
      .map((u) => {
        return {
          userid: u,
          email: pickUser(u).getPropertyValue("email"),
        };
      });
    const workitem = pickWorkitem(wid);
    const swarmid = workitem.pickProp("swarm");
    const payload = {
      mentionedUsers: mentionedUsersFiltered,
      lastChild,
      currentUser,
      swarmid,
      swarmName: getCurrentSwarmProperty({
        currentSwarmId: swarmid,
        property: "name",
      }),
      swarmUsers: getSwarmUsersBySwarmId({ swarmId: swarmid }),
      name: workitem.pickProp("name"),
    };

    try {
      if (mentionedUsersFiltered && mentionedUsersFiltered.length > 0) {
        await updateWorkitem(wid, {
          positionActions: [
            {
              name: POSITION_ACTION.CREATE_FOR_MENTIONS,
              payload,
            },
          ],
        });
      }
    } catch (err) {}
  };
  return {
    createWorkitemsForMentionedUsers,
  };
};
