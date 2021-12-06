/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "glamor";
import React, { useContext, useEffect, useState } from "react";
import { Card, Icon, Segment, Sidebar, Ref } from "semantic-ui-react";
import { useConversations, useWorkitemsEditModal } from "../../../hooks";
import { useWorkitemsTree } from "../../../hooks/use-workitems-tree";
import {
  CurrentSwarmContext,
  WorkitemsCardFilterContext,
  CoachModalContext,
} from "../../../store/context";
import UserContext from "../../user/context";
import WorkItemThreadModal from "../workitem-thread-modal/workitem-thread-modal";
import { DUE_DATE } from "../workitems-definitions";
import WorkitemsEdit from "../workitems-edit";
import WorkitemCardFilter from "./workitems-card-filter";
import { CardItem } from "./workitems-card.view";
import { useWorkitemsList } from "../../../hooks";
import {
  faFolders,
  faUserCrown,
  faUserEdit,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const WorkItemCard = ({
  allUsers,
  workitemsFromCurrentSwarm,
  actions,
  actionsSuccess,
  conversations,
  conversationsSuccess,
  getWorkitems,
  coachWorkitemList,
}) => {
  const context = useContext(UserContext);
  const { currentSwarm } = useContext(CurrentSwarmContext);
  const { filter: filterValues } = useContext(WorkitemsCardFilterContext);
  const { openConversations } = useConversations();
  const { openCoachModal, setOpenCoachModal } = useContext(CoachModalContext);

  const {
    getTree,
    getPredecessor,
    getSuccessor,
    getLastChild,
    getDescendants,
    nodeMap,
    nodeMapWorkitemId,
  } = useWorkitemsTree();

  const [threadVisible, setThreadVisible] = useState("init");
  const [threadProps, setThreadProps] = useState(null);

  const [workitemCardsByMyRole, setWorkitemCardsByMyRole] = useState({
    owner: [],
    creator: [],
    everything: [],
  });
  const [filterByMyRole, setFilterByMyRole] = useState("owner");
  const [openFilterBar, setOpenFilterBar] = useState(false);
  const segmentRef = React.useRef();

  const {
    workitemToEdit,
    openWorkitemEditModal,
    handleOpenWorkitemEditModal,
    handleCloseWorkitemEditModal,
  } = useWorkitemsEditModal();

  const { onChangeLevel, onChangeOwner, onChangeStatus } = useWorkitemsList();

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
    if (
      workitemsFromCurrentSwarm &&
      workitemsFromCurrentSwarm.length > 0 &&
      actionsSuccess &&
      conversationsSuccess
    ) {
      getWorkitemCardsByMyRole();
    }
  }, [workitemsFromCurrentSwarm, actions, conversations, coachWorkitemList]);

  useEffect(() => {
    if (openCoachModal) {
      onConversationClicked(null, null);
    }
  }, [openCoachModal]);

  const closeWorkitemModal = () => {
    handleCloseWorkitemEditModal();
  };

  const onEditWorkitemClicked = (workitemid) => {
    handleOpenWorkitemEditModal(workitemid);
  };

  const onConversationClicked = async (workitemId, conversationId) => {
    openConversations({
      wid: workitemId,
      userid: context.user.username,
      onOpen: () => {
        setThreadProps({ workitemId, conversationId });
        setThreadVisible("open");
      },
    });
  };

  const getWorkitemCardsByMyRole = async () => {
    let workitemCards = {
      owner: [],
      creator: [],
      everything: [],
    };

    if (workitemsFromCurrentSwarm && workitemsFromCurrentSwarm.length > 0) {
      let items;
      if (coachWorkitemList.length === 0) {
        // all swarm work items
        items = workitemsFromCurrentSwarm;
      } else {
        // coach work items
        items = workitemsFromCurrentSwarm.filter((w) =>
          coachWorkitemList.includes(w.workitemid)
        );
      }
      items
        .sort((a, b) => a.date_created - b.date_created)
        .forEach((element) => {
          const allActionsForWorkitem = actions.filter(
            (a) => a.workitemid === element.workitemid
          );
          const openActions = allActionsForWorkitem
            .filter((a) => a.status === "OPEN")
            .sort((a, b) => a.date_created - b.date_created);
          const conversationsWithNoAction = conversations
            .filter(
              (c) =>
                c.workitemId === element.workitemid &&
                allActionsForWorkitem.findIndex(
                  (a) => a.conversationId === c.conversationid
                ) === -1
            )
            .sort((a, b) => a.date_created - b.date_created);

          if (element.ownerid === context.user.username) {
            workitemCards.owner.push({
              workItem: element,
              actions: openActions,
              conversationsWithNoAction,
            });
          }

          if (element.creatorid === context.user.username) {
            workitemCards.creator.push({
              workItem: element,
              actions: openActions,
              conversationsWithNoAction,
            });
          }

          workitemCards.everything.push({
            workItem: element,
            actions: openActions,
            conversationsWithNoAction,
          });
        });
    }

    setWorkitemCardsByMyRole(workitemCards);
  };

  const displayWorkitems = () => {
    return workitemCardsByMyRole[filterByMyRole]?.map((card, index) => {
      if (filterFunc(card)) {
        const {
          filtered_Actions,
          filtered_Conversations,
        } = getActionsAndConversations(card);
        return (
          <CardItem
            workItem={card.workItem}
            conversations={filtered_Conversations}
            actions={filtered_Actions}
            openThreadModal={onConversationClicked}
            workitemsFromCurrentSwarm={workitemsFromCurrentSwarm}
            key={index}
            allUsers={allUsers}
            onEditWorkitemClicked={onEditWorkitemClicked}
            onConversationClicked={onConversationClicked}
            onChangeOwner={onChangeOwner}
            onChangeLevel={onChangeLevel}
            onChangeStatus={onChangeStatus}
          />
        );
      }
      return <></>;
    });
  };

  const closeConversationModal = () => {
    setThreadVisible("closed");
    setOpenCoachModal(false);
  };

  const filterFunc = ({ workItem, actions, conversationsWithNoAction }) => {
    if (!filterValues.status.includes(workItem.status)) {
      return false;
    }
    if (
      filterValues.owner !== "everyone" &&
      filterValues.owner !== workItem.ownerid
    ) {
      return false;
    }
    if (
      filterValues.creator !== "everyone" &&
      filterValues.creator !== workItem.creatorid
    ) {
      return false;
    }
    if (!filterValues.priority?.includes(workItem.priority)) {
      return false;
    }
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

    if (filterValues.viewActions && filterValues.viewActions.length > 0) {
      let flag = false;
      actions.forEach((action) => {
        if (filterValues.viewActions.includes(action.actionType)) {
          flag = true;
        }
      });
      if (
        filterValues.viewActions.includes("question") &&
        conversationsWithNoAction.length > 0
      ) {
        flag = true;
      }
      if (
        filterValues.viewActions.includes("none") &&
        conversationsWithNoAction.length === 0 &&
        actions.length === 0
      ) {
        flag = true;
      }
      return flag;
    } else {
      return false;
    }
  };

  const getActionsAndConversations = ({
    conversationsWithNoAction,
    actions,
  }) => {
    let filtered_Actions = [];
    let filtered_Conversations = [];
    if (filterValues) {
      // filter by action type
      filtered_Actions = actions.filter((action) =>
        filterValues.viewActions.includes(action.actionType)
      );
      filtered_Conversations = filterValues.viewActions.includes("question")
        ? conversationsWithNoAction
        : [];
    }
    return {
      filtered_Actions,
      filtered_Conversations,
    };
  };

  const setSelectedConversationId = (convid) => {
    if (threadProps) {
      setThreadProps((threadProps) => ({
        ...threadProps,
        conversationId: convid,
      }));
    }
  };

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
          target={segmentRef}
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
        <Ref innerRef={segmentRef}>
        <Sidebar.Pusher {...css(styles.sidebarPusherSize)}>
          <Segment basic>
            {myRoleSelector({
              filterByMyRole,
              setFilterByMyRole,
              workitemCardsByMyRole,
              openFilterBar,
              setOpenFilterBar,
            })}
            {openFilterBar ? (
              <WorkitemCardFilter
                workitems={workitemCardsByMyRole[filterByMyRole]?.map(
                  (card) => card.workItem
                )}
                allUsers={allUsers}
                type="workitem"
              />
            ) : (
              <></>
            )}

            <Card.Group itemsPerRow={6}>{displayWorkitems()}</Card.Group>
            {workitemToEdit && (
              <WorkitemsEdit
                tree={getTree()}
                treeParams={{
                  getLastChild,
                  getPredecessor,
                  getSuccessor,
                  getDescendants,
                  nodeMap,
                  nodeMapWorkitemId,
                }}
                params={{
                  workitemToEdit,
                  openWorkitemEditModal,
                  closeWorkitemModal,
                }}
              />
            )}
          </Segment>
        </Sidebar.Pusher>
        </Ref>
      </Sidebar.Pushable>
    </>
  );
};

const myRoleSelector = ({
  filterByMyRole,
  setFilterByMyRole,
  workitemCardsByMyRole,
  openFilterBar,
  setOpenFilterBar,
}) => {
  return (
    <div {...css(styles.myRoleFilterBar)}>
      <div style={{ display: "flex" }}>
        {/* ME AS OWNER */}
        <div
          {...css(styles.viewTypeBtn)}
          className={
            filterByMyRole === "owner"
              ? "fix_background_black_shadow"
              : "fix_background_grey_shadow"
          }
          onClick={() => {
            setFilterByMyRole("owner");
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
              icon={faUserCrown}
              className={
                filterByMyRole === "owner"
                  ? "fix_icon_hero_white_24"
                  : "fix_icon_hero_24"
              }
            />
            <span
              className={
                filterByMyRole === "owner" ? "fix_hero_white_32" : "fix_hero_32"
              }
            >
              {workitemCardsByMyRole.owner.length}
            </span>
          </div>
          <div
            className={
              filterByMyRole === "owner" ? "fix_menu_white_12" : "fix_menu_12"
            }
          >
            ME AS OWNER
          </div>
        </div>

        {/*  ME AS CREATOR */}
        <div
          {...css(styles.viewTypeBtn)}
          className={
            filterByMyRole === "creator"
              ? "fix_background_black_shadow"
              : "fix_background_grey_shadow"
          }
          onClick={() => {
            setFilterByMyRole("creator");
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
              icon={faUserEdit}
              className={
                filterByMyRole === "creator"
                  ? "fix_icon_hero_white_24"
                  : "fix_icon_hero_24"
              }
            />
            <span
              className={
                filterByMyRole === "creator"
                  ? "fix_hero_white_32"
                  : "fix_hero_32"
              }
            >
              {workitemCardsByMyRole.creator.length}
            </span>
          </div>
          <div
            className={
              filterByMyRole === "creator" ? "fix_menu_white_12" : "fix_menu_12"
            }
          >
            ME AS CREATOR
          </div>
        </div>

        {/*  EVERYTHING */}
        <div
          {...css(styles.viewTypeBtn)}
          className={
            filterByMyRole === "everything"
              ? "fix_background_black_shadow"
              : "fix_background_grey_shadow"
          }
          onClick={() => {
            setFilterByMyRole("everything");
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
              icon={faFolders}
              className={
                filterByMyRole === "everything"
                  ? "fix_icon_hero_white_24"
                  : "fix_icon_hero_24"
              }
            />
            <span
              className={
                filterByMyRole === "everything"
                  ? "fix_hero_white_32"
                  : "fix_hero_32"
              }
            >
              {workitemCardsByMyRole.everything.length}
            </span>
          </div>
          <div
            className={
              filterByMyRole === "everything"
                ? "fix_menu_white_12"
                : "fix_menu_12"
            }
          >
            EVERYTHING
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

const styles = {
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
  viewTypeBtn: {
    borderRadius: "8px",
    padding: "5px 20px 10px 20px !important",
    marginRight: "30px",
    width: "225px",
  },
  myRoleFilterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "20px",
  },
};

export default WorkItemCard;
