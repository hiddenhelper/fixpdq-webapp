import { useContext, useState } from "react";
import UserContext from "../../components/user/context";
import { ACTION } from "../../components/workitems/workitems-definitions";
import { CurrentSwarmContext, WorkitemsContext } from "../../store/context";
import { JSONObjectValidator } from "../../utils/validator";
import rules from "./rules";

export const usePeopleCard = ({
  conversations,
  actions,
  selectedSwarmUsers,
}) => {
  const [processRulesCompleted, setProcessRulesCompleted] = useState(false);
  const [whoNeedsMyHelp, setWhoNeedsMyHelp] = useState([]);
  const [whoNeedsToHelpMe, setWhoNeedsToHelpMe] = useState([]);
  const { workitemsFromCurrentSwarm } = useContext(WorkitemsContext);
  const { currentSwarm } = useContext(CurrentSwarmContext);
  const context = useContext(UserContext);

  const isWhoNeedsMyHelp = ({ swarmUser, convRecipient, actions }) => {
    const myConversations =
      convRecipient.filter((conversation) =>
        rules.whoNeedsMyHelpConversation({
          conversation,
          swarmUser,
          currentUser: context.user.username,
        })
      ) || [];

    const myActions = [];

    actions
      .filter((a) => a.status === "OPEN")
      .forEach((action) => {
        // Need to Check if action & people  are both in the same swarm:()
        if (
          swarmUser.swarmid ===
          workitemsFromCurrentSwarm.find(
            (w) => w.workitemid === action.workitemid
          )?.swarm
        ) {
          if (
            action.actionType === ACTION.ASSIGN &&
            action.payload.currentOwner === swarmUser.userid &&
            action.actionOwners &&
            action.actionOwners.includes(context.user.username)
          ) {
            myActions.push(action);
          } else if (
            action.actionType === ACTION.REQUEST_REVIEW &&
            action.payload.owner === swarmUser.userid &&
            action.actionOwners &&
            action.actionOwners.includes(context.user.username)
          ) {
            myActions.push(action);
          }
        }
      });
    return {
      myConversations,
      myActions,
    };
  };

  const isWhoNeedToHelpMe = ({ swarmUser, convRecipient, actions }) => {
    const myConversations =
      convRecipient.filter((conversation) =>
        rules.whoNeedsToHelpMeConversation({
          conversation,
          swarmUser,
          currentUser: context.user.username,
        })
      ) || [];
    const myActions = [];

    actions
      .filter((a) => a.status === "OPEN")
      .forEach((action) => {
        // Need to Check if action & people  are both in the same swarm:()
        if (
          swarmUser.swarmid ===
          workitemsFromCurrentSwarm.find(
            (w) => w.workitemid === action.workitemid
          )?.swarm
        ) {
          if (
            action.actionType === ACTION.ASSIGN &&
            action.payload.currentOwner === context.user.username &&
            action.actionOwners &&
            action.actionOwners.includes(swarmUser.userid)
          ) {
            myActions.push(action);
          } else if (
            action.actionType === ACTION.REQUEST_REVIEW &&
            action.payload.owner === context.user.username &&
            action.actionOwners &&
            action.actionOwners.includes(swarmUser.userid)
          ) {
            myActions.push(action);
          }
        }
      });
    return {
      myConversations,
      myActions,
    };
  };

  const getPeopleCardsByViewType = () => {
    setProcessRulesCompleted(false);
    let peopleCards = {
      whoNeedsMyHelp: [],
      whoNeedsToHelpMe: [],
    };
    let conversationsWithNoActions = conversations
      .filter(
        (c) =>
          workitemsFromCurrentSwarm.find(
            (w) => w.workitemid === c.workitemId
          ) && !actions.find((a) => a.conversationId === c.conversationid)
      )
      .filter((c) => !c.status || c.status !== "CLOSED");
    let conv_Recipient = conversationsWithNoActions.map((c) => {
      let recipients = "";
      let conversationStarter;
      let lastMessageAuthor;
      c.messages.forEach((message, index) => {
        const messageObject = JSONObjectValidator(message);
        if (messageObject && messageObject.attributes.recipient) {
          recipients += messageObject.attributes.recipient + ",";
        }
        if (messageObject && index === 0) {
          conversationStarter = messageObject.author;
        }
        if (messageObject && index === c.messages.length - 1) {
          lastMessageAuthor = messageObject.author;
        }
      });
      return {
        conv_id: c.conversationid,
        conv_starter: conversationStarter,
        recipient_id: recipients,
        workitemId: c.workitemId,
        workitem: workitemsFromCurrentSwarm.find(
          (w) => w.workitemid === c.workitemId
        ),
        lastMessage_author: lastMessageAuthor,
      };
    });
    selectedSwarmUsers.map((swarmUser) => {
      const {
        myConversations: myConversations_WhoNeedsMyHelp,
        myActions: myActions_WhoNeedsMyHelp,
      } = isWhoNeedsMyHelp({
        swarmUser,
        convRecipient: conv_Recipient,
        actions,
      });
      if (
        myConversations_WhoNeedsMyHelp.length > 0 ||
        myActions_WhoNeedsMyHelp.length > 0
      ) {
        peopleCards.whoNeedsMyHelp.push({
          swarmUser,
          conversations: myConversations_WhoNeedsMyHelp.map((conv) =>
            conversationsWithNoActions.find(
              (c) => c.conversationid === conv.conv_id
            )
          ),
          actions: myActions_WhoNeedsMyHelp,
        });
      }

      const {
        myConversations: myConversations_WhoNeedToHelpMe,
        myActions: myActions_WhoNeedToHelpMe,
      } = isWhoNeedToHelpMe({
        swarmUser,
        convRecipient: conv_Recipient,
        actions,
      });
      if (
        myConversations_WhoNeedToHelpMe.length > 0 ||
        myActions_WhoNeedToHelpMe.length > 0
      ) {
        peopleCards.whoNeedsToHelpMe.push({
          swarmUser,
          conversations: myConversations_WhoNeedToHelpMe.map((conv) =>
            conversationsWithNoActions.find(
              (c) => c.conversationid === conv.conv_id
            )
          ),
          actions: myActions_WhoNeedToHelpMe,
        });
      }
    });
    setWhoNeedsMyHelp(peopleCards.whoNeedsMyHelp);
    setWhoNeedsToHelpMe(peopleCards.whoNeedsToHelpMe);
    // return peopleCards;
    setProcessRulesCompleted(true);
  };

  return {
    whoNeedsMyHelp,
    whoNeedsToHelpMe,
    getPeopleCardsByViewType,
    processRulesCompleted,
  };
};
