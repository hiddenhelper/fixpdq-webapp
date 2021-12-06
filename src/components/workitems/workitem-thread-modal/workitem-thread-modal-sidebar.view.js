/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import WorkItemThreadModalActionItem from "./subcomponents/workitem-thread-modal-action-item";
import WorkItemThreadModalConversationItem from "./subcomponents/workitem-thread-modal-conversation-item";
import "./workitem-thread-modal-sidebar.view.less";
import { faTimes, faTasksAlt } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "glamor";

export const WorkItemThreadModalSidebarView = ({
  actionsList,
  actionsSuccess,
  actionsLoading,
  conversations,
  onSelectedConversationChanged,
  selectedConversationSidFromLeftPanel,
  setConversationIdList,
  allUsers,
  sortByTime,
  setSortByTime,
}) => {
  const [sidebarSwitch, setSidebarSwitch] = useState("conversation");
  const [componentList, setComponentList] = useState({
    conversation: [],
    history: [],
  });
  const [convIdList, setConvIdList] = useState({
    conversation: [],
    history: [],
  });

  const toggleSidebarSwitch = (name) => {
    onSelectedConversationChanged("");
    setSidebarSwitch(name);

    if (name === "conversation") {
      setConversationIdList(convIdList.conversation);
    } else {
      setConversationIdList(convIdList.history);
    }
  };
  const renderConversationTab = () => {
    let componentListForConversation = [];
    let conversationIdListForActions = [];
    let allConversationIdListForConversation = [];
    if (actionsList.length > 0) {
      actionsList.forEach((action, index) => {
        conversationIdListForActions.push(action.conversationId);
        if (!action.status.includes("CLOSED")) {
          allConversationIdListForConversation.push(action.conversationId);
          componentListForConversation.push(
            <WorkItemThreadModalActionItem
              action={action}
              onSelectedConversationChanged={onSelectedConversationChanged}
              selectedConversationSidFromLeftPanel={
                selectedConversationSidFromLeftPanel
              }
              allUsers={allUsers}
              key={`action_open_${index}`}
              dateCreated={action.date_created}
            />
          );
        }
      });
    }
    if (conversations && conversations.length > 0) {
      conversations.forEach((conversation, index) => {
        if (
          !conversationIdListForActions.includes(conversation.conversationid) &&
          (!conversation.status || conversation.status !== "CLOSED")
        ) {
          allConversationIdListForConversation.push(
            conversation.conversationid
          );
          componentListForConversation.push(
            <WorkItemThreadModalConversationItem
              conversation={conversation}
              onSelectedConversationChanged={onSelectedConversationChanged}
              selectedConversationSidFromLeftPanel={
                selectedConversationSidFromLeftPanel
              }
              allUsers={allUsers}
              key={`conversation_${index}`}
              dateCreated={conversation.date_created}
            />
          );
        }
      });
    }
    return {
      allConversationIdListForConversation,
      componentListForConversation: sortByTime
        ? componentListForConversation &&
          componentListForConversation.sort(
            (a, b) => a.props.dateCreated - b.props.dateCreated
          )
        : componentListForConversation,
    };
  };

  const renderHistoryTab = () => {
    let componentListForHistory = [];
    let allConversationIdListForHistory = [];
    if (!actionsLoading && actionsSuccess && actionsList.length > 0) {
      actionsList.forEach((action, index) => {
        if (action.status.includes("CLOSED")) {
          allConversationIdListForHistory.push(action.conversationId);
          componentListForHistory.push(
            <WorkItemThreadModalActionItem
              action={action}
              onSelectedConversationChanged={onSelectedConversationChanged}
              selectedConversationSidFromLeftPanel={
                selectedConversationSidFromLeftPanel
              }
              allUsers={allUsers}
              key={`action_closed_${index}`}
              dateCreated={action.date_created}
            />
          );
        }
      });
    }
    if (conversations && conversations.length > 0) {
      // console.log("conversations", conversations);
      conversations.forEach((conversation, index) => {
        if (
          !allConversationIdListForHistory.includes(
            conversation.conversationid
          ) &&
          conversation.status &&
          conversation.status === "CLOSED"
        ) {
          allConversationIdListForHistory.push(conversation.conversationid);
          componentListForHistory.push(
            <WorkItemThreadModalConversationItem
              conversation={conversation}
              onSelectedConversationChanged={onSelectedConversationChanged}
              selectedConversationSidFromLeftPanel={
                selectedConversationSidFromLeftPanel
              }
              allUsers={allUsers}
              key={`conversation_${index}`}
              dateCreated={conversation.date_created}
            />
          );
        }
      });
    }
    return {
      allConversationIdListForHistory,
      componentListForHistory: sortByTime
        ? componentListForHistory &&
          componentListForHistory.sort(
            (a, b) => a.props.dateCreated - b.props.dateCreated
          )
        : componentListForHistory,
    };
  };

  useEffect(() => {
    const getComponents = () => {
      const {
        allConversationIdListForConversation,
        componentListForConversation,
      } = renderConversationTab();
      const {
        allConversationIdListForHistory,
        componentListForHistory,
      } = renderHistoryTab();

      setComponentList({
        conversation: componentListForConversation,
        history: componentListForHistory,
      });

      setConvIdList({
        conversation: allConversationIdListForConversation,
        history: allConversationIdListForHistory,
      });
      if (sidebarSwitch === "conversation") {
        setConversationIdList(allConversationIdListForConversation);
      } else {
        setConversationIdList(allConversationIdListForHistory);
      }
    };
    if (actionsSuccess) {
      getComponents();
    }
  }, [
    actionsList,
    conversations,
    selectedConversationSidFromLeftPanel,
    sortByTime,
  ]);

  const styles = {
    sideBarBtn: {
      width: "49%",
      borderRadius: "8px",
      padding: "6px 15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      border: "none",
    },
    sideBarBtnSelectedStyle: {
      backgroundColor: "white",
    },

    sideBarBtnNonSelectedStyle: {
      backgroundColor: "transparent",
    },
    marginLeft5: {
      marginLeft: "5px",
    },
    toggleSwitchBar: {
      borderRadius: "8px",
      width: "100%",
      padding: "2px",
      justifyContent: "space-between",
    },
  };

  return (
    <div className="sideBarStyle fix_background_grey1">
      <div
        className="marginBottom20 displayFlex"
        style={{ justifyContent: "space-between" }}
      >
        <div>
          <FontAwesomeIcon icon={faTasksAlt} className="fix_icon_rmenu_14" />
          <span className="fix_menu_12" {...css(styles.marginLeft5)}>
            Conversations
          </span>
        </div>

        <div>
          <FontAwesomeIcon icon={faTimes} className="fix_icon_hero_24" />
        </div>
      </div>

      <div style={{ cursor: "pointer" }}>
        <span
          className="fix_submenu_8"
          onClick={() => {
            setSortByTime(!sortByTime);
          }}
        >
          {sortByTime ? "SORT BY TIME" : "SORT BY WORK ITEM"}
        </span>
      </div>

      <div
        className="displayFlex marginBottom20 fix_background_grey2"
        {...css(styles.toggleSwitchBar)}
      >
        <button
          onClick={() => {
            toggleSidebarSwitch("conversation");
          }}
          {...css(
            styles.sideBarBtn,
            sidebarSwitch === "conversation"
              ? styles.sideBarBtnSelectedStyle
              : styles.sideBarBtnNonSelectedStyle
          )}
        >
          <label className="fix_menu_12">OPEN</label>
          <label className="fix_font_color_black_12">
            {componentList?.conversation.length || 0}
          </label>
        </button>
        <button
          onClick={() => {
            toggleSidebarSwitch("history");
          }}
          {...css(
            styles.sideBarBtn,
            sidebarSwitch === "history"
              ? styles.sideBarBtnSelectedStyle
              : styles.sideBarBtnNonSelectedStyle
          )}
        >
          <label className="fix_menu_12">ARCHIVE</label>
          <label className="fix_font_color_black_12">
            {componentList?.history.length || 0}
          </label>
        </button>
      </div>
      <div className="sideBarContainerStyle">
        {sidebarSwitch === "conversation"
          ? componentList.conversation
          : componentList.history}
      </div>
    </div>
  );
};

export default WorkItemThreadModalSidebarView;
