/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-semantic-toasts";
import "react-semantic-toasts/styles/react-semantic-alert.css";
import { v4 as uuidv4 } from "uuid";
import { usePayloadBuilderListView } from "../../../hooks";
import { createWorkitem, updateWorkitem } from "../../../services/workitems";
import {
  CurrentSwarmContext,
  TwilioContext,
  UsersContext,
  WorkitemsContext,
  WorkitemsNodesContext,
} from "../../../store/context";
import { getTreeHash } from "../../../utils/workitems";
import UserContext from "../../user/context";
import {
  ACTION,
  DUE_DATE,
  POSITION_ACTION,
  STATUS,
} from "../workitems-definitions";
import { WorkItemListView } from "./workitems-list.view";

export const WorkItemList = memo(({ data, params }) => {
  const { nodesState, nodesActions } = useContext(WorkitemsNodesContext);
  const {
    nodeMap,
    updateTitle,
    setItemBeingEdited,
    nodeMapWorkitemId,
    getNeighbors,
    filter,
    actions,
    conversations,
  } = params;

  const context = useContext(UserContext);
  const {
    tree,
    workitems,
    workitemsFromCurrentSwarm,
    loading,
    loadingPage,
    success,
    refreshWorkitemsAfterUpdate,
    swarmActions,
  } = useContext(WorkitemsContext);
  const { getSwarms } = useContext(CurrentSwarmContext);
  const { users, success: usersLoadingSuccess } = useContext(UsersContext);
  const { twilioConversations } = useContext(TwilioContext);
  const {
    createNewWorkitem,
    addNewWorkitemToSwarm,
  } = usePayloadBuilderListView();

  const [usersList, setUsersList] = useState([]);
  const [focusedWorkItem, setFocusedWorkItem] = useState(null);
  const [lastTimeEnterPress, setLastTimeEnterPress] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (usersLoadingSuccess) {
      setUsersList(users);
    }
  }, [users, usersLoadingSuccess]);

  useEffect(() => {
    if (
      tree.length === 0 &&
      workitems
        .filter((item) => item.isStaging)
        .filter((item) => item.status === STATUS.DELETED).length === 0 &&
      !loading &&
      !loadingPage &&
      success
    ) {
      swarmActions.dispatchAddNext({
        newWorkitem: addNewWorkitemToSwarm({
          workitemid: uuidv4(),
          title: "",
          context,
        }),
        parent: undefined,
        current: undefined,
        currentTitle: "",
        successorId: "0",
      });
    }

    if (tree.length > 0 && !loading && !loadingPage && success) {
      filterFunc();
    }
  }, [loading, loadingPage, tree, workitems, filter, actions, conversations]);

  const filterFunc = () => {
    const workitemIdwithActions = actions
      .filter(
        (a) => filter.viewActions.includes(a.actionType) && a.status === "OPEN"
      )
      .map((a) => a.workitemid);
    const workitemIdwithConversations = filter.viewActions.includes("question")
      ? conversations
          .filter(
            (c) => !actions.find((a) => a.conversationId === c.conversationid)
          )
          .map((s) => s.workitemId)
      : [];
    const workitemsIdwithNone = filter.viewActions.includes("none")
      ? data
          .filter(
            (d) =>
              !actions.find((a) => a.workitemid === d.workitemid) &&
              !conversations.find((c) => c.workitemId === d.workitemid)
          )
          .map((i) => i.workitemid)
      : [];

    const combinedFilteredWorkItemIds = [
      ...workitemIdwithActions,
      ...workitemIdwithConversations,
      ...workitemsIdwithNone,
    ];

    const newData = data.filter(
      (i) =>
        filter.dueDate.includes(handleDate(i.end_time)) &&
        combinedFilteredWorkItemIds.includes(i.workitemid)
    );

    setFilteredData(newData);
  };

  const handleDate = (datetime) => {
    const now = new Date();
    const today_0 =
      now.getTime() -
      now.getHours() * 60 * 60 * 1000 -
      now.getMinutes() * 60 * 1000 -
      now.getSeconds() * 1000;
    let result;
    if (datetime < now.getTime()) {
      result = DUE_DATE[0]; //Late
    } else if (datetime < today_0 + 24 * 60 * 60 * 1000) {
      result = DUE_DATE[1]; // Today
    } else if (datetime < today_0 + 2 * 24 * 60 * 60 * 1000) {
      result = DUE_DATE[2]; //Tomorrow
    } else if (datetime < today_0 + 7 * 24 * 60 * 60 * 1000) {
      result = DUE_DATE[3]; // 1 week
    } else if (datetime < today_0 + 14 * 24 * 60 * 60 * 1000) {
      result = DUE_DATE[4]; // 2 weeks
    } else {
      result = DUE_DATE[5]; // 2 weeks+
    }
    return result;
  };

  const createWorkitemInSwarm = async ({
    title,
    predecessor,
    successor,
    parentId,
    workitemid,
    stagingItem,
  }) => {
    return createWorkitem({
      ...createNewWorkitem({
        title,
        predecessor,
        successor,
        parentId,
        context,
        stagingItem,
      }),
      workitemid,
    });
  };

  const createFirstWorkitemInSwarm = async ({
    id,
    inputValue,
    parentId,
    predecessor,
    successor,
    updateTimestamp,
    workitemid,
  }) => {
    let result;
    try {
      result = await createWorkitemInSwarm({
        title: inputValue,
        predecessor,
        successor,
        parentId,
        workitemid,
      });
      if (result && result.workitemid) {
        const nextWorkitemId = uuidv4();
        const newItem = await createWorkitemInSwarm({
          title: "",
          predecessor: result.workitemid,
          successor,
          parentId,
          workitemid: nextWorkitemId,
        });

        setFocusedWorkItem(newItem.workitemid);
      }
      await refreshWorkitemsAfterUpdate({
        swarms: getSwarms(),
        updateTimestamp,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const updateAndCreateNextOne = async ({
    id,
    inputValue,
    successor,
    predecessor,
    parentId,
    updateTimestamp,
    workitemid,
    stagingItemData,
  }) => {
    let result;
    try {
      if (!nodeMap[id].isStaging) {
        result = await updateWorkitem(nodeMap[id].workitemid, {
          name: inputValue,
          currentParentId: parentId,
        });
        if (result && id === "1" && !nodeMap[id]) {
          const newItem = await createWorkitemInSwarm({
            title: "",
            predecessor: result.workitemid,
            successor,
            parentId,
            workitemid,
          });
          setFocusedWorkItem(newItem.workitemid);
          setItemBeingEdited(newItem.workitemid);
        }
      } else {
        await createWorkitemInSwarm({
          title: nodeMap[id].name,
          predecessor,
          successor,
          parentId: parentId,
          workitemid: nodeMap[id].workitemid,
          stagingItem: nodeMap[id].stagingItem,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createOrUpDateWorkitem = async ({
    id,
    inputValue,
    predecessor,
    successor,
    parentId,
    workitemid,
    stagingItemData,
  }) => {
    let updateTimestamp = new Date().getTime();
    // Create or update
    if (!nodeMap || !nodeMap[id].workitemid) {
      await createFirstWorkitemInSwarm({
        id,
        inputValue,
        parentId,
        successor,
        predecessor,
        updateTimestamp,
        workitemid,
      });
    } else {
      await updateAndCreateNextOne({
        id,
        inputValue,
        successor,
        parentId,
        predecessor,
        updateTimestamp,
        workitemid,
        stagingItemData,
      });
    }
  };

  const handleEnterPress = async (event, params) => {
    const currentTime = new Date().getTime();
    if (!lastTimeEnterPress || currentTime - lastTimeEnterPress > 1500) {
      const { id, workitemid: wid, playbookid, inputValue } = params;
      if (!playbookid) {
        const workitemid = uuidv4();
        let stagingItemData;
        const { parent, parentId, successorId, predecessorId } = getNeighbors(
          wid
        );
        updateTitle(id, inputValue);
        if (id !== "1" || (nodeMap && nodeMap[id].workitemid)) {
          stagingItemData = {
            parentid: parentId,
            newWorkitemId: workitemid,
            currentWorkitemId: wid,
            successorId,
          };
          swarmActions.dispatchAddNext({
            newWorkitem: addNewWorkitemToSwarm({
              workitemid,
              title: "",
              context,
            }),
            parent,
            current: nodeMap && nodeMap[id],
            currentTitle: inputValue,
            successorId,
            creatorid: context.user.username,
          });

          setItemBeingEdited(workitemid);
          setFocusedWorkItem(workitemid);
        }
        setLastTimeEnterPress(new Date().getTime());
        await createOrUpDateWorkitem({
          id,
          inputValue,
          successor: successorId,
          predecessor: predecessorId,
          parentId,
          workitemid,
          stagingItemData,
        });
      }
    }
  };

  const handleTabPress = async (event, params) => {
    const { workitemid: wid, playbookid, inputValue } = params;
    if (!playbookid) {
      const itemToMove = nodeMapWorkitemId[wid];
      const {
        parentId,
        parent,
        predecessorId,
        successorId,
        predecessor,
        lastChildOfPredecessor,
        lastChildOfPredecessorId,
      } = getNeighbors(wid);
      if (!nodesState.expandedNodes.includes(predecessorId)) {
        nodesActions.dispatchExpandNodes([predecessorId]);
      }
      if (predecessorId !== "0") {
        swarmActions.dispatchIndent({
          itemToMove,
          currentTitle: inputValue,
          source: {
            successorId,
            parent: parent,
          },
          destination: {
            parent: predecessor,
            lastChild: lastChildOfPredecessor,
          },
        });
        setFocusedWorkItem(itemToMove.workitemid);
        try {
          if (itemToMove.isStaging) {
            await createWorkitemInSwarm({
              title: inputValue,
              predecessor: predecessorId,
              successor: successorId,
              parentId: parentId,
              workitemid: itemToMove.workitemid,
            });
          }
          await updateWorkitem(itemToMove.workitemid, {
            name: inputValue,
            positionActions: [
              {
                name: POSITION_ACTION.INDENT,
                payload: {
                  source: {
                    successor: successorId,
                    parent: parentId,
                  },
                  destination: {
                    parent: predecessorId,
                    parentLastChild: lastChildOfPredecessorId,
                  },
                },
              },
            ],
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  const getNewParent = (wid) => {
    const { parentId: oldParent } = getNeighbors(wid);
    const { parentId: newParentId } = getNeighbors(oldParent);
    return newParentId;
  };

  const handleShiftTabPress = async (event, params) => {
    const { workitemid: wid, id, playbookid, inputValue } = params;
    const {
      parent,
      successorOfParentId,
      predecessor,
      predecessorId,
      successorId,
      parentId,
    } = getNeighbors(wid);
    if (!playbookid) {
      if (nodeMapWorkitemId[wid] && parentId !== "0") {
        const itemToMove = nodeMapWorkitemId[wid];
        const newParentId = getNewParent(wid);
        const newParent = nodeMapWorkitemId[newParentId];
        swarmActions.dispatchOutdent({
          itemToMove,
          currentTitle: inputValue,
          source: {
            parent: parent,
            successorOfParentId,
            predecessor: predecessor,
            successorId: successorId,
          },
          destination: {
            parent: newParent,
          },
        });
        setFocusedWorkItem(itemToMove.workitemid);
        try {
          await updateWorkitem(itemToMove.workitemid, {
            name: inputValue,
            positionActions: [
              {
                name: POSITION_ACTION.OUTDENT,
                payload: {
                  source: {
                    parent: parentId,
                    successorOfParent: successorOfParentId,
                    predecessor: predecessorId,
                    successor: successorId,
                  },
                  destination: {
                    parent: newParentId,
                  },
                },
              },
            ],
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  const onBackwardClick = (event, params) => {
    handleShiftTabPress(event, params);
  };

  const onForwardClick = (event, params) => {
    handleTabPress(event, params);
  };

  const onKeyDownInputBox = async (event, params) => {
    const keyCode = event.keyCode;
    switch (keyCode) {
      case 13:
        event.preventDefault();
        handleEnterPress(event, params);
        break;
      case 9:
        event.preventDefault();
        if (event.shiftKey) {
          await handleShiftTabPress(event, params);
        } else {
          await handleTabPress(event, params);
        }

        break;
      case 8:
        handleBackspacePress(event, params);
        break;
      default:
        break;
    }
  };

  const handleItemBlurEvent = async (item, inputValue) => {
    try {
      if (item.isStaging) {
        let updateTimestamp = new Date().getTime();
        updateTitle(item.id, inputValue);
        const { parentId, successorId, predecessorId } = getNeighbors(
          item.workitemid
        );
        swarmActions.dispatchUpdate({
          itemToUpdate: item,
          propertyName: "name",
          propertyValue: inputValue,
        });
        await createWorkitem({
          ...createNewWorkitem({
            title: inputValue,
            predecessor: predecessorId,
            successor: successorId,
            parentId,
            context,
          }),
          workitemid: item.workitemid,
        });
        await refreshWorkitemsAfterUpdate({
          swarms: getSwarms(),
          updateTimestamp,
        });
      }
      if (item.name !== inputValue) {
        swarmActions.dispatchUpdate({
          itemToUpdate: item,
          propertyName: "name",
          propertyValue: inputValue,
        });
        let updateTimestamp = new Date().getTime();
        await updateWorkitem(item.workitemid, {
          name: inputValue,
        });
        await refreshWorkitemsAfterUpdate({
          swarms: getSwarms(),
          updateTimestamp,
        });
      }

      setFocusedWorkItem(null);
    } catch (err) {
      console.log(err);
    }
  };

  const isEmptyWorkitem = (workitemid) => {
    if (workitemid === undefined || workitemid === "") {
      return false;
    }
    const workitem = workitemsFromCurrentSwarm.find(
      (s) => s.workitemid === workitemid
    );
    if (!workitem) {
      return false;
    }
    if (workitem.description && workitem.description !== "") {
      return false;
    }
    if (workitem.files && workitem.files.length > 0) {
      return false;
    }
    if (
      twilioConversations &&
      twilioConversations.find((s) => s.attributes.workItem === workitemid)
    ) {
      return false;
    }
    return true;
  };

  const handleBackspacePress = async (event, params) => {
    const { workitemid: wid, inputValue, workitemid } = params;
    if (!inputValue && isEmptyWorkitem(workitemid)) {
      event.preventDefault();
      const { predecessor } = getNeighbors(wid);
      let nextWorkitemIdForFocus = null;
      if (predecessor) {
        let workitem = predecessor;
        while (workitem._children && workitem._children.length > 0) {
          workitem = workitem._children[workitem._children.length - 1];
        }
        nextWorkitemIdForFocus = workitem.workitemid;
      } else if (nodeMapWorkitemId[workitemid].parentid !== "0") {
        nextWorkitemIdForFocus = nodeMapWorkitemId[workitemid].parentid;
      }
      setItemBeingEdited(nextWorkitemIdForFocus);
      setFocusedWorkItem(nextWorkitemIdForFocus);
      await removeWorkitemById(wid);
    }
  };

  const removeWorkitemById = async (workitemid) => {
    const {
      parentId,
      successorId,
      predecessorId,
      descendantIds,
      predecessor,
      parent,
      descendants,
    } = getNeighbors(workitemid);
    const payload = {
      positionActions: [
        {
          name: POSITION_ACTION.DELETE,
          payload: {
            successor: successorId,
            parent: parentId,
            predecessor: predecessorId,
            descendants: descendantIds,
          },
        },
      ],
    };
    try {
      const removePayload = {
        itemToRemove: nodeMapWorkitemId[workitemid],
        parent,
        predecessor,
        successorId,
        descendants,
        descendantIds,
      };
      swarmActions.dispatchRemove(removePayload);
      updateWorkitem(workitemid, payload);
    } catch (error) {
      console.log(error);
    }
  };

  // return (
  //   <>
  //     <WorkItemListView
  //       data={filteredData}
  //       params={{
  //         ...params,
  //         ...{
  //           onKeyDownInputBox,
  //           onBackwardClick,
  //           onForwardClick,
  //           onChangeOwner,
  //           updateLoading,
  //           focusedWorkItem,
  //           handleItemBlurEvent,
  //           removeWorkitem: removeWorkitemById,
  //         },
  //       }}
  //       nodesState={nodesState}
  //       allUsers={usersList}
  //     />
  //   </>
  // );

  return useMemo(() => {
    return (
      <WorkItemListView
        data={filteredData}
        params={{
          ...params,
          ...{
            onKeyDownInputBox,
            onBackwardClick,
            onForwardClick,
            focusedWorkItem,
            handleItemBlurEvent,
            removeWorkitem: removeWorkitemById,
          },
        }}
        nodesState={nodesState}
        allUsers={usersList}
      />
    );
  }, [
    getTreeHash(filteredData),
    params.focusedWorkItem,
    params.itemBeingEdited,
    JSON.stringify(nodesState),
  ]);
});
