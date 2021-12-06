import { css } from "glamor";
import React from "react";
import { default_avatar } from "../../../../utils/static-images";
import { getUser } from "../../../../utils/user";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons";
import { Image } from "semantic-ui-react";

const styles = {
  actionBtnStyle: {
    width: "32px !important",
    height: "32px !important",
    display: "flex !important",
    alignItems: "center !important",
    justifyContent: "center !important",
    borderRadius: "8px !important",
  },
  avatarStyle: {
    minWidth: "25px !important",
    minHeight: "25px !important",
    maxWidth: "25px !important",
    maxHeight: "25px !important",
    borderRadius: "8px",
  },
};

export const WorkItemThreadModalTopicContentContainer = ({
  message,
  allUsers,
  children,
}) => {
  const topicOwner = {
    avatar: getUser({
      userid: message.author,
      allUsers,
    }).getPropertyValue("picture"),
    identity: getUser({
      userid: message.author,
      allUsers,
    }).getUserIdentity(),
  };

  return (
    <div style={{ padding: "15px 10px" }}>
      {/* Avatar, Name, Created Time */}
      <div
        className="displayFlex"
        style={{ justifyContent: "space-between", marginBottom: "15px" }}
      >
        <div className="ThreadModalTopicMemberStyle">
          <div className="displayFlex">
            <div className="avatarStyle">
              <Image
                src={topicOwner.avatar ? topicOwner.avatar : default_avatar}
                alt="img"
                {...css(styles.avatarStyle)}
              />
            </div>

            <div>
              <div style={{ marginRight: "10px" }} className="fix_body1_10">
                {topicOwner.identity ? topicOwner.identity : message.author}
              </div>
              <div className="fix_body3_grey3_8">
                {message.dateCreated?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div>
          <FontAwesomeIcon icon={faEllipsisV} className="fix_icon_bar_10" />
        </div>
      </div>

      {/* Content */}
      <div className="ThreadModalTopicContentStyle">
        <div>{children}</div>
      </div>
    </div>
  );
};
