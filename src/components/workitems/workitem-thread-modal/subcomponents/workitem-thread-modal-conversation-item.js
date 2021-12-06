import { css } from "glamor";
import React from "react";
import { default_avatar } from "../../../../utils/static-images";
import { getUser } from "../../../../utils/user";
import { JSONObjectValidator } from "../../../../utils/validator";
import "./workitem-thread-modal-action-item.less";
import { WORKITEMS_ACTION_ICONS } from "../../workitems-definitions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faQuestion } from "@fortawesome/pro-solid-svg-icons";
import { Image } from "semantic-ui-react";

export const WorkItemThreadModalConversationItem = ({
  conversation,
  onSelectedConversationChanged,
  selectedConversationSidFromLeftPanel,
  allUsers,
}) => {
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
  const conversationCreator =
    conversation.messages &&
    JSONObjectValidator(conversation.messages[0])?.author;
  const avatar =
    getUser({
      userid: conversationCreator,
      allUsers,
    }).getPropertyValue("picture") || default_avatar;
  return (
    <div
      className="actionItemStyle"
      {...css(
        selectedConversationSidFromLeftPanel === conversation.conversationid &&
          styles.borderStyle
      )}
      onClick={() => {
        onSelectedConversationChanged(conversation.conversationid);
      }}
    >
      {/* Type, Action Name, Status, Avatar */}
      <button
        className={`ui icon button ${WORKITEMS_ACTION_ICONS.find((i) => i.id === "question")?.bgColor}`}
        {...css(styles.actionBtnStyle)}
      >
        <FontAwesomeIcon
          icon={faQuestion}
          className="fix_icon_action_white_16"
        />
      </button>
      <div className="fullWidth">
          <div className="fix_body2_10">
            {conversation.topicName}
          </div>
          {/* conversation.date_created */}
          <div className="fix_body3_grey3_8"></div>
      </div>
      <div>
        <Image
          src={avatar}
          alt="img"
          {...css(styles.avatarStyle)}
        />
      </div>
    </div>
  );
};

export default WorkItemThreadModalConversationItem;
