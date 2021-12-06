import { css } from "glamor";
import React from "react";
import { Dropdown } from "semantic-ui-react";
import { default_avatar } from "../../../utils/static-images";
import { pickProperty } from "../../../utils/user";
import "./member-item.less";
import { MEMBER_ROLE_PRIORITY } from "./member-role-priority";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/pro-solid-svg-icons";

export const MemberItem = ({ user, myRole, removeUser, changeUserRole }) => {
  const roleType = [
    { key: 1, text: "Owner", value: "Owner" },
    { key: 2, text: "Admin", value: "Admin" },
    { key: 3, text: "Member", value: "Member" },
    { key: 4, text: "Invited", value: "Invited" },
  ];

  const styles = {
    avatarStyle: {
      minWidth: "25px !important",
      minHeight: "25px !important",
      maxWidth: "25px !important",
      maxHeight: "25px !important",
      border: "2px solid",
      borderColor: "white",
      borderRadius: "50%",
    },
    disableBlock: {
      pointerEvents: "none",
    },
  };

  return (
    <>
      {user && (
        <div
          className="blockStyle fix_background_grey1"
          {...css(
            MEMBER_ROLE_PRIORITY.find((m) => m.role === myRole).priority < 4 &&
              MEMBER_ROLE_PRIORITY.find((m) => m.role === myRole).priority <=
                MEMBER_ROLE_PRIORITY.find((m) => m.role === user.Role)
                  .priority &&
              styles.disableBlock
          )}
        >
          {/* Member Avatar, Name, Role, Position */}
          <div className="mainBlockStyle">
            <div className="avatarStyle">
              <img
                className="ui medium circular image"
                src={pickProperty(user, "picture") || default_avatar}
                alt="img"
                {...css(styles.avatarStyle)}
              />
            </div>

            <div className="fullWidth">
              <div className="displayFlex">
                <div className="fix_title_12" style={{marginRight: "10px"}}>
                  {pickProperty(user, "email")}
                </div>
                <div>
                  {user.Role !== "Creator" && (
                    <Dropdown
                      options={roleType}
                      selection
                      className="memberItemClass"
                      onChange={(event, data) => {
                        if (
                          MEMBER_ROLE_PRIORITY.find((m) => m.role === myRole)
                            .priority >= 4
                        ) {
                          // Creator/Owner
                          changeUserRole(user.Username, data.value);
                        } else if (
                          MEMBER_ROLE_PRIORITY.find((m) => m.role === myRole)
                            .priority >
                          MEMBER_ROLE_PRIORITY.find(
                            (m) => m.role === data.value
                          ).priority
                        ) {
                          // Admin/Member/Invited
                          changeUserRole(user.Username, data.value);
                        } else {
                          data.value = user.Role;
                        }
                      }}
                      value={user.Role}
                    />
                  )}
                </div>
              </div>
              {/* <div className="subTitleStyle">manager</div> */}
            </div>
          </div>

          {/* Member Remove Button */}
          <div className="iconStyle">
            <FontAwesomeIcon
              icon={faTimesCircle}
              className={"fix_icon_lmenu_grey3_14"}
              onClick={() => {
                if (user.Role !== "Creator") {
                  removeUser(user.Username);
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MemberItem;
