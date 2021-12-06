import React, { useContext, useEffect, useState } from "react";
import { Loader } from "semantic-ui-react";
import {
  ActionsContext,
  ConversationsContext,
  CurrentSwarmContext,
  SwarmsContext,
  UsersContext,
  WorkitemsContext,
} from "../../../store/context";
import UserContext from "../../user/context";
import PeopleCard from "./people-card";
import WorkItemCard from "./workitems-card";

export const CardSelector = ({ cardType, coachWorkitemList }) => {
  const { users, success: usersLoadingSuccess } = useContext(UsersContext);
  const { currentSwarm, getSwarms } = useContext(CurrentSwarmContext);
  const { swarms } = useContext(SwarmsContext);
  const {
    workitemsFromCurrentSwarm,
    fetchWorkitems,
    fetchWorkitemsBySwarms,
    loadingPage,
    success,
  } = useContext(WorkitemsContext);
  const {
    actions,
    success: actionsSuccess,
    fetchActionsByWorkitems,
  } = useContext(ActionsContext);
  const {
    conversations,
    success: conversationsSuccess,
    fetchConversationsByWorkitems,
  } = useContext(ConversationsContext);
  const context = useContext(UserContext);

  const [usersList, setUsersList] = useState([]);
  const [isWorkitemUpdated, setIsWorkitemUpdated] = useState(false);
  const [selectedSwarmUsers, setSelectedSwarmUsers] = useState([]);

  const getWorkitems = async () => {
    const swarms = getSwarms();
    if (swarms && swarms.length > 0) {
      await fetchWorkitemsBySwarms(swarms);
    } else {
      await fetchWorkitems();
    }
    setIsWorkitemUpdated(true);
  };

  const fetchActions = async () => {
    try {
      await fetchActionsByWorkitems(
        workitemsFromCurrentSwarm.map((w) => w.workitemid)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentSwarmUsers = async () => {
    try {
      let allSwarmUsers = [];
      if (swarms && swarms.length > 0) {
        swarms.forEach((swarm) => {
          const swarmUsers = [];
          swarmUsers.push({
            userid: swarm.creatorid,
            swarmid: swarm.swarmid,
            swarmname: swarm.name,
          });
          if (swarm.ownerid !== swarm.creatorid) {
            swarmUsers.push({
              userid: swarm.ownerid,
              swarmid: swarm.swarmid,
              swarmname: swarm.name,
            });
          }
          if (swarm.users && swarm.users.length > 0) {
            swarm.users.forEach((user) => {
              if (!swarmUsers.find((s) => s.userid === user.userid)) {
                swarmUsers.push({
                  userid: user.userid,
                  swarmid: swarm.swarmid,
                  swarmname: swarm.name,
                });
              }
            });
          }
          allSwarmUsers = [...allSwarmUsers, ...swarmUsers];
        });
      }
      setSelectedSwarmUsers(
        allSwarmUsers.filter((a) => a.userid !== context.user.username)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchConversations = async () => {
    try {
      await fetchConversationsByWorkitems(
        workitemsFromCurrentSwarm.map((w) => w.workitemid)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (usersLoadingSuccess) {
      setUsersList(users);
    }
  }, [users]);

  useEffect(() => {
    if (currentSwarm) {
      getWorkitems();
    }
  }, [currentSwarm]);

  useEffect(() => {
    if (
      workitemsFromCurrentSwarm &&
      workitemsFromCurrentSwarm.length > 0 &&
      isWorkitemUpdated &&
      success
    ) {
      fetchActions();
      fetchConversations();
    }
  }, [workitemsFromCurrentSwarm, isWorkitemUpdated, loadingPage]);

  useEffect(() => {
    if (currentSwarm) {
      getCurrentSwarmUsers();
    }
  }, [currentSwarm, swarms]);

  return (
    <>
      {currentSwarm && usersList && !loadingPage ? (
        <div>
          {cardType === "PEOPLE" ? (
            <PeopleCard
              currentSwarm={currentSwarm}
              selectedSwarmUsers={selectedSwarmUsers}
              allUsers={usersList}
              workitemsFromCurrentSwarm={workitemsFromCurrentSwarm}
              actions={actions}
              actionsSuccess={actionsSuccess}
              conversations={conversations}
              conversationsSuccess={conversationsSuccess}
              getWorkitems={getWorkitems}
            />
          ) : (
            <WorkItemCard
              allUsers={usersList}
              workitemsFromCurrentSwarm={workitemsFromCurrentSwarm}
              actions={actions}
              actionsSuccess={actionsSuccess}
              conversations={conversations}
              conversationsSuccess={conversationsSuccess}
              getWorkitems={getWorkitems}
              coachWorkitemList={coachWorkitemList}
            />
          )}
        </div>
      ) : (
        loadingPage && <Loader active={loadingPage} />
      )}
    </>
  );
};

export default CardSelector;
