import { css } from "glamor";
import React, { useContext, useEffect, useState } from "react";
import "./workitem-thread-modal.view.less";
import { Scrumbot_button } from "../../../utils/static-images";
import { Icon } from "semantic-ui-react";
// import { FIX_THECOACH_WHITE2_20 } from "../../../utils/static-images";
import { Image } from "semantic-ui-react";
import { getUser } from "../../../utils/user";
import UserContext from "../../user/context";
import { REMIND_WORKITEM_STATUS } from "../workitems-definitions";
// import { WORKITEMS_ACTION_ICONS } from "../workitems-definitions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVacuum, faEllipsisV } from "@fortawesome/pro-solid-svg-icons";

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WorkItemScrumbotModalView = ({
  allUsers,
  houseKeepingActions,
  today,
  // date,
  // routeToHome,
}) => {
  const context = useContext(UserContext);
  const myIdentity = getUser({
    userid: context.user.username,
    allUsers,
  }).getUserIdentity();
  const [expandStatus, setExpandStatus] = useState({
    workon: false,
    unassigned: false,
    openAction: false,
  });
  const [workitemList, setWorkitemList] = useState({
    workon: [],
    unassigned: [],
  });
  // const [workitemList, setWorkitemList] = useState([]);
  const styles = {
    mainBody: {
      borderRadius: "5px",
      borderColor: "green !important",
      borderWidth: "2px !important",
      border: "solid",
      padding: "2px",
      height: "90%",
      overflowY: "auto !important",
    },
    avatarStyle: {
      minWidth: "25px !important",
      minHeight: "25px !important",
      maxWidth: "25px !important",
      maxHeight: "25px !important",
      borderRadius: "8px",
    },
  };

  const filterActions = () => {
    let workon = [];
    let unassigned = [];
    if (houseKeepingActions && houseKeepingActions.length) {
      // let workitemIDList = [];
      houseKeepingActions.forEach((action) => {
        if (
          action.name.includes(REMIND_WORKITEM_STATUS.NEW) ||
          action.name.includes(REMIND_WORKITEM_STATUS.ON_HOLD)
        ) {
          workon.push(...action.payload.workitems);
        } else if (action.name.includes(REMIND_WORKITEM_STATUS.UNASSIGNED)) {
          unassigned.push(...action.payload.workitems);
        // if (action.payload?.workitems) {
        //   workitemIDList.push(...action.payload.workitems);
        }
      });
    }
    workon = workon.filter((value, index) => workon.indexOf(value) === index);
    unassigned = unassigned.filter(
      (value, index) => unassigned.indexOf(value) === index
      // setWorkitemList(
      //   workitemIDList.filter(
      //     (value, index) => workitemIDList.indexOf(value) === index
      //   )
      );
      setWorkitemList({ workon, unassigned });
    // }
  };

  useEffect(() => {
    filterActions();
  }, [houseKeepingActions]);

  return (
    <div className="workItemThreadModalBodyStyle">
      <label>The Coach's Suggestion #1 SCHEDULE TODAY</label>
      <div {...css(styles.mainBody)}>
        {/* action icon & name */}
        {/* <div className="displayFlex">
          <FontAwesomeIcon
            icon={faVacuum}
            className={
              WORKITEMS_ACTION_ICONS.find(
                (action) => action.id === "housekeeping"
              )?.color || "fix_icon_action_red_10"
            }
            style={{ marginRight: "10px" }}
          />
          <label className="fix_body1_grey3_10">{"housekeeping"}</label>
        </div>

        <div className="ThreadModalTopicStyle">
          <div style={{ padding: "15px 10px" }}> */}
            {/* Avatar, Name, Created Time */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              // className="displayFlex"
              // style={{ justifyContent: "space-between", marginBottom: "15px" }}
            >
            <img
              className="ui medium circular image"
              src={Scrumbot_button}
              alt="img"
              {...css(styles.avatarStyle)}
            />
              <div className="ThreadModalTopicMemberStyle">
                {/* <div className="displayFlex">
                  <div className="avatarStyle">
                    <Image
                      src={FIX_THECOACH_WHITE2_20} */}
                  </div>
                  <Icon name="question circle" />
                  {/* <div>
                    <div
                      style={{ marginRight: "10px" }}
                      className="fix_body1_10"
                    >
                      {"TheCoach"}
                    </div>
                    <div className="fix_body3_grey3_8">{date}</div>
                  </div>
                </div> */}
              </div>

              <div>
              <b>
                Hey, {myIdentity}.
                {/* <FontAwesomeIcon
                  icon={faEllipsisV}
                  className="fix_icon_bar_10"
                />
              </div>
            </div>
          </div> */}

          {/* Content */}
          {/* <div style={{marginLeft: "35px"}}>
            <div className="fix_title_12">
              Hey, <span className="fix_color_green">{myIdentity}</span>.
              <br />
              Good morning! Today is {date}
              <br /> */}
              <br />
              Good morning! Today is {new Date() ? WEEKDAYS[new Date().getDay()] : ""},{" "}
              {new Date().getDate()} {new Date() ? Months[new Date().getMonth()] : "0"}
              {/* {workitemList && workitemList.length > 0 ?
                <div>
                  {workitemList.length} work items need you to
                  work on them today, do you want to do it right now?
                </div>
                :
                <div>
                  No work items need you to work on them today.
                </div>
              } */}
              <br />
              Here is your schedule Today:
              </b>
            </div>
            {/* Workon Workitem */}
            <div>
              <div>
                <Icon
                  size="small"
                  name={expandStatus.workon ? "chevron down" : "chevron right"}
                  onClick={() => {
                    setExpandStatus((expandStatus) => ({
                      ...expandStatus,
                      workon: !expandStatus.workon,
                    }));
                  }}
                />
                <label style={{ color: "green" }}>
                  {workitemList.workon.length} WORK ITEMs{" "}
                </label>
                <label>need you to work on</label>
                <Icon name="play circle outline" color="green" size="large" />
            {/* Buttons */}
            {/* workitemList && workitemList.length > 0 &&
              <div className="displayFlex" style={{marginBottom: "10px"}}>
                <div
                  className="fix_border_black_2 fix_background_white fix_submenu_8"
                  style={{ cursor: "pointer", marginRight: "10px" }}
                  onClick={()=>{
                    routeToHome(workitemList);
                  }}
                >
                  Yeah, I'll do it now!
                </div>

                <div
                  className="fix_border_black_2 fix_background_white fix_submenu_8"
                  style={{ cursor: "pointer" }}
                >
                  I'll do it later
                </div>
              </div>
                */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkItemScrumbotModalView;
