import React from "react";
import { css } from "glamor";
import moment from "moment";

import { Card, Image } from "semantic-ui-react";

import "./workitems-card.less";
import {
  default_avatar,
  FIX_THECOACH_WHITE2_20,
} from "../../../utils/static-images";
import {
  PRIORITY_DIFFICULTY_STATUS,
} from "../workitems-definitions";
import { getUser } from "../../../utils/user";
import { truncateString } from "../../../utils/truncate-string";
import { OwnerAvatar as OwnerDropdown } from "../workitems-list/subcomponents/owner-avatar";
import { StatusAttribute } from "../workitems-list/subcomponents/status-attribute";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faCalendarExclamation,
  faFlag,
  faTachometerAltFast,
  faEllipsisV,
} from "@fortawesome/pro-solid-svg-icons";
import RightSideButtons from "./right-side-buttons";

export const CardItem = ({
  workItem,
  allUsers,
  onEditWorkitemClicked,
  onConversationClicked,
  conversations,
  actions,
  workitemsFromCurrentSwarm,
  openThreadModal,
  onChangeOwner,
  onChangeLevel,
  onChangeStatus,
}) => {
  const styles = {
    cardStyle: {
      maxWidth: "180px !important",
      minWidth: "180px !important",
      minHeight: "280px !important",
    },
    iconSize: {
      width: "25px !important",
      height: "25px !important",
      marginRight: "5px",
      borderRadius: "8px",
    },
    cardFooterStyle: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statusBox: {
      padding: "5px 7px 5px 5px",
      width: "80px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "8px",
    },
    descriptionBox: {
      borderRadius: "8px",
      padding: "5px",
    },
    displayFlex: {
      display: "flex !important",
      alignItems: "center !important",
    },
  };

  const creator = getUser({
    userid: workItem.creatorid,
    allUsers,
  }).getUserIdentity();
  const owner = getUser({
    userid: workItem.ownerid,
    allUsers,
  }).getUserIdentity();
  const ownerAvatar = getUser({
    userid: workItem.ownerid,
    allUsers,
  }).getPropertyValue("picture");

  const show_Priority_Difficulty = (type, value) => {
    const num =
      PRIORITY_DIFFICULTY_STATUS.find((s) => s.name === value)?.value || 0;
    return PRIORITY_DIFFICULTY_STATUS.map((s, index) => {
      if (index <= num) {
        return (
          <FontAwesomeIcon
            icon={type === "priority" ? faFlag : faTachometerAltFast}
            className={
              PRIORITY_DIFFICULTY_STATUS.find((s) => s.name === value)
                ?.color_card
            }
            style={{ marginRight: "5px" }}
            key={index}
            onClick={() => {
              onChangeLevel({
                workitemid: workItem.workitemid,
                title: type.toLowerCase(),
                value: s.name ? s.name : value,
              });
            }}
          />
        );
      }
      return (
        <FontAwesomeIcon
          icon={type === "priority" ? faFlag : faTachometerAltFast}
          className="fix_icon_action_grey1_10"
          style={{ marginRight: "5px" }}
          key={index}
          onClick={() => {
            onChangeLevel({
              workitemid: workItem.workitemid,
              title: type.toLowerCase(),
              value: s.name ? s.name : value,
            });
          }}
        />
      );
    });
  };

  return (
    <Card
      {...css(styles.cardStyle)}
      className="fix_background_white_shadow fix_border_grey_1"
    >
      {/* Card Main Content */}
      <Card.Content className="cardContent">
        {/* Status */}
        <Card.Description className={"cardDescriptionStyle"}>
          <StatusAttribute item={workItem} onChangeStatus={onChangeStatus}/>
        </Card.Description>

        {/* swarm/workitem name */}
        <Card.Description className={"cardDescriptionStyle"}>
          <div
            {...css(styles.descriptionBox)}
            className="fix_background_grey_shadow"
          >
            <div className="fix_submenu_grey2_8">
              {truncateString(workItem.swarm_name, 50)}
            </div>
            <div className="fix_title_12">
              {truncateString(workItem.name, 25)}
            </div>
          </div>
        </Card.Description>

        {/* Creator */}
        <Card.Description className={"cardDescriptionStyle"}>
          <div className="displayFlex">
            <div style={{ width: "15px" }}>
              <FontAwesomeIcon icon={faUserEdit} className="fix_icon_bar_10" />{" "}
            </div>
            <label style={{ marginLeft: "5px" }} className="fix_body1_10">
              {creator}
            </label>
          </div>
        </Card.Description>

        {/* Due Date */}
        <Card.Description className={"cardDescriptionStyle"}>
          <div className="displayFlex">
            <div style={{ width: "15px" }}>
              <FontAwesomeIcon
                icon={faCalendarExclamation}
                className="fix_icon_bar_10"
              />
            </div>
            <label style={{ marginLeft: "5px" }} className="fix_body1_10">
              {workItem.end_time
                ? moment(new Date(workItem.end_time)).format("D MMM YYYY")
                : " "}
            </label>
          </div>
        </Card.Description>

        {/* Priority */}
        <Card.Description className={"cardDescriptionStyle"}>
          {show_Priority_Difficulty("priority", workItem.priority)}
        </Card.Description>

        {/* Difficulty */}
        <Card.Description className={"cardDescriptionStyle"}>
          {show_Priority_Difficulty("difficulty", workItem.difficulty)}
        </Card.Description>

        {/* More details */}
        <div {...css(styles.cardFooterStyle)}>
          <div {...css(styles.displayFlex)}>
            <OwnerDropdown
              workitemid={workItem.workitemid}
              avatar={ownerAvatar ? ownerAvatar : default_avatar}
              currentOwner={workItem.ownerid}
              allUsers={allUsers}
              onChangeOwner={onChangeOwner}
              swarmid={workItem.swarm}
            />
            <label className="fix_body1_10">{truncateString(owner, 8)}</label>
          </div>
          <div className="displayFlex">
            <div
              className="fix_background_grey1 displayFlex"
              {...css(styles.iconSize)}
              style={{ justifyContent: "center" }}
              onClick={() => {
                onEditWorkitemClicked(workItem.workitemid);
              }}
            >
              <FontAwesomeIcon icon={faEllipsisV} className="fix_icon_bar_10" />
            </div>
            <Image
              src={FIX_THECOACH_WHITE2_20}
              alt="img"
              {...css(styles.iconSize)}
              onClick={() => {
                onConversationClicked(workItem.workitemid, null);
              }}
            />
          </div>
        </div>
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

export default CardItem;
