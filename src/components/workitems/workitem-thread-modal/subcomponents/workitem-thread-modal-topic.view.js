/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useEditor } from "../../../../hooks";
import { JSONObjectValidator } from "../../../../utils/validator";
import { EditorInput, EditorView } from "../../../shared/editor";
import WorkItemThreadModalTopicContent from "./workitem-thread-modal-topic-content";
import { WorkItemThreadModalTopicContentContainer } from "./workitem-thread-modal-topic-content-container";
import "./workitem-thread-modal-topic.view.less";
import { ACTION, WORKITEMS_ACTION_ICONS } from "../../workitems-definitions";
import editorUtils from "../../../../utils/editor";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignature,
  faVacuum,
  faKeynote,
  faHandshakeAlt,
  faQuestion,
  faReply,
  faTimesCircle,
  faPaperPlane,
} from "@fortawesome/pro-solid-svg-icons";

const EditorViewWrapped = ({ message, allUsers }) => {
  return (
    <WorkItemThreadModalTopicContentContainer
      message={message}
      allUsers={allUsers}
    >
      <EditorView content={message.body} />
    </WorkItemThreadModalTopicContentContainer>
  );
};

const EditorOrText = ({ message, allUsers }) => {
  const isJson = JSONObjectValidator(message.body);
  return (
    <>
      {isJson ? (
        <EditorViewWrapped message={message} allUsers={allUsers} />
      ) : (
        <WorkItemThreadModalTopicContent
          message={message}
          allUsers={allUsers}
        />
      )}
    </>
  );
};

export const WorkItemThreadModalTopic = ({
  workitemid,
  conversation,
  replyMessage,
  allUsers,
  inputBoxStatus,
  InputBoxStatusChanged,
}) => {
  const { state: editorInputState, handlers: editorInputHandlers } = useEditor({
    workitemid,
    users: allUsers,
    hivemind: conversation.hivemind,
    inputContent: null,
  });
  const { content: newMessage } = editorInputState;

  useEffect(() => {
    InputBoxStatusChanged(conversation.conversationid, {
      isEmpty: isRichTextEditorEmpty(),
    });
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
      if (finalText && finalText.length > 0 && !(finalText.includes("\n") && finalText.length === 1)) {
        return false;
      }
      return true;
    }
    return true;
  };

  const sendMessageHandler = () => {
    if (!isRichTextEditorEmpty()) {
      editorInputHandlers.sendMessage({
        handler: () => {
          replyMessage(
            conversation.conversationid,
            editorInputHandlers.serializeContent(),
            editorInputHandlers.getMentions()
          );
        },
      });
    }
  };

  const displayReplyBox = () => {
    return (
      <>
        {(!inputBoxStatus ||
          !inputBoxStatus.find(
            (i) => i.id === conversation.conversationid && i.open === true
          )) && (
          <div
            onClick={() => {
              InputBoxStatusChanged(conversation.conversationid, {
                open: true,
              });
            }}
            className="fix_border_black_2 fix_background_white fix_submenu_8"
            style={{
              cursor: "pointer",
              marginRight: "10px",
              marginLeft: "45px",
              display: "inline-block",
              marginBottom: "5px",
            }}
          >
            <FontAwesomeIcon icon={faReply} style={{ marginRight: "5px" }} />
            Reply
          </div>
        )}

        {inputBoxStatus &&
          inputBoxStatus.find(
            (i) => i.id === conversation.conversationid && i.open === true
          ) && (
            <div>
              <EditorInput
                state={editorInputState}
                handlers={editorInputHandlers}
                placeholder={"Reply here"}
              />
              <div
                className="displayFlex"
                style={{
                  justifyContent: "flex-end",
                  padding: "15px 0px",
                }}
              >
                <div
                  onClick={() => {
                    InputBoxStatusChanged(conversation.conversationid, {
                      open: false,
                    });
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
                  onClick={sendMessageHandler}
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
    <div style={{ marginBottom: "15px" }}>
      <div className="displayFlex">
        <FontAwesomeIcon
          icon={generateActionIcon(conversation.actionName)}
          className={
            WORKITEMS_ACTION_ICONS.find(
              (action) => action.id === conversation.actionName
            )?.color || "fix_icon_action_red_10"
          }
          style={{ marginRight: "10px" }}
        />
        <label className="fix_body1_grey3_10">{conversation.topicName}</label>
      </div>
      <div className="ThreadModalTopicStyle">
        {conversation.messages &&
          conversation.messages.map((message, index) => {
            const result = JSONObjectValidator(message);
            return (
              result && (
                <div>
                  <EditorOrText
                    key={index}
                    message={result}
                    allUsers={allUsers}
                  />
                  {conversation.messages.length - 1 > index && (
                    <div
                      style={{
                        width: "100%",
                        height: "2px",
                        backgroundColor: "rgb(242, 242, 242)",
                      }}
                    ></div>
                  )}
                  {conversation.messages.length - 1 === index &&
                    displayReplyBox()}
                </div>
              )
            );
          })}
      </div>
    </div>
  );
};

const generateActionIcon = (id) => {
  switch (id) {
    case ACTION.ASSIGN:
      return faSignature;
    case ACTION.REQUEST_REVIEW:
      return faKeynote;
    case "collaboration":
      return faHandshakeAlt;
    case "housekeeping":
      return faVacuum;
    case "question":
      return faQuestion;
    default:
      return faQuestion;
      break;
  }
};

export default WorkItemThreadModalTopic;
