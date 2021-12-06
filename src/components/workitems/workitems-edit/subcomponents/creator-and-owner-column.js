import { css } from "glamor";
import React, { useState } from "react";
import { Dropdown, Form } from "semantic-ui-react";
import { default_avatar } from "../../../../utils/static-images";
import { pickProperty, generatePersonSelectorStyle } from "../../../../utils/user";
import SearchBarMember from "../../../shared/subcomponents/search-bar-member.view";
import "../workitems-edit.less";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/pro-solid-svg-icons";

export const CreatorAndOwnerColumn = ({ form, allUsers, playbookid }) => {
  const styles = {
    field: {
      backgroundColor: "#EFEFEF",
      borderRadius: "8px",
      whiteSpace: "nowrap",
    },
  };
  const { workitemsEditForm, onChange } = form;
  const [partyUsers, setPartyUsers] = useState(workitemsEditForm.partyMembers);

  const usersList = allUsers.map((element) => {
    return {
      key: element.Username,
      value: element.Username,
      text:  generatePersonSelectorStyle(element),
      image: {
        avatar: true,
        src: pickProperty(element, "picture") || default_avatar,
      },
    };
  }).sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));

  const addUser = (data) => {
    // return if new member is already added to
    if (partyUsers && partyUsers.includes(data.Username)) {
      return;
    }
    setPartyUsers((partyUsers) => [...partyUsers, data.Username]);
    workitemsEditForm.partyMembers.push(data.Username);
  };

  const removeUser = (userid) => {
    const filterUsers = partyUsers.filter((s) => s !== userid);
    setPartyUsers(filterUsers);
    workitemsEditForm.partyMembers = filterUsers;
  };

  return (
    <Form>
      <div className={"workitem-edit-column"}>
        <Form.Field>
          <div className="alignSpaceBetween" style={{ alignItems: "center" }}>
            <div className="fix_body2_10">
              Creator <span className="fix_color_magenta">*</span>
            </div>
            <div className="fix_title_grey2_12">
              The one who created the work item 1/1
            </div>
          </div>
          <Dropdown
            style={styles.field}
            placeholder="Select Creator"
            fluid
            required
            name={"creator"}
            onChange={onChange}
            value={workitemsEditForm.creator}
            search
            selection
            options={usersList}
            clearable
            disabled
          />
        </Form.Field>
        <Form.Field>
          <div className="alignSpaceBetween" style={{ alignItems: "center" }}>
            <div className="fix_body2_10">
              Owner <span className="fix_color_magenta">*</span>
            </div>
            <div className="fix_title_grey2_12">
              The one who responded to the work item 1/1
            </div>
          </div>
          <Dropdown
            style={styles.field}
            placeholder="Select Owner"
            fluid
            name={"owner"}
            onChange={onChange}
            value={workitemsEditForm.owner}
            search
            disabled={playbookid}
            required
            selection
            options={usersList}
            clearable
          />
        </Form.Field>
        <Form.Field>
          <div>
            <div className="alignSpaceBetween">
              <div className="fix_body2_10">Interested party</div>
              <div className="fix_title_grey2_12">
                {(partyUsers && partyUsers.length) || 0}
              </div>
            </div>
            <SearchBarMember
              addUser={addUser}
              allUsers={allUsers}
              playbookid={playbookid}
            />
            <div
              style={{
                minHeight: "200px",
                maxHeight: "200px",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {partyUsers &&
                partyUsers.map((userid) => {
                  const user = allUsers.find((s) => s.Username === userid);

                  if (user) {
                    return <PartyMember user={user} removeUser={removeUser} />;
                  }
                })}
            </div>
          </div>
        </Form.Field>
      </div>
    </Form>
  );
};

export const PartyMember = ({ user, removeUser }) => {
  const styles = {
    avatarStyle: {
      minWidth: "25px !important",
      minHeight: "25px !important",
      maxWidth: "25px !important",
      maxHeight: "25px !important",
    },
  };
  return (
    <>
      {user && (
        <div className="blockStyle fix_background_grey1">
          {/* Member Avatar, Name, Role, Position */}
          <div className="mainBlockStyle">
            <div className="avatarStyle">
              <img
                className="fix_border_white_2_circle"
                src={pickProperty(user, "picture") || default_avatar}
                alt="img"
                {...css(styles.avatarStyle)}
              />
            </div>

            <div className="fullWidth">
              <div className="displayFlex">
                <div style={{ marginRight: "10px" }} className="fix_title_12">
                  {pickProperty(user, "email")}
                </div>
              </div>
              <div className="fix_body2_grey3_10">manager</div>
            </div>
          </div>

          {/* Member Remove Button */}
          <div className="iconStyle">
            <FontAwesomeIcon
              icon={faTimesCircle}
              className={"fix_icon_lmenu_grey3_14"}
              style={{ marginRight: "5px" }}
              onClick={() => {
                removeUser(user.Username);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
