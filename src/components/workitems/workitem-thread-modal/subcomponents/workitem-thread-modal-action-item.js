import {
  faHandshakeAlt,
  faKeynote,
  faQuestion,
  faSignature,
  faVacuum,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "glamor";
import React from "react";
import { Image } from "semantic-ui-react";
import { default_avatar } from "../../../../utils/static-images";
import { getUser } from "../../../../utils/user";
import {
  ACTION,
  WORKITEMS_ACTION_ICONS as ICONS,
} from "../../workitems-definitions";
import "./workitem-thread-modal-action-item.less";

const ActionBasic = ({
  action,
  selectedConversationSidFromLeftPanel,
  allUsers,
}) => {
  const getActionUser = () => {
    if (action.actionType === ACTION.ASSIGN) {
      return action.payload.currentOwner || action.payload.owner;
    }
    return action.actionOwners[0];
  };

  const styles = {
    actionBtnStyle: {
      width: "32px !important",
      height: "32px !important",
      display: "flex !important",
      alignItems: "center !important",
      justifyContent: "center !important",
      borderRadius: "8px !important",
    },
    avatarStyle: {
      minWidth: "25px !important",
      minHeight: "25px !important",
      maxWidth: "25px !important",
      maxHeight: "25px !important",
      borderRadius: "8px",
    },
    borderStyle: {
      border: "solid",
      borderColor: "red !important",
      borderWidth: "1px",
    },
  };
  const avatar =
    getUser({
      userid: getActionUser(),
      allUsers,
    }).getPropertyValue("picture") || default_avatar;
  return (
    <div
      className="actionItemStyle"
      key={`ActionBasic_${action.actionid}`}
      {...css(
        selectedConversationSidFromLeftPanel === action.conversationId &&
          styles.borderStyle
      )}
    >
      {/* Type, Action Name, Status, Avatar */}
      <button
        className={`ui icon button ${
          ICONS.find((i) => i.id === action.actionType)?.bgColor
        }`}
        {...css(styles.actionBtnStyle)}
      >
        <FontAwesomeIcon
          icon={generateActionIcon(action.actionType)}
          className="fix_icon_action_white_16"
        />
      </button>

      <div className="fullWidth">
        <div className="fix_body2_10">{action.name}</div>
        <div className="fix_body3_grey3_8">{action.date_created}</div>
      </div>

      <div>
        <Image src={avatar} alt="img" {...css(styles.avatarStyle)} />
      </div>
    </div>
  );
};

export const WorkItemThreadModalActionItem = ({
  action,
  onSelectedConversationChanged,
  selectedConversationSidFromLeftPanel,
  allUsers,
}) => {
  return (
    <div
      onClick={() => {
        onSelectedConversationChanged(action.conversationId);
      }}
    >
      <ActionBasic
        action={action}
        selectedConversationSidFromLeftPanel={
          selectedConversationSidFromLeftPanel
        }
        allUsers={allUsers}
      />
    </div>
  );
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

export default WorkItemThreadModalActionItem;
