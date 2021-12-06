import { css } from "glamor";
import React from "react";
import "./workitems-card.less";
import {
  ACTION,
  WORKITEMS_ACTION_ICONS,
  MAX_ACTION_DISPLAY_COUNT,
} from "../workitems-definitions";

import { ActionIcon } from "./subcomponents/action-icon";
import { ActionPlusIcon } from "./subcomponents/action-plus-icon";
import { ConversationIcon } from "./subcomponents/conversation-icon";
import { ConversationPlusIcon } from "./subcomponents/conversation-plus-icon";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignature,
  faVacuum,
  faKeynote,
  faHandshakeAlt,
  faQuestion,
} from "@fortawesome/pro-solid-svg-icons";

export const RightSideButtons = ({
  conversations,
  actions,
  workitemsFromCurrentSwarm,
  openThreadModal,
}) => {

  const { actionsByType } = splitActionsByType({
    actions,
  });

  return (
    <div style={{ position: "absolute", top: "20px", right: "-17px" }}>
      {showActions({
        actionsByType,
        openThreadModal,
        workitemsFromCurrentSwarm,
      })}
      {showConversations({
        conversations,
        openThreadModal,
        workitemsFromCurrentSwarm,
      })}
    </div>
  );
};

const splitActionsByType = ({ actions }) => {
  let actionsByType = {};
  actions.forEach((action) => {
    let temp = actionsByType[action.actionType] || [];
    temp.push(action);
    actionsByType[action.actionType] = temp;
  });

  return { actionsByType };
};

const showActions = ({
  actionsByType,
  openThreadModal,
  workitemsFromCurrentSwarm,
}) => {
  return WORKITEMS_ACTION_ICONS.map((ACTION_TYPE) => {
    const actionsGroup = actionsByType[ACTION_TYPE.id]; // get actions by action Type
    if (actionsGroup && actionsGroup.length > 0) {
      return actionsGroup.map((action, index) => {
        if (index < MAX_ACTION_DISPLAY_COUNT) {
          if (
            index === MAX_ACTION_DISPLAY_COUNT - 1 &&
            index < actionsGroup.length - 1
          ) {
            // show ...button
            return (
              <ActionPlusIcon
                actionsGroup={actionsGroup}
                workitemsFromCurrentSwarm={workitemsFromCurrentSwarm}
                openThreadModal={openThreadModal}
                minCardGroups={minCardGroups}
                key={`${ACTION_TYPE.id}_ActionPlus`}
              />
            );
          }
          return (
            <ActionIcon
              action={action}
              openThreadModal={openThreadModal}
              workitemsFromCurrentSwarm={workitemsFromCurrentSwarm}
              minCardForAction={minCardForAction}
              generateActionIcon={generateActionIcon}
              key={`${ACTION_TYPE.id}_Action_${index}`}
            />
          );
        }
        return <></>;
      });
    }
    return <></>;
  });
};

const showConversations = ({
  conversations,
  openThreadModal,
  workitemsFromCurrentSwarm,
}) => {
  if (conversations && conversations.length > 0) {
    return conversations.map((conversation, index) => {
      if (index < MAX_ACTION_DISPLAY_COUNT) {
        if (
          index === MAX_ACTION_DISPLAY_COUNT - 1 &&
          index < conversations.length - 1
        ) {
          // show ... button
          return (
            <ConversationPlusIcon
              conversations={conversations}
              workitemsFromCurrentSwarm={workitemsFromCurrentSwarm}
              openThreadModal={openThreadModal}
              minCardGroups={minCardGroups}
              key={`ConversationPlus_${index}`}
            />
          );
        }
        return (
          <ConversationIcon
            conversation={conversation}
            openThreadModal={openThreadModal}
            workitemsFromCurrentSwarm={workitemsFromCurrentSwarm}
            minCardForConversation={minCardForConversation}
            generateActionIcon={generateActionIcon}
            key={`Conversation_${index}`}
          />
        );
      }
      return <></>;
    });
  }
  return <></>;
};

const minCardForAction = (
  action,
  workitemsFromCurrentSwarm,
  openThreadModal,
  setIsOpen
) => {
  return (
    <div className="actionItemStyle">
      <button
        className={`ui icon button ${
          WORKITEMS_ACTION_ICONS.find((i) => i.id === action.actionType).bgColor
        }`}
        {...css(styles.actionBtnStyle)}
        onClick={() => {
          openThreadModal(action.workitemid, action.conversationId);
          setIsOpen(false);
        }}
      >
        <FontAwesomeIcon
          icon={generateActionIcon(action.actionType)}
          className="fix_icon_action_white_16"
        />
      </button>

      <div className="fullWidth">
        <div className="displayFlex">
          <div style={{ marginRight: "10px", fontSize: "small" }}>
            {action.name}
          </div>
        </div>
        <div>
          {
            workitemsFromCurrentSwarm.find(
              (w) => w.workitemid === action.workitemid
            )?.name
          }
        </div>
      </div>
    </div>
  );
};

const minCardForConversation = (
  conversation,
  workitemsFromCurrentSwarm,
  openThreadModal,
  setIsOpen
) => {
  return (
    <div className="actionItemStyle">
      <button
        className={`ui icon button ${
          WORKITEMS_ACTION_ICONS.find((i) => i.id === "question").bgColor
        }`}
        {...css(styles.actionBtnStyle)}
        onClick={() => {
          openThreadModal(conversation.workitemId, conversation.conversationid);
          setIsOpen(false);
        }}
      >
        <FontAwesomeIcon
          icon={faQuestion}
          className="fix_icon_action_white_16"
        />
      </button>

      <div className="fullWidth">
        <div className="displayFlex">
          <div style={{ marginRight: "10px", fontSize: "small" }}>
            {conversation.topicName}
          </div>
        </div>
        <div>
          {
            workitemsFromCurrentSwarm.find(
              (w) => w.workitemid === conversation.workitemId
            )?.name
          }
        </div>
      </div>
    </div>
  );
};

const minCardGroups = (
  data,
  workitemsFromCurrentSwarm,
  type,
  openThreadModal,
  setIsOpen
) => {
  return data.map((item, index) => {
    if (index < MAX_ACTION_DISPLAY_COUNT - 1) {
      return <></>;
    }
    return (
      <div key={`minCardGroup_${index}`}>
        {type === "action"
          ? minCardForAction(
              item,
              workitemsFromCurrentSwarm,
              openThreadModal,
              setIsOpen
            )
          : minCardForConversation(
              item,
              workitemsFromCurrentSwarm,
              openThreadModal,
              setIsOpen
            )}
      </div>
    );
  });
};

export const styles = {
  peopleCardStyle: {
    maxWidth: "180px !important",
    minWidth: "180px !important",
    minHeight: "280px !important",
  },
  peopleDetailFieldStyle: {
    borderRadius: "5px",
    padding: "3px 5px",
  },
  actionBtnStyle: {
    width: "32px !important",
    height: "32px !important",
    display: "flex !important",
    alignItems: "center !important",
    justifyContent: "center !important",
    borderRadius: "8px !important",
    marginBottom: "5px",
  },
  imageBackground: {
    width: "40px",
    height: "40px",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    borderRadius: "8px",
  },
  marginLeft5: {
    marginLeft: "5px",
  },
};

const generateActionIcon = (id) => {
  switch (id) {
    case ACTION.ASSIGN:
      return faSignature;
    case ACTION.REQUEST_REVIEW:
      return faKeynote;
    case "collaboration":
      return faHandshakeAlt;
    case "housekeeping":
      return faVacuum;
    case "question":
      return faQuestion;
    default:
      break;
  }
};

export default RightSideButtons;
