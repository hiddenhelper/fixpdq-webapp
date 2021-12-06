import { css } from "glamor";
import React, { useState } from "react";
import { WORKITEMS_ACTION_ICONS } from "../../workitems-definitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Popup } from "semantic-ui-react";

export const ConversationIcon = ({
  conversation,
  openThreadModal,
  workitemsFromCurrentSwarm,
  minCardForConversation,
  generateActionIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popup
      hoverable
      position="right center"
      trigger={
        <button
          className={`ui icon button ${WORKITEMS_ACTION_ICONS.find((w) => w.id === "question").bgColor}`}
          {...css(styles.actionBtnStyle)}
          onClick={() => {
            openThreadModal(
              conversation.workitemId,
              conversation.conversationid
            );
          }}
        >
          <FontAwesomeIcon
            icon={generateActionIcon("question")}
            className="fix_icon_action_white_16"
          />
        </button>
      }
      open={isOpen}
      onOpen={() => {
        setIsOpen(true);
      }}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      {minCardForConversation(
        conversation,
        workitemsFromCurrentSwarm,
        openThreadModal,
        setIsOpen
      )}
    </Popup>
  );
};

export const styles = {
  actionBtnStyle: {
    width: "32px !important",
    height: "32px !important",
    display: "flex !important",
    alignItems: "center !important",
    justifyContent: "center !important",
    borderRadius: "8px !important",
    marginBottom: "5px !important",
  },
};
export default ConversationIcon;
