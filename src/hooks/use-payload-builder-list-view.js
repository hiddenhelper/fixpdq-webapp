import _ from "lodash";
import { useContext } from "react";
import {
  POSITION_ACTION,
  STATUS,
} from "../components/workitems/workitems-definitions";
import {
  SwarmsContext,
  UsersContext,
  WorkitemsContext,
} from "../store/context";
import { getUser } from "../utils/user";

export const usePayloadBuilderListView = () => {
  const { nodeMapWorkitemId } = useContext(WorkitemsContext);
  const { swarms, getCurrentSwarmProperty } = useContext(SwarmsContext);
  const { users: allUsers } = useContext(UsersContext);

  const getCurrSwarmName = (workitemid) => {
    if (workitemid && nodeMapWorkitemId[workitemid]) {
      return nodeMapWorkitemId[workitemid].swarm_name;
    } else {
      return getCurrentSwarmProperty({ property: "name" });
    }
  };

  const getCurrSwarmId = (workitemid) => {
    if (workitemid && nodeMapWorkitemId[workitemid]) {
      return nodeMapWorkitemId[workitemid].swarm;
    } else {
      return getCurrentSwarmProperty({ property: "swarmid" });
    }
  };

  const createNewWorkitem = ({
    parentId,
    predecessor,
    successor,
    title,
    context,
    stagingItem,
  }) => {
    return {
      positionActions: [
        {
          name: POSITION_ACTION.ADD,
          payload: {
            predecessor,
            successor,
            newParent: parentId,
            stagingItem,
          },
        },
      ],
      name: title,
      creatorid: context.user.username,
      start_time: new Date().getTime() + 1 * 24 * 60 * 60 * 1000,
      end_time: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
      priority: "MEDIUM",
      difficulty: "MEDIUM",
      status: "NEW",
      swarm: getCurrSwarmId(predecessor || parentId),
      swarm_name: getCurrSwarmName(predecessor || parentId),
    };
  };

  const addNewWorkitemToSwarm = ({ workitemid, title, context, sort }) => {
    return {
      workitemid,
      name: title,
      sort,
      creatorid: context.user.username,
      start_time: new Date().getTime() + 1 * 24 * 60 * 60 * 1000,
      end_time: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
      priority: "MEDIUM",
      difficulty: "MEDIUM",
      status: STATUS.NEW,
      isStaging: true,
      isStagingAndRemoved: false,
      swarm: getCurrentSwarmProperty({ property: "swarmid" }),
      swarm_name: getCurrentSwarmProperty({ property: "name" }),
    };
  };

  const assignStatusAction = ({ owner, workitemid }) => {
    const creator = nodeMapWorkitemId[workitemid].creatorid;
    const currentOwnerEmail = getUser({
      userid: creator,
      allUsers: allUsers,
    }).getPropertyValue("email");

    const newOwnerEmail = getUser({
      userid: owner,
      allUsers: allUsers,
    }).getPropertyValue("email");

    return {
      currentOwner: creator,
      currentOwnerEmail,
      newOwner: owner,
      newOwnerEmail,
      swarmUsers: getSwarmUsersByWorkitemId({ workitemid }),
    };
  };

  const reviewStatusAction = ({ workitemid, owner, typeList }) => {
    const getSwarmUsersByTypeList = (userTypeList) => {
      const users = [];
      userTypeList.forEach((type) => {
        const usersByType = new Set([
          ...getSwarmUsersByWorkitemIdAndType({
            workitemid,
            userType: type,
          }),
        ]);
        usersByType.forEach((u) => {
          users.push(u);
        });
      });
      return [...new Set(users)];
    };
    return {
      owner,
      swarmUsers: getSwarmUsersByWorkitemId({
        workitemid,
      }),
      reviewers: getSwarmUsersByTypeList(typeList),
    };
  };

  const getSwarmUsersByWorkitemIdAndType = ({ workitemid, userType }) => {
    const workitem = nodeMapWorkitemId[workitemid];
    if (workitem) {
      const swarmUsers = swarms.find(
        (swarm) => swarm.swarmid === workitem.swarm
      ).users;
      const groupedByUserId = _.groupBy(swarmUsers, "userid");
      const groupedByUserIdFiltered = Object.entries(groupedByUserId).filter(
        ([key, value]) => {
          const roles = value.map((v) => v.userrole);
          return roles.includes(userType);
        }
      );
      return Object.values(groupedByUserIdFiltered).map((tuple) => tuple[0]);
    } else {
      return [];
    }
  };

  const getSwarmUsersBySwarmId = ({ swarmId }) => {
    const swarmUsers = swarms.find((swarm) => swarm.swarmid === swarmId).users;

    const swarmUsersNoDuplicates = [
      ...new Set(swarmUsers.map((user) => user.userid)),
    ];

    return swarmUsersNoDuplicates.map((userid) => {
      return { Username: userid };
    });
  };

  const getSwarmUsersByWorkitemId = ({ workitemid }) => {
    const workitem = nodeMapWorkitemId[workitemid];
    if (workitem) {
      return getSwarmUsersBySwarmId({ swarmId: workitem.swarm });
    } else {
      return [];
    }
  };

  return {
    assignStatusAction,
    createNewWorkitem,
    addNewWorkitemToSwarm,
    reviewStatusAction,
    getSwarmUsersBySwarmId,
    getSwarmUsersByWorkitemId,
    getSwarmUsersByWorkitemIdAndType,
  };
};
