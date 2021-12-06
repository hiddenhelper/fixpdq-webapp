import { css } from "glamor";
import React from "react";
import { Card, Icon } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignature,
  faVacuum,
  faKeynote,
  faHandshakeAlt,
  faQuestion,
} from "@fortawesome/pro-solid-svg-icons";
import { faHandHeart, faUsersClass } from "@fortawesome/pro-light-svg-icons";
import { WORKITEMS_ACTION_ICONS } from "../workitems-definitions";

export const CoachCardItem = ({ currentSwarm, openThreadModal, viewType }) => {
  return (
    <Card
      {...css(styles.coachCardStyle)}
      className="fix_background_black_shadow fix_border_grey_1"
    >
      {/* Card Main Content */}
      <Card.Content>
        {/* Coach Icon */}
        <Card.Description className={"cardDescriptionStyle"}>
          <div {...css(styles.imageBackground)}>
            <Icon
              name="chat"
              size="big"
              style={{ padding: "0px", margin: "0px" }}
            />
          </div>
        </Card.Description>

        {/* Name */}
        <Card.Description
          className={"cardDescriptionStyle"}
          style={{ marginBottom: "70px" }}
        >
          {viewType === "WhoNeedsMyHelp" ? (
            <FontAwesomeIcon
              icon={faUsersClass}
              className="fix_icon_bar_white_10"
            />
          ) : (
            <FontAwesomeIcon
              icon={faHandHeart}
              className="fix_icon_bar_white_10"
            />
          )}
          <label className="fix_body1_white_10" {...css(styles.marginLeft5)}>
            The Coach
          </label>
        </Card.Description>

        {/* Swarm/Workitem Field */}
        <Card.Description>
          <div
            {...css(styles.coachDetailFieldStyle)}
            className="fix_background_grey_shadow"
          >
            <div className="fix_menu_12">SWARM NAME</div>
            <div className="fix_body1_10">{currentSwarm?.name}</div>
          </div>
        </Card.Description>
      </Card.Content>

      {/* Right Side Buttons */}
      <div style={{ position: "absolute", top: "20px", right: "-17px" }}>
        <button
          className={`ui icon button ${
            WORKITEMS_ACTION_ICONS.find((i) => i.id === "housekeeping").bgColor
          }`}
          {...css(styles.actionBtnStyle)}
          onClick={() => {
            openThreadModal(null, null);
          }}
        >
          <FontAwesomeIcon
            icon={faVacuum}
            className="fix_icon_action_white_16"
          />
        </button>
      </div>
    </Card>
  );
};

export const styles = {
  coachCardStyle: {
    maxWidth: "180px !important",
    maxHeight: "280px !important",
    minWidth: "180px !important",
    minHeight: "280px !important",
  },
  coachDetailFieldStyle: {
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
    marginBottom: "5px !important",
  },
  imageBackground: {
    width: "40px",
    height: "40px",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    borderRadius: "7px",
  },
  marginLeft5: {
    marginLeft: "5px",
  },
};

export default CoachCardItem;
