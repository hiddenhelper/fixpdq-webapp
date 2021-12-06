import { css } from "glamor";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Grid, Image } from "semantic-ui-react";
import { useEditor } from "../../../hooks";
import {
  default_avatar,
  FIX_THECOACH_WHITE_20,
} from "../../../utils/static-images";
import { getUser } from "../../../utils/user";
import { EditorInput } from "../../shared/editor";
import {
  MAX_PARTICIPANTS_AVATAR_COUNT,
  PRIORITY_DIFFICULTY_STATUS,
  WORKITEM_STATUS,
} from "../workitems-definitions";
import { ParticipantPlus } from "./subcomponents/workitem-thread-modal-participant-plus";
import WorkItemThreadModalTopic from "./subcomponents/workitem-thread-modal-topic.view";
import "./workitem-thread-modal.view.less";
import editorUtils from "../../../utils/editor";
import { truncateString } from "../../../utils/truncate-string";
import { JSONObjectValidator } from "../../../utils/validator";
import { OwnerAvatar as OwnerDropdown } from "../workitems-list/subcomponents/owner-avatar";
import { StatusAttribute } from "../workitems-list/subcomponents/status-attribute";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarExclamation,
  faFlag,
  faTachometerAltFast,
  faUserCrown,
  faUserEdit,
  faUsers,
  faPlus,
  faPaperPlane,
  faTimesCircle,
  faCaretDown,
} from "@fortawesome/pro-solid-svg-icons";
import moment from "moment";

export const WorkItemThreadModalView = ({
  conversations,
  createNewConversation,
  replyMessage,
  allUsers,
  swarmUsers,
  workitem,
  sortByTime,
  onChangeLevel,
  onChangeOwner,
  onChangeStatus,
}) => {
  const styles = {
    avatarStyle: {
      width: "25px !important",
      height: "25px !important",
      borderRadius: "8px",
    },
    marginRightMinus5: {
      marginRight: "-5px !important",
    },
    splitDiv: {
      width: "2px",
      height: "35px",
      backgroundColor: "rgb(244,244,244)",
    },
    userDiv: {
      ":focus": {
        backgroundColor: "green",
      },
    },
    marginBottom5: {
      marginBottom: "5px",
    },
    marginRight10: {
      marginRight: "10px",
    },
    statusBox: {
      padding: "5px 7px 5px 5px",
      width: "80px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "8px",
    },
    padding2: {
      padding: "2px",
    },
    plusIconStyle: {
      width: "15px !important",
      height: "15px !important",
      borderRadius: "3px",
    },
    cardViewTypeBtn: {
      borderRadius: "8px",
      padding: "3px 10px",
      margin: "0px 5px 0px 0px",
      cursor: "pointer",
      display: "-webkit-inline-box",
    },
    collapseIcon: {
      borderRadius: "8px",
      width: "20px",
      height: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    backgroundColorBlack: {
      backgroundColor: "#4A4A4A",
      color: "white",
    },
    backgroundColorNone: {
      backgroundColor: "transparent",
    },
  };

  const { state: editorInputState, handlers: editorInputHandlers } = useEditor({
    workitemid: workitem?.workitemid,
    users: allUsers,
  });
  const { content: newMessage } = editorInputState;
  const [collapseWorkitemView, setCollapseWorkitemView] = useState(false);
  const [inputBoxStatus, setInputBoxStatus] = useState([]);

  useEffect(() => {
    InputBoxStatusChanged("new", { isEmpty: isRichTextEditorEmpty() });
  }, [newMessage]);

  const isRichTextEditorEmpty = () => {
    if (newMessage) {
      const message = editorInputHandlers.serializeContent();
      const json = JSONObjectValidator(message);
      let finalText;
      if (json) {
        finalText = editorUtils.getText(json);
      } else {
        finalText = message;
      }
      if (
        finalText &&
        finalText.length > 0 &&
        !(finalText.includes("\n") && finalText.length === 1)
      ) {
        return false;
      }
      return true;
    }
    return true;
  };

  const sendMessageForConvHandler = () => {
    if (!isRichTextEditorEmpty()) {
      editorInputHandlers.sendMessage({
        handler: () => {
          createNewConversation(
            editorInputHandlers.serializeContent(),
            editorInputHandlers.getMentions()
          );
        },
      });
    }
  };

  const displayParticipants = () => {
    const participants = swarmUsers.filter(
      (user) =>
        user.userid !== workitem?.creatorid && user.userid !== workitem?.ownerid
    );
    return (
      <div className="displayFlex marginLR10">
        {participants.map((user, index) => {
          if (index === MAX_PARTICIPANTS_AVATAR_COUNT) {
            return (
              <ParticipantPlus
                participants={participants}
                allUsers={allUsers}
              />
            );
          }
          if (index > MAX_PARTICIPANTS_AVATAR_COUNT) {
            return <></>;
          }
          const avatar =
            getUser({ userid: user.userid, allUsers }).getPropertyValue(
              "picture"
            ) || default_avatar;
          return (
            <Image
              src={avatar}
              alt="img"
              {...css(styles.avatarStyle, styles.marginRight10)}
            />
          );
        })}
      </div>
    );
  };

  const displayConversations = () => {
    if (conversations) {
      const convList = sortByTime
        ? conversations.sort((a, b) => a.date_created - b.date_created)
        : conversations;
      return convList.map((conversation, index) => {
        return (
          <WorkItemThreadModalTopic
            workitemid={workitem?.workitemid}
            conversation={conversation}
            replyMessage={replyMessage}
            allUsers={allUsers}
            key={index}
            inputBoxStatus={inputBoxStatus}
            InputBoxStatusChanged={InputBoxStatusChanged}
          />
        );
      });
    }
  };

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
                workitemid: workitem.workitemid,
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
              workitemid: workitem.workitemid,
              title: type.toLowerCase(),
              value: s.name ? s.name : value,
            });
          }}
        />
      );
    });
  };

  const workItemDetails = () => {
    const creatorAvatar =
      getUser({
        userid: workitem.creatorid,
        allUsers,
      }).getPropertyValue("picture") || default_avatar;

    const ownerAvatar =
      getUser({
        userid: workitem.ownerid,
        allUsers,
      }).getPropertyValue("picture") || default_avatar;

    return (
      <div>
        <div className="workItemDetailsBox fix_background_grey0 marginBottom10">
          <div
            className="displayFlex"
            style={{ justifyContent: "space-between" }}
          >
            <div className="fix_submenu_grey2_8" {...css(styles.marginBottom5)}>
              {workitem.swarm_name}
            </div>
            <div
              onClick={() => {
                setCollapseWorkitemView(!collapseWorkitemView);
              }}
              {...css(
                styles.collapseIcon,
                collapseWorkitemView
                  ? styles.backgroundColorBlack
                  : styles.backgroundColorNone
              )}
            >
              <FontAwesomeIcon icon={faCaretDown} />
            </div>
          </div>
          <div className="fix_title_12 marginBottom10">{workitem.name}</div>
          <div className="fix_paragraph_body_12 marginBottom10">
            {collapseWorkitemView && workitem.description
              ? truncateString(
                  editorUtils.getTextFromStringForCharCount(
                    workitem.description
                  ),
                  150
                )
              : ""}
          </div>
          <div className="displayFlex">
            {/* work item status */}
            <StatusAttribute item={workitem} onChangeStatus={onChangeStatus}/>

            {/* work item due date */}
            <div className="displayFlex" {...css(styles.marginRight10)}>
              <div style={{ width: "15px" }}>
                <FontAwesomeIcon
                  icon={faCalendarExclamation}
                  className="fix_icon_bar_10"
                />
              </div>
              <label style={{ marginLeft: "5px" }} className="fix_body1_10">
                {workitem.end_time
                  ? moment(new Date(workitem.end_time)).format("D MMM YYYY")
                  : " "}
              </label>
            </div>

            {/* work item priority */}
            <div {...css(styles.marginRight10)}>
              {show_Priority_Difficulty("priority", workitem.priority)}
            </div>

            {/* work item difficulty */}
            <div {...css(styles.marginRight10)}>
              {show_Priority_Difficulty("difficulty", workitem.difficulty)}
            </div>
          </div>
        </div>
        {collapseWorkitemView && (
          <div className="workItemDetailsBox fix_background_grey0 marginBottom10">
            <Grid>
              <Grid.Column computer={4}>
                <div className="displayFlex" {...css(styles.marginBottom5)}>
                  <FontAwesomeIcon
                    icon={faUserCrown}
                    {...css(styles.marginRight10)}
                  />
                  <span className="fix_submenu_8">Owner</span>
                </div>
                <OwnerDropdown
                  workitemid={workitem.workitemid}
                  avatar={ownerAvatar ? ownerAvatar : default_avatar}
                  currentOwner={workitem.ownerid}
                  allUsers={allUsers}
                  onChangeOwner={onChangeOwner}
                  swarmid={workitem.swarm}
                />
              </Grid.Column>

              <Grid.Column computer={4}>
                <div className="displayFlex" {...css(styles.marginBottom5)}>
                  <FontAwesomeIcon
                    icon={faUserEdit}
                    {...css(styles.marginRight10)}
                  />
                  <span className="fix_submenu_8">Creator</span>
                </div>
                <Image
                  src={creatorAvatar}
                  alt="img"
                  {...css(styles.avatarStyle)}
                />
              </Grid.Column>

              <Grid.Column computer={7}>
                <div className="displayFlex" {...css(styles.marginBottom5)}>
                  <FontAwesomeIcon
                    icon={faUsers}
                    {...css(styles.marginRight10)}
                  />
                  <span className="fix_submenu_8">Interested party</span>
                </div>
                {displayParticipants()}
              </Grid.Column>

              <Grid.Column
                computer={1}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  marginBottom: "5px",
                }}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="fix_color_black fix_sidebar_btn_hover fix_hover_white"
                  {...css(styles.padding2, styles.plusIconStyle)}
                />
              </Grid.Column>
            </Grid>
          </div>
        )}
      </div>
    );
  };
  const InputBoxStatusChanged = (id, data) => {
    let temp = inputBoxStatus;
    if (!inputBoxStatus.find((i) => i.id === id)) {
      temp.push({ id: id, ...data });
    } else {
      const index = temp.findIndex((t) => t.id === id);
      temp[index] = { ...temp[index], ...data };
    }

    if (data.open) {
      let result = [];
      temp.forEach((t) => {
        if (t.id !== id && (t.isEmpty === undefined || t.isEmpty)) {
          result.push({ ...t, open: false });
        } else {
          result.push(t);
        }
      });
      setInputBoxStatus(JSON.parse(JSON.stringify(result)));
    } else {
      setInputBoxStatus(JSON.parse(JSON.stringify(temp)));
    }
  };

  const displayInputBox = () => {
    return (
      <>
        {(!inputBoxStatus ||
          !inputBoxStatus.find((i) => i.id === "new" && i.open === true)) && (
          <div className="displayFlex" style={{ justifyContent: "flex-end" }}>
            <div
              {...css(styles.cardViewTypeBtn)}
              className="fix_background_black"
            >
              <Image src={FIX_THECOACH_WHITE_20} alt="img" />
              <span className="fix_submenu_8" style={{ color: "white" }}>
                ASK THECOACH QUESTION
              </span>
            </div>
            <div
              {...css(styles.cardViewTypeBtn)}
              className="fix_background_yellow_shadow"
              onClick={() => {
                InputBoxStatusChanged("new", { open: true });
              }}
            >
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="fix_body1_10"
                style={{ marginRight: "5px" }}
              />
              <span className="fix_submenu_8">New Conversation</span>
            </div>
          </div>
        )}
        {inputBoxStatus &&
          inputBoxStatus.find((i) => i.id === "new" && i.open === true) && (
            <div>
              <EditorInput
                state={editorInputState}
                handlers={editorInputHandlers}
                placeholder={"New conversation here"}
              />

              <div
                className="displayFlex"
                style={{ justifyContent: "flex-end", marginTop: "10px" }}
              >
                <div
                  data-cy="workitem-thread-modal-view-button-52649"
                  onClick={() => {
                    InputBoxStatusChanged("new", { open: false });
                  }}
                  className="fix_border_black_2 fix_background_white fix_submenu_8"
                  style={{ cursor: "pointer", marginRight: "10px" }}
                >
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    style={{ marginRight: "5px" }}
                  />
                  Cancel
                </div>
                <div
                  data-cy="workitem-thread-modal-view-button-52648"
                  onClick={sendMessageForConvHandler}
                  className={
                    !isRichTextEditorEmpty()
                      ? "fix_border_yellow_2 fix_background_yellow2 fix_submenu_8"
                      : "fix_background_grey2 fix_border_grey_2 fix_submenu_white_8"
                  }
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    style={{ marginRight: "5px" }}
                  />
                  Send
                </div>
              </div>
            </div>
          )}
      </>
    );
  };

  return (
    <div className="workItemThreadModalBodyStyle">
      {/* Work item details*/}
      {workitem && workItemDetails()}
      {/* Conversation Section */}
      <div className="ThreadModalConversationSection">
        <div style={{flexDirection: "column-reverse"}}>
          {displayConversations()}
        </div>
      </div>

      {/* Footer */}
      <div className="paddingRight40 ThreadModalFooterStyle">
        {displayInputBox()}
      </div>
    </div>
  );
};

export default WorkItemThreadModalView;
