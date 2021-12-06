/* eslint-disable react-hooks/exhaustive-deps */
import { faHandHeart, faUsersClass } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "glamor";
import React, { useContext, useEffect, useState } from "react";
import { Card, Icon, Segment, Sidebar } from "semantic-ui-react";
import { useConversations, usePeopleCard } from "../../../hooks";
import {
  CoachModalContext,
  WorkitemsCardFilterContext,
} from "../../../store/context";
import UserContext from "../../user/context";
import WorkItemThreadModal from "../workitem-thread-modal/workitem-thread-modal";
import { DUE_DATE } from "../workitems-definitions";
import CoachCardItem from "./coach-card.view";
import PeopleCardItem from "./people-card.view";
import WorkitemCardFilter from "./workitems-card-filter";

export const PeopleCard = ({
  currentSwarm,
  selectedSwarmUsers,
  allUsers,
  workitemsFromCurrentSwarm,
  actions,
  actionsSuccess,
  conversations,
  conversationsSuccess,
  getWorkitems,
}) => {
  const context = useContext(UserContext);
  const { openConversations } = useConversations();

  const [viewType, setViewType] = useState("WhoNeedsMyHelp");

  const [threadVisible, setThreadVisible] = useState("init");
  const [threadProps, setThreadProps] = useState(null);
  const [openFilterBar, setOpenFilterBar] = useState(false);

  const { filter: filterValues } = useContext(WorkitemsCardFilterContext);
  const {
    whoNeedsMyHelp: wnmh,
    whoNeedsToHelpMe: wnthm,
    getPeopleCardsByViewType,
    processRulesCompleted,
  } = usePeopleCard({
    actions,
    conversations,
    selectedSwarmUsers,
  });

  const [whoNeedsMyHelp, setWhoNeedsMyHelp] = useState([]);
  const [whoNeedsToHelpMe, setWhoNeedsToHelpMe] = useState([]);

  const { openCoachModal, setOpenCoachModal } = useContext(CoachModalContext);

  useEffect(() => {
    if (actionsSuccess && conversationsSuccess) {
      setWhoNeedsMyHelp(wnmh);
      setWhoNeedsToHelpMe(wnthm);
    }
  }, [
    wnmh,
    wnthm,
    conversationsSuccess,
    actionsSuccess,
    processRulesCompleted,
  ]);

  useEffect(() => {
    const getData = async () => {
      if (
        selectedSwarmUsers.length > 0 &&
        workitemsFromCurrentSwarm &&
        workitemsFromCurrentSwarm.length > 0 &&
        actionsSuccess &&
        conversationsSuccess
      ) {
        getPeopleCardsByViewType();
      }
    };
    getData();
  }, [selectedSwarmUsers, actions, conversations]);

  useEffect(() => {
    if (currentSwarm) {
      setThreadProps(null);
      setThreadVisible("init");
    }
  }, [currentSwarm]);

  useEffect(() => {
    if (threadVisible === "closed") {
      getWorkitems();
    }
  }, [threadVisible]);

  useEffect(() => {
    if (openCoachModal) {
      openThreadModal(null, null);
    }
  }, [openCoachModal]);

  const displayPeopleCards = () => {
    if (viewType === "WhoNeedsMyHelp") {
      return whoNeedsMyHelp.map((card, index) => {
        const { filtered_Actions, filtered_Conversations } = filterFunc(card);
        if (filtered_Actions.length > 0 || filtered_Conversations.length > 0) {
          return (
            <PeopleCardItem
              swarmUser={card.swarmUser}
              conversations={filtered_Conversations}
              actions={filtered_Actions}
              allUsers={allUsers}
              openThreadModal={openThreadModal}
              workitemsFromCurrentSwarm={workitemsFromCurrentSwarm}
              viewType={viewType}
              key={`PeopleCard_WhoNeedsMyHelp_${index}`}
            />
          );
        }
        return <></>;
      });
    }
    if (viewType === "WhoNeedsToHelpMe") {
      return whoNeedsToHelpMe.map((card, index) => {
        const { filtered_Actions, filtered_Conversations } = filterFunc(card);
        if (filtered_Actions.length > 0 || filtered_Conversations.length > 0) {
          return (
            <PeopleCardItem
              swarmUser={card.swarmUser}
              conversations={filtered_Conversations}
              actions={filtered_Actions}
              allUsers={allUsers}
              openThreadModal={openThreadModal}
              workitemsFromCurrentSwarm={workitemsFromCurrentSwarm}
              key={`PeopleCard_WhoNeedsToHelpMe_${index}`}
            />
          );
        }
        return <></>;
      });
    }
  };

  const filterFunc = ({ conversations, actions }) => {
    let filtered_Actions = [];
    let filtered_Conversations = [];
    if (filterValues) {
      // filter by action type
      filtered_Actions = actions.filter((action) =>
        filterValues.viewActions.includes(action.actionType)
      );
      filtered_Conversations = filterValues.viewActions.includes("question")
        ? conversations
        : [];

      // filter by work item priority & due date
      let filteredWorkitems = workitemsFromCurrentSwarm.filter(
        (workitem) =>
          filterValues.priority?.includes(workitem.priority) &&
          validateWorkitemByDueDate(workitem)
      );
      filtered_Actions = filtered_Actions.filter((action) =>
        filteredWorkitems.find((w) => w.workitemid === action.workitemid)
      );
      filtered_Conversations = filtered_Conversations.filter((conversation) =>
        filteredWorkitems.find((w) => w.workitemid === conversation.workitemId)
      );
    }
    return {
      filtered_Actions,
      filtered_Conversations,
    };
  };

  const validateWorkitemByDueDate = (workItem) => {
    if (
      filterValues.dueDate &&
      filterValues.dueDate.length > 0 &&
      workItem.end_time
    ) {
      const now = new Date();
      const today_0 =
        now.getTime() -
        now.getHours() * 60 * 60 * 1000 -
        now.getMinutes() * 60 * 1000 -
        now.getSeconds() * 1000;
      let result;
      if (workItem.end_time < now.getTime()) {
        result = DUE_DATE[0]; //Late
      } else if (workItem.end_time < today_0 + 24 * 60 * 60 * 1000) {
        result = DUE_DATE[1]; // Today
      } else if (workItem.end_time < today_0 + 2 * 24 * 60 * 60 * 1000) {
        result = DUE_DATE[2]; //Tomorrow
      } else if (workItem.end_time < today_0 + 7 * 24 * 60 * 60 * 1000) {
        result = DUE_DATE[3]; // 1 week
      } else if (workItem.end_time < today_0 + 14 * 24 * 60 * 60 * 1000) {
        result = DUE_DATE[4]; // 2 weeks
      } else {
        result = DUE_DATE[5]; // 2 weeks+
      }
      if (!filterValues.dueDate.includes(result)) {
        return false;
      }
    }
    return true;
  };

  const openThreadModal = async (workitemId, conversationId) => {
    openConversations({
      wid: workitemId,
      userid: context.user.username,
      onOpen: () => {
        setThreadProps({ workitemId, conversationId });
        setThreadVisible("open");
      },
    });
  };

  const closeConversationModal = () => {
    setThreadVisible("closed");
    setOpenCoachModal(false);
  };

  const setSelectedConversationId = (convid) => {
    if (threadProps) {
      setThreadProps((threadProps) => ({...threadProps, conversationId: convid}));
    }
  }

  return (
    <>
      <Sidebar.Pushable {...css(styles.sidebarPushableSize)}>
        <Sidebar
          animation="overlay"
          icon="labeled"
          direction="right"
          inverted
          vertical
          visible={threadVisible === "open"}
          onHide={() => closeConversationModal()}
          {...css(styles.sidebarSize)}
        >
          {/* conversation modal */}
          {threadProps && (
            <WorkItemThreadModal
              selectedWorkitemId={threadProps.workitemId}
              selectedConversationId={threadProps.conversationId}
              setSelectedConversationId={setSelectedConversationId}
              closeConversationModal={closeConversationModal}
            />
          )}
        </Sidebar>
        <Sidebar.Pusher {...css(styles.sidebarPusherSize)}>
          <Segment basic>
            {viewTypeSelector({
              viewType,
              setViewType,
              whoNeedsMyHelp,
              whoNeedsToHelpMe,
              openFilterBar,
              setOpenFilterBar,
            })}

            {openFilterBar ? (
              <WorkitemCardFilter
                workitems={workitemsFromCurrentSwarm}
                allUsers={allUsers}
                type="people"
                cards={
                  viewType === "WhoNeedsMyHelp"
                    ? whoNeedsMyHelp
                    : whoNeedsToHelpMe
                }
              />
            ) : (
              <></>
            )}

            <Card.Group itemsPerRow={6}>
              <CoachCardItem
                currentSwarm={currentSwarm}
                openThreadModal={openThreadModal}
                viewType={viewType}
                key={`CoachCard`}
              />
              {displayPeopleCards()}
            </Card.Group>
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </>
  );
};

const viewTypeSelector = ({
  viewType,
  setViewType,
  openFilterBar,
  whoNeedsMyHelp,
  whoNeedsToHelpMe,
  setOpenFilterBar,
}) => {
  return (
    <div {...css(styles.viewTypeFilterBar)}>
      <div style={{ display: "flex" }}>
        {/* Who Needs My Help */}
        <div
          {...css(styles.viewTypeBtn)}
          className={
            viewType === "WhoNeedsMyHelp"
              ? "fix_background_black_shadow"
              : "fix_background_grey_shadow"
          }
          onClick={() => {
            setViewType("WhoNeedsMyHelp");
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <FontAwesomeIcon
              icon={faUsersClass}
              className={
                viewType === "WhoNeedsMyHelp"
                  ? "fix_icon_hero_white_24"
                  : "fix_icon_hero_24"
              }
            />
            <span
              className={
                viewType === "WhoNeedsMyHelp"
                  ? "fix_hero_white_32"
                  : "fix_hero_32"
              }
            >
              {whoNeedsMyHelp.length}
            </span>
          </div>
          <div
            className={
              viewType === "WhoNeedsMyHelp"
                ? "fix_menu_white_12"
                : "fix_menu_12"
            }
          >
            WHO NEEDS MY HELP
          </div>
        </div>

        {/* Who Needs To Help Me */}
        <div
          {...css(styles.viewTypeBtn)}
          className={
            viewType === "WhoNeedsToHelpMe"
              ? "fix_background_black_shadow"
              : "fix_background_grey_shadow"
          }
          onClick={() => {
            setViewType("WhoNeedsToHelpMe");
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <FontAwesomeIcon
              icon={faHandHeart}
              className={
                viewType === "WhoNeedsToHelpMe"
                  ? "fix_icon_hero_white_24"
                  : "fix_icon_hero_24"
              }
            />
            <span
              className={
                viewType === "WhoNeedsToHelpMe"
                  ? "fix_hero_white_32"
                  : "fix_hero_32"
              }
            >
              {whoNeedsToHelpMe.length}
            </span>
          </div>
          <div
            className={
              viewType === "WhoNeedsToHelpMe"
                ? "fix_menu_white_12"
                : "fix_menu_12"
            }
          >
            WHO NEEDS TO HELP ME
          </div>
        </div>
      </div>

      <div
        className={openFilterBar ? "fix_border_black_2" : "fix_border_white_2"}
        style={{ cursor: "pointer" }}
        onClick={() => {
          setOpenFilterBar(!openFilterBar);
        }}
      >
        <Icon name="filter" className="fix_icon_rmenu_14" />
        <span className="fix_menu_12">FILTER</span>
      </div>
    </div>
  );
};

export const styles = {
  viewTypeBtn: {
    borderRadius: "8px",
    padding: "5px 20px 10px 20px !important",
    marginRight: "30px",
    width: "225px",
  },
  sidebarPushableSize: {
    width: "100% !important",
    height: "calc(100vh - 102px) !important",
  },
  sidebarSize: {
    width: "90% !important",
  },
  sidebarPusherSize: {
    height: "100% !important",
    overflowY: "auto !important",
  },
  viewTypeFilterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "20px",
  },
};

export default PeopleCard;
