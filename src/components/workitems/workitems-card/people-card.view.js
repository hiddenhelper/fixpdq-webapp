import { css } from "glamor";
import React from "react";
import { Card } from "semantic-ui-react";
import "./workitems-card.less";
import { getUser } from "../../../utils/user";
import { default_avatar } from "../../../utils/static-images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHeart, faUsersClass } from "@fortawesome/pro-light-svg-icons";
import RightSideButtons from "./right-side-buttons";

export const PeopleCardItem = ({
  swarmUser,
  conversations,
  actions,
  allUsers,
  workitemsFromCurrentSwarm,
  openThreadModal,
  viewType,
}) => {
  const peopleAvatar = getUser({
    userid: swarmUser.userid,
    allUsers,
  }).getPropertyValue("picture");
  const peopleIdentity = getUser({
    userid: swarmUser.userid,
    allUsers,
  }).getUserIdentity();

  return (
    <Card
      {...css(styles.peopleCardStyle)}
      className="fix_background_white_shadow fix_border_grey_1"
    >
      {/* Card Main Content */}
      <Card.Content>
        {/* Coach Icon */}
        <Card.Description className={"cardDescriptionStyle"}>
          <img
            src={peopleAvatar ? peopleAvatar : default_avatar}
            alt="img"
            {...css(styles.imageBackground)}
          />
        </Card.Description>

        {/* Name */}
        <Card.Description
          className={"cardDescriptionStyle"}
          style={{ marginBottom: "70px" }}
        >
          {viewType === "WhoNeedsMyHelp" ? (
            <FontAwesomeIcon icon={faUsersClass} className="fix_icon_bar_10" />
          ) : (
            <FontAwesomeIcon icon={faHandHeart} className="fix_icon_bar_10" />
          )}
          <label className="fix_body1_10" {...css(styles.marginLeft5)}>
            {peopleIdentity}
          </label>
        </Card.Description>

        {/* Swarm/Workitem Field */}
        <Card.Description>
          <div
            {...css(styles.peopleDetailFieldStyle)}
            className="fix_background_grey_shadow"
          >
            <div className="fix_menu_12">SWARM NAME</div>
            <div className="fix_body1_10">{swarmUser.swarmname}</div>
          </div>
        </Card.Description>
      </Card.Content>


      <RightSideButtons
        conversations={conversations}
        actions={actions}
        workitemsFromCurrentSwarm={workitemsFromCurrentSwarm}
        openThreadModal={openThreadModal}
      />
    </Card>
  );
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

export default PeopleCardItem;
