import React, { useState } from "react";
import { WORKITEMS_ACTION_ICONS } from "../../workitems-definitions";

import { Popup } from "semantic-ui-react";
import { css } from "glamor";

export const ActionPlusIcon = ({
  actionsGroup,
  workitemsFromCurrentSwarm,
  openThreadModal,
  minCardGroups,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      hoverable
      position="right center"
      trigger={
        <button
          className={`ui icon button ${WORKITEMS_ACTION_ICONS.find((w) => w.id === actionsGroup[0].actionType).bgColor}`}
          {...css(styles.actionBtnStyle)}
        >
          <label style={{ color: "white" }}>...</label>
        </button>
      }
      open={isOpen}
      onOpen={() => {
        setIsOpen(true);
      }}
      onClose={() => {
        setIsOpen(false);
      }}
      s
    >
      {minCardGroups(
        actionsGroup,
        workitemsFromCurrentSwarm,
        "action",
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

export default ActionPlusIcon;
