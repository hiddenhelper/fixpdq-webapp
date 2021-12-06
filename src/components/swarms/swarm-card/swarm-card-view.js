import React from "react";
import moment from "moment";

import { Card, Image } from "semantic-ui-react";
import { css } from "glamor";
import { default_avatar } from "../../../utils/static-images";
import { getUser } from "../../../utils/user";
import "./swarm-card.less";
import { truncateString } from "../../../utils/truncate-string";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faCalendarExclamation,
  faEllipsisV,
} from "@fortawesome/pro-solid-svg-icons";

export const SwarmCardView = ({
  swarm,
  allUsers,
  onSwarmEditButtonClicked,
}) => {
  const styles = {
    cardStyle: {
      maxWidth: "180px !important",
      minWidth: "180px !important",
      minHeight: "280px !important",
    },
    iconSize: {
      width: "20px !important",
      height: "20px !important",
      marginRight: "5px",
      borderRadius: "8px",
    },
    descriptionStyle: {
      marginBottom: "20px !important",
    },
    descriptionBox: {
      borderRadius: "5px",
      padding: "3px 5px",
    },
    cardFooterStyle: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  };

  const creator = getUser({
    userid: swarm.creatorid,
    allUsers,
  }).getUserIdentity();
  const ownerAvatar = getUser({
    userid: swarm.ownerid,
    allUsers,
  }).getPropertyValue("picture");
  const owner = getUser({
    userid: swarm.ownerid,
    allUsers,
  }).getUserIdentity();

  return (
    <Card
      {...css(styles.cardStyle)}
      className="fix_background_white_shadow fix_border_grey_1"
    >
      {/* Card Main Content */}
      <Card.Content className="cardContent">
        {/* Header */}
        <Card.Description className={"swarmCardDescriptionStyle"}>
          <div
            {...css(styles.descriptionBox)}
            className="fix_background_grey_shadow fix_body1_10"
          >
            {truncateString(swarm.name, 25)}
          </div>
        </Card.Description>
        {/* Description */}
        <Card.Description
          className={"swarmCardDescriptionStyle"}
          {...css(styles.descriptionStyle)}
        >
          <div className="fix_body2_10">
            {swarm.description
              ? truncateString(swarm.description, 50)
              : "No Description"}
          </div>
        </Card.Description>

        <Card.Description className={"swarmCardDescriptionStyle"}>
          {/* Creator */}
          <div className="displayFlex" style={{marginBottom: "5px"}}>
            <div style={{ width: "15px" }}>
              <FontAwesomeIcon icon={faUserEdit} className="fix_icon_bar_10" />{" "}
            </div>
            <label style={{ marginLeft: "5px" }} className="fix_body1_10">
              {creator}
            </label>
          </div>

          {/* Deadline */}
          <div className="displayFlex">
            <div style={{ width: "15px" }}>
              <FontAwesomeIcon
                icon={faCalendarExclamation}
                className="fix_icon_bar_10"
              />
            </div>
            <label style={{ marginLeft: "5px" }} className="fix_body1_10">
              {swarm.due_date
                ? moment(new Date(swarm.due_date)).format("D MMM YYYY")
                : " "}
            </label>
          </div>
        </Card.Description>

        {/* More details */}
        <div {...css(styles.cardFooterStyle)}>
          <div {...css(styles.displayFlex)}>
            <Image
              src={ownerAvatar ? ownerAvatar : default_avatar}
              alt="img"
              {...css(styles.iconSize)}
            />
            <label className="fix_body1_10">{truncateString(owner, 8)}</label>
          </div>
          <div className="displayFlex">
            <div
              className="fix_background_grey1 displayFlex"
              {...css(styles.iconSize)}
              style={{ justifyContent: "center" }}
              onClick={() => {
                onSwarmEditButtonClicked(swarm.swarmid);
              }}
            >
              <FontAwesomeIcon icon={faEllipsisV} className="fix_icon_bar_10" />
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default SwarmCardView;
