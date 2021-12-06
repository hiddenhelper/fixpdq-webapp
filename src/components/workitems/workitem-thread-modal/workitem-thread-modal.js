/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "glamor";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-semantic-toasts";
import { Grid, Image } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
import { useWorkitemsTree } from "../../../hooks";
import { getActionsByTypeAndOwnerAndTimeStamp } from "../../../services/actions";
import {
  createConversation,
  createNewChannel,
  getConversationsByListOfWorkitemIds,
  storeMessageToDB,
} from "../../../services/conversations";
import { getSwarm } from "../../../services/swarms";
import {
  ActionsContext,
  TwilioContext,
  UsersContext,
  WorkitemsContext,
} from "../../../store/context";
import editorUtils from "../../../utils/editor";
import { pickProperty } from "../../../utils/user";
import { JSONObjectValidator } from "../../../utils/validator";
import UserContext from "../../user/context";
import WorkItemScrumbotModalSidebarView from "./workitem-scrumbot-modal-sidebar.view";
import WorkItemScrumbotModalView from "./workitem-scrumbot-modal.view";
import WorkItemThreadModalSidebarView from "./workitem-thread-modal-sidebar.view";
import WorkItemThreadModalView from "./workitem-thread-modal.view";
import { truncateString } from "../../../utils/truncate-string";
import { FIX_THECOACH_BLACK2_20 } from "../../../utils/static-images";
import { useWorkitemsList } from "../../../hooks/use-workitems-list";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTasksAlt, faSort } from "@fortawesome/pro-solid-svg-icons";
import { useHistory } from "react-router";

export const WorkItemThreadModal = ({
  selectedWorkitemId,
  selectedConversationId,
  setSelectedConversationId,
  closeConversationModal,
}) => {
  const context = useContext(UserContext);
  const {
    actions: actionsList,
    success: actionsSuccess,
    loading: actionsLoading,
  } = useContext(ActionsContext);
  const { workitemsFromCurrentSwarm } = useContext(WorkitemsContext);
  const { users, success: usersLoadingSuccess } = useContext(UsersContext);
  const { getLastChild } = useWorkitemsTree();

  const [usersList, setUsersList] = useState([]);
  const [actions, setActions] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [twilioConversation, setTwilioConversation] = useState(null);

  const [conversationIdList, setConversationIdList] = useState([]);
  const { twilioConversations } = useContext(TwilioContext);
  const [threadType, setThreadType] = useState(null);
  const [houseKeepingActions, setHouseKeepingActions] = useState([]);
  const [today, setToday] = useState();

  const [pendingMessage, setPendingMessage] = useState(null);
  const [repliedMessage, setRepliedMessage] = useState(null);
  const [swarmUsers, setSwarmUsers] = useState([]);

  const [sortByTime, setSortByTime] = useState(false);
  const history = useHistory();

  const { onChangeLevel, onChangeOwner, onChangeStatus } = useWorkitemsList();

  const styles = {
    threadModalStyle: {
      backgroundColor: "white",
      margin: "0px !important",
    },
    maxSize: {
      width: "100%",
      height: "100%",
    },
    headerBtn: {
      borderRadius: "8px",
      padding: "7px 10px",
      margin: "0px 10px 0px 0px",
      cursor: "pointer",
    },
  };

  useEffect(() => {
    if (selectedWorkitemId) {
      setThreadType("Conversation");
    } else {
      setThreadType("Scrumbot");
    }
    clearConversationsAndActions();
    fetchUsers();
    fetchConversationsFromDB();
    fetchActionsForCoach();
  }, [selectedWorkitemId]);

  useEffect(() => {
    if (usersLoadingSuccess) {
      setUsersList(users);
    }
  }, [users]);

  useEffect(() => {
    const filterTwilioConversations = () => {
      if (selectedWorkitemId) {
        const item = twilioConversations.find(
          (c) => c.attributes.workItem === selectedWorkitemId
        );
        setTwilioConversation(item);
      } else {
        setTwilioConversation(null);
      }
    };

    filterTwilioConversations();
  }, [twilioConversations, selectedWorkitemId]);

  useEffect(() => {
    if (twilioConversation) {
      bindingNewMessage();
      if (
        pendingMessage &&
        twilioConversation.sid === pendingMessage.channelId
      ) {
        // if pending message is not null, then send it
        sendPendingMessage();
      }
    }
  }, [twilioConversation]);

  useEffect(() => {
    // send pending message after new channel initialized.
    if (
      pendingMessage &&
      twilioConversation &&
      twilioConversation.sid === pendingMessage.channelId
    ) {
      sendPendingMessage();
    }
  }, [pendingMessage]);

  useEffect(() => {
    console.log("repliedMessage Hook");
    if (repliedMessage) {
      console.log("repliedMessage Hook - not null");
      let newConversations = conversations;
      const index = conversations.findIndex(
        (c) => c.conversationid === repliedMessage.attributes.conversationid
      );
      if (index >= 0) {
        newConversations[index].messages.push(JSON.stringify(repliedMessage));
        setConversations(newConversations);
      }
      setRepliedMessage(null);
    }
  }, [repliedMessage]);

  useEffect(() => {
    fetchActions();
  }, [selectedWorkitemId, actionsList]);

  const getReceipient = (msg) => {
    let userIdList = [];
    usersList.forEach((user) => {
      if (msg.includes(pickProperty(user, "email"))) {
        userIdList.push(user.Username);
      }
    });
    return userIdList.join(",");
  };

  const createNewConversation = async (message) => {
    try {
      const json = JSONObjectValidator(message);
      const topicFromMessage = json ? editorUtils.getText(json) : message;

      if (conversations.length > 0 && !twilioConversation) {
        toast({
          type: "error",
          icon: "user",
          title: "Create Conversation",
          description:
            "Couldn't find Twilio Conversation! Please make sure if you are connected to Twilio or you are a participant of this conversation.",
          animation: "bounce",
          time: 5000,
        });
        return;
      }

      const conversationid = uuidv4();
      const msgRecipient = getReceipient(message);

      if (conversations.length === 0 && !twilioConversation) {
        // create a new Channel for this work item
        let participants = [{ Username: context.user.username }];
        msgRecipient.split(",").forEach((recipient) => {
          if (recipient) {
            participants.push({ Username: recipient });
          }
        });
        const data = {
          workItem: selectedWorkitemId,
          participants,
        };
        const channelId = await createNewChannel(data);
        const messageBody = {
          body: message,
          attributes: {
            recipient: msgRecipient,
            recipients: [msgRecipient],
            conversationid,
            workitemid: selectedWorkitemId,
            topicName: truncateString(topicFromMessage, 20),
          },
        };
        setPendingMessage({
          channelId,
          messageBody,
        });
      } else {
        // send Message through Twilio Client SDK
        await sendMessage({
          body: message,
          attributes: {
            recipient: msgRecipient,
            recipients: [msgRecipient],
            conversationid,
            workitemid: selectedWorkitemId,
            topicName: truncateString(topicFromMessage, 20),
          },
        });
      }
    } catch (error) {
      console.log("[error]: create new conversation", error);
    }
  };

  const createConversationToDB = async ({ twilioMessage, participants }) => {
    try {
      const workitemid = twilioMessage.attributes.workitemid;
      const swarmId = workitemsFromCurrentSwarm.find(
        (s) => s.workitemid === workitemid
      )?.swarm;
      const conversationInfo = {
        channelId: twilioConversation.sid,
        conversationid: twilioMessage.attributes.conversationid,
        workitemid: twilioMessage.attributes.workitemid,
        topicName: twilioMessage.attributes.topicName,
        swarmId,
        lastChild: getLastChild(workitemid),
        participants,
        twilioMessage,
      };
      const result = await createConversation(conversationInfo);
      if (result && result.errorCode) {
        toast({
          type: "error",
          icon: "user",
          title: "Create Conversation",
          description: result.message,
          animation: "bounce",
          time: 5000,
        });
      }
    } catch (error) {
      console.log("[error]: createConversationToDB", error);
    }
  };

  const sendMessage = async (data) => {
    try {
      return await twilioConversation.sendMessage(data.body, data.attributes);
    } catch (error) {
      console.log("[error]: send message through twilio client sdk", error);
    }
  };

  const sendPendingMessage = async () => {
    try {
      let data = pendingMessage.messageBody;
      setPendingMessage(null);
      await sendMessage(data);
    } catch (error) {
      console.log(
        "[error]: send pending message through twilio client sdk",
        error
      );
    }
  };

  const replyMessage = async (conversationid, message) => {
    try {
      const msgRecipient = getReceipient(message);
      await sendMessage({
        body: message,
        attributes: {
          recipient: msgRecipient,
          recipients: [msgRecipient],
          conversationid,
          workitemid: selectedWorkitemId,
        },
      });
    } catch (error) {
      console.log("[error]: reply message", error);
    }
  };

  const bindingNewMessage = () => {
    twilioConversation.removeAllListeners();
    twilioConversation.on("messageAdded", messageAdded);
  };

  const messageAdded = (m) => {
    console.log("new message added");
    const twilioMessage = {
      author: m.author,
      body: m.body,
      attributes: m.attributes,
      dateUpdated: m.dateUpdated,
      dateCreated: m.dateCreated,
      conversationSid: twilioConversation.sid,
      sid: m.sid,
    };

    let participants = [];
    if (twilioMessage.attributes && twilioMessage.attributes.recipient) {
      twilioMessage.attributes.recipient.split(",").forEach((recipient) => {
        if (recipient) {
          participants.push({ Username: recipient });
        }
      });
    }

    if (twilioMessage.attributes.topicName) {
      // new conversation
      const newConversation = {
        conversationid: twilioMessage.attributes.conversationid,
        workitemId: twilioMessage.attributes.workitemid,
        topicName: twilioMessage.attributes.topicName,
        messages: [JSON.stringify(twilioMessage)],
        providerMetadata: {
          messageId: twilioMessage.sid,
          channelId: twilioConversation.sid,
        },
      };
      setConversations((conversations) => [...conversations, newConversation]);

      if (twilioMessage.author === context.user.username) {
        // if converation creator = me
        createConversationToDB({ twilioMessage, participants });
      }
    } else {
      // replied MSG
      console.log("reply MSG:", twilioMessage);
      setRepliedMessage(twilioMessage);
      if (twilioMessage.author === context.user.username) {
        // if message creator = me
        const workitemid = twilioMessage.attributes.workitemid;
        const swarmId = workitemsFromCurrentSwarm.find(
          (s) => s.workitemid === workitemid
        )?.swarm;
        const lastChild = getLastChild(workitemid);

        storeMessageToDB(twilioMessage.attributes.conversationid, {
          channelId: twilioMessage.conversationSid,
          conversationid: twilioMessage.attributes.conversationid,
          twilioMessage,
          workitemid,
          swarmId,
          lastChild,
        });
      }
    }
  };

  const fetchActionsForCoach = async () => {
    const now = new Date();
    const timeStamp =
      now.getTime() -
      now.getHours() * 60 * 60 * 1000 -
      now.getMinutes() * 60 * 1000 -
      now.getSeconds() * 1000;
    const {
      items: items_housekeeping,
    } = await getActionsByTypeAndOwnerAndTimeStamp(
      "housekeeping",
      context.user.username,
      timeStamp
    );
    setToday(now.toDateString());
    setHouseKeepingActions(items_housekeeping || []);
  };

  const fetchActions = () => {
    if (selectedWorkitemId) {
      setActions(
        actionsList.filter((a) => a.workitemid === selectedWorkitemId)
      );
    }
  };

  const fetchConversationsFromDB = async () => {
    try {
      if (selectedWorkitemId) {
        const items = await getConversationsByListOfWorkitemIds([
          selectedWorkitemId,
        ]);
        if (items && items.length > 0) {
          setConversations(items);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSelectedConversationChanged = (conversationSid) => {
    if (conversationSid === selectedConversationId) {
      setSelectedConversationId(null);
    } else {
      setSelectedConversationId(conversationSid);
    }
  };

  const HeaderBar = () => {
    return (
      <div>
        <div
          className="displayFlex"
          style={{
            justifyContent: "flex-end",
            height: "45px !important",
            maxHeight: "45px !important",
          }}
        >
          <div className="displayFlex">
            {selectedWorkitemId && (
              <>
                <div
                  className={
                    threadType === "Context"
                      ? "fix_background_yellow_shadow displayFlex"
                      : "displayFlex"
                  }
                  {...css(styles.headerBtn)}
                  onClick={() => {
                    setThreadType("Context");
                  }}
                >
                  <FontAwesomeIcon
                    icon={faSort}
                    className="fix_icon_rmenu_14"
                  />
                  <label className="fix_menu_12" style={{ marginLeft: "5px" }}>
                    Context
                  </label>
                </div>

                <div
                  className={
                    threadType === "Conversation"
                      ? "fix_background_yellow_shadow displayFlex"
                      : "displayFlex"
                  }
                  {...css(styles.headerBtn)}
                  onClick={() => {
                    setThreadType("Conversation");
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTasksAlt}
                    className="fix_icon_rmenu_14"
                  />
                  <label className="fix_menu_12" style={{ marginLeft: "5px" }}>
                    Conversations
                  </label>
                </div>
              </>
            )}
            <div
              className="displayFlex"
              style={{ marginRight: "10px" }}
              onClick={() => {
                setThreadType("Scrumbot");
              }}
            >
              <Image
                src={FIX_THECOACH_BLACK2_20}
                alt="img"
                width="32px"
                height="32px"
              />
            </div>
            <div
              onClick={() => {
                closeConversationModal();
              }}
            >
              <FontAwesomeIcon icon={faTimes} className="fix_icon_hero_24" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getSwarmUsers = async (swarmid) => {
    try {
      const { items } = await getSwarm(swarmid);
      if (items && items.length > 0) {
        const users = items[0].users.map((user) => {
          return { userid: user.userid };
        });
        users.push({ userid: items[0].creatorid });
        users.push({ userid: items[0].ownerid });
        setSwarmUsers(
          users.filter(
            (user, index) =>
              users.findIndex((u) => u.userid === user.userid) === index
          )
        );
      }
    } catch (error) {
      console.log("[error]: get Users by swarmid", error);
    }
  };

  const fetchUsers = async () => {
    if (selectedWorkitemId) {
      try {
        await getSwarmUsers(
          workitemsFromCurrentSwarm.find(
            (s) => s.workitemid === selectedWorkitemId
          )?.swarm
        );
      } catch (error) {
        console.log("[error]: Fetch Users", error);
      }
    }
  };

  const clearConversationsAndActions = () => {
    setActions([]);
    setConversations([]);
  };

  const routeToHome = (workitemIDList) => {
    closeConversationModal();
    history.push({
      pathname: '/home',
      state: {
        cardType: 'WORKITEM',
        workitemIDList: workitemIDList,
      }
    })
  }

  return (
    <Grid columns="equal" {...css(styles.threadModalStyle, styles.maxSize)}>
      <Grid.Column width={5} {...css(styles.maxSize)}>
        {threadType === "Conversation" ? (
          <WorkItemThreadModalSidebarView
            actionsList={actions}
            actionsSuccess={actionsSuccess}
            actionsLoading={actionsLoading}
            conversations={conversations}
            onSelectedConversationChanged={onSelectedConversationChanged}
            selectedConversationSidFromLeftPanel={selectedConversationId}
            setConversationIdList={setConversationIdList}
            allUsers={usersList}
            sortByTime={sortByTime}
            setSortByTime={setSortByTime}
          />
        ) : threadType === "Scrumbot" ? (
          <WorkItemScrumbotModalSidebarView
            date={today}
            sortByTime={sortByTime}
            setSortByTime={setSortByTime}
          />
        ) : (
          <></>
        )}
      </Grid.Column>
      <Grid.Column width={11} {...css(styles.maxSize)}>
        {HeaderBar()}
        {threadType === "Conversation" ? (
          <WorkItemThreadModalView
            conversations={
              !selectedConversationId
                ? conversations.filter((c) =>
                    conversationIdList.includes(c.conversationid)
                  )
                : conversations.filter(
                    (c) => c.conversationid === selectedConversationId
                  )
            }
            createNewConversation={createNewConversation}
            replyMessage={replyMessage}
            allUsers={usersList}
            swarmUsers={swarmUsers}
            workitem={workitemsFromCurrentSwarm.find(
              (s) => s.workitemid === selectedWorkitemId
            )}
            sortByTime={sortByTime}
            onChangeLevel={onChangeLevel}
            onChangeOwner={onChangeOwner}
            onChangeStatus={onChangeStatus}
          />
        ) : threadType === "Scrumbot" ? (
          <WorkItemScrumbotModalView
            allUsers={usersList}
            houseKeepingActions={houseKeepingActions}
            date={today}
            routeToHome={routeToHome}
          />
        ) : (
          <></>
        )}
      </Grid.Column>
    </Grid>
  );
};
export default WorkItemThreadModal;
