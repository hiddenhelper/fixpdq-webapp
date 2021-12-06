/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "glamor";
import _ from "lodash";
import PropTypes from "prop-types";
import React, { memo, useContext, useEffect, useMemo, useState } from "react";
// @todo move to view
import {
  Form,
  Grid,
  Loader,
  Segment,
  Sidebar,
  TextArea,
  Ref,
} from "semantic-ui-react";
import { useConversations, useWorkitemsTree } from "../../hooks";
import {
  ActionsContext,
  CoachModalContext,
  ConversationsContext,
  CurrentSwarmContext,
  UsersContext,
  WorkitemsContext,
  WorkitemsFilterContext,
  WorkitemsNodesContext,
} from "../../store/context";
import { getTreeHash } from "../../utils/workitems";
import UserContext from "../user/context";
import WorkItemThreadModal from "./workitem-thread-modal/workitem-thread-modal";
import WorkitemsEdit from "./workitems-edit";
import WorkitemsFilterAlt from "./workitems-filter-alt";
import { WorkItemList } from "./workitems-list";
import "./workitems.less";

export const WorkItemComponent = memo(() => {
  const context = useContext(UserContext);
  const {
    workitemsFromCurrentSwarm,
    fetchWorkitems,
    fetchWorkitemsBySwarms,
    loadingPage,
    loading,
  } = useContext(WorkitemsContext);
  const { actions, fetchActionsByWorkitems } = useContext(ActionsContext);

  const { currentSwarm, getSwarms } = useContext(CurrentSwarmContext);
  const { filter, filterActions } = useContext(WorkitemsFilterContext);
  const { nodesState, nodesActions } = useContext(WorkitemsNodesContext);

  const { openConversations } = useConversations();

  const [debug, setDebug] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [openWorkitemEditModal, setOpenWorkitemEditModal] = useState(false);
  const [workitemToEdit, setWorkitemToEdit] = useState(null);
  const [isMoveWorkitem, setIsMoveWorkitem] = useState(false);

  const [threadVisible, setThreadVisible] = useState("init");
  const [threadProps, setThreadProps] = useState(null);
  const [itemBeingEdited, setItemBeingEdited] = useState(null);
  const { users, success: usersLoadingSuccess } = useContext(UsersContext);
  const [usersList, setUsersList] = useState([]);
  const segmentRef = React.useRef();

  const {
    conversations,
    success: conversationsSuccess,
    fetchConversationsByWorkitems,
  } = useContext(ConversationsContext);

  const {
    getTree,
    getAncestorId,
    getChildren,
    updateTitle,
    getPredecessor,
    getSuccessor,
    getLastChild,
    getDescendants,
    nodeMap,
    nodeMapWorkitemId,
    getNeighbors,
  } = useWorkitemsTree();

  const { openCoachModal, setOpenCoachModal } = useContext(CoachModalContext);

  const getWorkitems = async () => {
    const swarms = getSwarms();
    if (swarms && swarms.length > 0) {
      await fetchWorkitemsBySwarms(swarms);
    } else {
      await fetchWorkitems();
    }
  };

  const getWorkitemsBySwarms = async () => {
    await fetchWorkitemsBySwarms(getSwarms());
  };

  const fetchActions = async () => {
    try {
      await fetchActionsByWorkitems(
        workitemsFromCurrentSwarm.map((w) => w.workitemid)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchConversations = async () => {
    try {
      await fetchConversationsByWorkitems(
        workitemsFromCurrentSwarm.map((w) => w.workitemid)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (usersLoadingSuccess) {
      setUsersList(users);
    }
  }, [users]);

  useEffect(() => {
    if (currentSwarm) {
      setThreadProps(null);
      setThreadVisible("init");
      getWorkitems();
    }
  }, [currentSwarm]);

  useEffect(() => {
    if (
      workitemsFromCurrentSwarm &&
      workitemsFromCurrentSwarm.length > 0 &&
      !loading &&
      !loadingPage
    ) {
      fetchActions();
      fetchConversations();
    }
  }, [workitemsFromCurrentSwarm, loading, loadingPage]);

  useEffect(() => {
    if (threadVisible === "closed") {
      getWorkitemsBySwarms();
    }
  }, [threadVisible]);

  useEffect(() => {
    if (openCoachModal) {
      onConversationClick(null, { id: null });
    }
  }, [openCoachModal]);

  const onConversationClick = async (event, { id }) => {
    openConversations({
      wid: id,
      userid: context.user.username,
      onOpen: () => {
        setThreadProps({ workitemId: id, conversationId: null });
        setThreadVisible("open");
      },
    });
  };

  const onEditClick = async (event, { id }) => {
    setWorkitemToEdit(id);
    setOpenWorkitemEditModal(true);
  };

  const onClickToggleExpand = (event, workitemid) => {
    if (!nodesState.expandedNodes.includes(workitemid)) {
      nodesActions.dispatchExpandNodes([workitemid]);
    } else {
      nodesActions.dispatchCollapseNode(workitemid);
    }
  };

  const handleExpand = () => {
    nodesActions.dispatchExpandNodes(checkedItems);
  };

  const handleItemSelect = (event, data) => {
    const nodeWithChildrenIds = [
      ...getChildren(nodeMap[data.id]),
      data.workitemid,
    ];

    if (!checkedItems.includes(data.workitemid)) {
      setCheckedItems([...checkedItems, ...nodeWithChildrenIds]);
    } else {
      const filtered = checkedItems.filter(
        (item) => !nodeWithChildrenIds.includes(item)
      );
      setCheckedItems(filtered);
    }
  };

  const handleFilterSelect = (data, slice) => {
    const values = filter[slice].values.slice();
    if (!values.includes(data)) {
      values.push(data);
      filterActions.dispatchSelect({ slice, values });
    } else {
      const filtered = values.filter((item) => item !== data);
      filterActions.dispatchSelect({ slice, values: filtered });
    }
  };

  const handleFilterToggle = (slice) => {
    const copy = { ...filter };
    const value = !copy[slice];
    filterActions.dispatchToggle({ slice, value });
  };

  const handleCheckAll = () => {
    if (!filter.checkAll) {
      const allIds = Object.entries(nodeMap).map(
        ([key, value]) => value.workitemid
      );
      setCheckedItems(allIds);
    } else {
      setCheckedItems([]);
    }

    handleFilterToggle("checkAll");
  };

  useEffect(() => {
    if (checkedItems.length === 0 && filter.checkAll) {
      handleFilterToggle("checkAll");
    }
  }, [checkedItems.length]);

  const handleItemClick = (workitemid) => {
    setItemBeingEdited(workitemid);
  };

  const handleItemDoubleClick = (id) => {
    onEditClick(null, { id });
  };

  const closeWorkitemModal = () => {
    setWorkitemToEdit(null);
    setOpenWorkitemEditModal(false);
    setIsMoveWorkitem(false);
  };

  const onMoveWorkitemModalClick = ({ id }) => {
    setIsMoveWorkitem(true);
    setWorkitemToEdit(id);
    setOpenWorkitemEditModal(true);
  };

  const closeConversationModal = async () => {
    setThreadVisible("closed");
    setOpenCoachModal(false);
  };

  const setSelectedConversationId = (convid) => {
    if (threadProps) {
      setThreadProps((threadProps) => ({
        ...threadProps,
        conversationId: convid,
      }));
    }
  };

  // const handleDebugClick = () => {
  //   setDebug(!debug);
  // };

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
  };

  return (
    <>
      {currentSwarm && !loadingPage ? (
        <Sidebar.Pushable {...css(styles.sidebarPushableSize)}>
          <Sidebar
            animation="overlay"
            icon="labeled"
            direction="right"
            inverted
            vertical
            visible={threadVisible === "open"}
            onHide={() => closeConversationModal()}
            target={segmentRef}
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
          <Ref innerRef={segmentRef}>
            <Sidebar.Pusher {...css(styles.sidebarPusherSize)}>
              <Segment basic>
                <WorkitemsFilterAlt
                  workitems={workitemsFromCurrentSwarm}
                  allUsers={usersList}
                  handleFilterSelect={handleFilterSelect}
                />

                {/* <WorkitemsFilter
                params={{
                  handleCheckAll,
                  handleExpand,
                  handleFilterSelect,
                  handleFilterToggle,
                  filter,
                  filterActions,
                  ownerid: context.user.username,
                }}
              /> */}
                <Form>
                  <Grid verticalAlign={"top"}>
                    <Grid.Row textAlign={"left"}>
                      <Grid.Column width={10}></Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={8}>
                        <WorkItemList
                          data={getTree()}
                          params={{
                            onClickToggleExpand,
                            handleItemSelect,
                            handleItemClick,
                            handleItemDoubleClick,
                            onConversationClick,
                            onEditClick,
                            checkedItems,
                            getAncestorId,
                            updateTitle,
                            getPredecessor,
                            getSuccessor,
                            getDescendants,
                            getLastChild,
                            setItemBeingEdited,
                            filter,
                            filterActions,
                            nodeMap,
                            nodeMapWorkitemId,
                            itemBeingEdited,
                            onMoveWorkitemModalClick,
                            getNeighbors,
                            actions,
                            conversations,
                          }}
                        />
                      </Grid.Column>
                      {debug ? <Debug nodeMap={nodeMap} /> : null}
                    </Grid.Row>
                    {/* <Grid.Row style={{ padding: "5px" }}> */}
                    {/* <Checkbox label={"debug"} onClick={handleDebugClick} /> */}
                    {/* </Grid.Row> */}
                  </Grid>
                </Form>
                {workitemToEdit && (
                  <WorkitemsEdit
                    tree={getTree()}
                    treeParams={{
                      getLastChild,
                      getPredecessor,
                      getSuccessor,
                      getDescendants,
                      getAncestorId,
                      nodeMap,
                      nodeMapWorkitemId,
                      getNeighbors,
                    }}
                    params={{
                      workitemToEdit,
                      openWorkitemEditModal,
                      closeWorkitemModal,
                      isMoveWorkitem,
                    }}
                  />
                )}
                {/* </Container> */}
              </Segment>
            </Sidebar.Pusher>
          </Ref>
        </Sidebar.Pushable>
      ) : (
        loadingPage && <Loader active={loadingPage} />
      )}
    </>
  );
});

const Debug = ({ nodeMap }) => {
  return (
    <Grid.Column width={6}>
      <TextArea
        value={JSON.stringify(
          _.orderBy(
            Object.values(nodeMap).map((item) => {
              return {
                name: item.name,
                id: item.id,
                workitemid: item.workitemid,
                parentid: item.parentid,
                next: item.next,
                date_created: item.date_created,
              };
            }),
            ["date_created"],
            ["desc"]
          ),
          undefined,
          2
        )}
        rows={100}
      />
    </Grid.Column>
  );
};

WorkItemComponent.propTypes = {
  label: PropTypes.string,
};

const WorkitemsListPage = () => {
  const { workitemsFromCurrentSwarm } = useContext(WorkitemsContext);
  return useMemo(() => {
    return <WorkItemComponent />;
  }, [getTreeHash(workitemsFromCurrentSwarm)]);
};

export default WorkitemsListPage;
