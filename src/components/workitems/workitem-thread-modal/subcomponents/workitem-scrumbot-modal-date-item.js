import React from "react";
import { css } from "glamor";
import "./workitem-thread-modal-action-item.less";
import { faVacuum } from "@fortawesome/pro-solid-svg-icons";
import { FIX_THECOACH_WHITE2_20 } from "../../../../utils/static-images";
import { Image } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WORKITEMS_ACTION_ICONS as ICONS } from "../../workitems-definitions";

export const WorkItemScrumbotbotModalDateItem = ({ date }) => {
  const styles = {
    avatarStyle: {
      minWidth: "25px !important",
      minHeight: "25px !important",
      maxWidth: "25px !important",
      maxHeight: "25px !important",
    },
    actionBtnStyle: {
      width: "32px !important",
      height: "32px !important",
      display: "flex !important",
      alignItems: "center !important",
      justifyContent: "center !important",
      borderRadius: "8px !important",
    },
  };

  return (
    <div className="actionItemStyle">
      <div className="displayFlex">
        <Image
          src={FIX_THECOACH_WHITE2_20}
          alt="img"
          {...css(styles.avatarStyle)}
        />
        <div className="fix_body2_10">TheCoach</div>
      </div>
      <div className="displayFlex">
        <div className="fix_body3_grey3_8">{date?.toLocaleString()}</div>
        <button
          className={`ui icon button ${
            ICONS.find((i) => i.id === "housekeeping")?.bgColor
          }`}
          {...css(styles.actionBtnStyle)}
        >
          <FontAwesomeIcon
            icon={faVacuum}
            className="fix_icon_action_white_16"
          />
        </button>
      </div>
    </div>
  );
};

export default WorkItemScrumbotbotModalDateItem;
