/* eslint-disable react-hooks/exhaustive-deps */
import _ from "lodash";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { REFRESH_WORKITEM_INTERVAL } from "../../../components/workitems/workitems-definitions";
import {
  getUpdatedWorkitems,
  getWorkitems,
  getWorkitemsFromSwarms
} from "../../../services/workitems";
import ItemPicker from "../../../utils/shared/item-picker";
import { sortList } from "../../../utils/sort";
import { CurrentPlaybookContext } from "../current-playbook-provider";
import { CurrentSwarmContext } from "../current-swarm-provider";
import { WorkitemsFilterContext } from "../workitems-filter-provider";
import * as actions from "./actions";
import { getMap } from "./shared";
import { swarmReducer } from "./swarm-reducer";

export const WorkitemsContext = React.createContext({
  workitems: [],
  tree: [],
  workitemsFromCurrentSwarm: [],
  loading: false,
  loadingPage: false,
  success: false,
  fetchWorkitems: null,
  fetchWorkitemsBySwarms: null,
  refreshWorkitems: null,
  params: null,
  lastFetch: null,
});

export const WorkitemsProvider = (props) => {
  const {
    getCurrentPlaybook,
    upadateCurrentPlaybook,
    params: playbookParams,
  } = useContext(CurrentPlaybookContext);
  const {
    setLoading: setPlaybookLoading,
    setSuccess: setPlaybookSuccess,
    setCurrentPlaybook,
  } = playbookParams;

  useEffect(() => {
    const currentPlaybook = getCurrentPlaybook();
    dispatchForPlaybook({
      type: "init-playbook",
      payload: { currentPlaybook },
    });
  }, []);

  const { filter } = useContext(WorkitemsFilterContext);
  const { currentSwarm } = useContext(CurrentSwarmContext);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);

  const playbookRefreshReducer = (state, { payload }) => {
    if (payload.updatedPlaybook[0]) {
      const updatedPlaybook = payload.updatedPlaybook[0];
      const prevWorkitems = getCurrentPlaybook().workitems;
      const existingItems = prevWorkitems
        ? prevWorkitems.map((w) => w.workitemid)
        : [];
      const updatedWorkitems = _.cloneDeep(updatedPlaybook.workitems);
      const nextWorkitems = prevWorkitems.map(
        (prev) =>
          updatedWorkitems.find(
            (next) => next.workitemid === prev.workitemid
          ) || prev
      );
      const Workitems = updatedWorkitems.filter(
        (item) => !existingItems.includes(item.workitemid)
      );
      const State = {
        ...updatedPlaybook,
        workitems: sortList([...nextWorkitems, ...Workitems]),
      };
      setCurrentPlaybook({ 0: { ...State } });
      upadateCurrentPlaybook(State);
      return State;
    } else {
      return state;
    }
  };

  const playbookInitReducer = (state, action) => {
    return action.payload.currentPlaybook;
  };

  const playbookReducer = (state, action) => {
    switch (action.type) {
      case "refresh-playbook":
        return playbookRefreshReducer(state, action);
      case "init-playbook":
        return playbookInitReducer(state, action);
      default:
        return state;
    }
  };

  const [, dispatchForPlaybook] = useReducer(playbookReducer, {});

  const _setTree = (tree) => {
    dispatchForSwarm({ type: "set-tree", payload: { tree } });
  };

  const [swarm, dispatchForSwarm] = useReducer(swarmReducer, {
    workitems: [],
    tree: [],
    nodeMap: {},
    filter: {},
    currentSwarm: {},
    workitemsFromCurrentSwarm: [],
  });

  const handleRefreshWorkitemsInSwarm = (updatedWorkitems) => {
    if (updatedWorkitems && updatedWorkitems.length > 0) {
      dispatchForSwarm({
        type: "refresh-swarm",
        payload: { updatedWorkitems, message: "handleRefreshWorkitemsInSwarm" },
      });
    }
  };

  const handleRefreshWorkitemsInSwarmAfterUpdate = async ({
    updatedWorkitems,
    stagingItemData,
  }) => {
    dispatchForSwarm({
      type: "refresh-swarm",
      payload: {
        updatedWorkitems,
        stagingItemData,
        message: "handleRefreshWorkitemsInSwarmAfterUpdate",
      },
    });
  };

  useEffect(() => {
    if (currentSwarm) {
      if (swarm.workitems && swarm.workitems.length > 0) {
        dispatchForSwarm({
          type: "set-current-swarm",
          payload: { currentSwarm },
        });
      }
    }
  }, [currentSwarm, swarm.workitems]);

  useEffect(() => {
    dispatchForSwarm({
      type: "set-filter",
      payload: { filter },
    });
  }, [filter, swarm.workitems]);

  const fetchWorkitems = async () => {
    setLoading(true);
    setLoadingPage(true);
    setSuccess(false);
    try {
      const { items } = await getWorkitems();
      setLastFetch(new Date().getTime());
      setSuccess(true);
      dispatchForSwarm({
        type: "init-swarm",
        payload: { workitems: items.length > 0 ? items : [], currentSwarm },
      });
      setLoading(false);
      setLoadingPage(false);
    } catch {
      setLoading(false);
      setLoadingPage(false);
    }
  };

  const fetchWorkitemsBySwarms = async (swarms) => {
    setLoading(true);
    setSuccess(false);
    try {
      const { items } = await getWorkitemsFromSwarms(swarms);
      const baItems = items
        ? items
        : await fetchWorkitemsBySwarmsBatched(swarms).catch((err) =>
            console.log(err)
          );
      setLastFetch(new Date().getTime());
      setSuccess(true);
      dispatchForSwarm({
        type: "init-swarm",
        payload: { workitems: baItems.length > 0 ? baItems : [], currentSwarm },
      });
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const fetchWorkitemsBySwarmsBatched = async (swarms) => {
    const allWorkItems = [];
    for (const swarm of swarms) {
      const { items } = await getWorkitemsFromSwarms([swarm]);
      allWorkItems.push(...items);
    }
    return allWorkItems;
  };

  const handleRefreshWorkitemsInPlaybook = (updatedPlaybook) => {
    dispatchForPlaybook({
      type: "refresh-playbook",
      payload: { updatedPlaybook },
    });
  };

  const refreshWorkitems = async ({ swarms, playbookid }) => {
    const timestamp = new Date().getTime();
    if (timestamp - lastFetch > REFRESH_WORKITEM_INTERVAL) {
      setLoading(true);
      setSuccess(false);
      // setPlaybookLoading(true);
      try {
        setLastFetch(new Date().getTime());
        const { items } = await getUpdatedWorkitems({
          timestamp: timestamp - REFRESH_WORKITEM_INTERVAL * 2,
          swarms,
          playbookid,
        });
        const { workitems, playbook } = items;
        setSuccess(true);
        handleRefreshWorkitemsInSwarm(workitems.length > 0 ? workitems : []);
        setLoading(false);

        setPlaybookSuccess(true);
        handleRefreshWorkitemsInPlaybook(playbook ? playbook : {});
        setPlaybookLoading(false);
      } catch {
        setCurrentPlaybook(null);
        setLoading(false);
        setSuccess(false);
        setPlaybookLoading(false);
      }
    }
  };

  const refreshWorkitemsAfterUpdate = async ({
    swarms,
    updateTimestamp,
    stagingItemData,
  }) => {
    if (updateTimestamp) {
      setLoading(true);
      try {
        const { items } = await getUpdatedWorkitems({
          timestamp: updateTimestamp,
          swarms,
        });
        const { workitems } = items;
        setSuccess(true);
        await handleRefreshWorkitemsInSwarmAfterUpdate({
          updatedWorkitems: workitems,
          stagingItemData,
        });
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }
  };

  const swarmActions = {
    dispatchUpdate: (payload) => {
      actions.update({ dispatch: dispatchForSwarm, payload });
    },
    dispatchRemove: (payload) => {
      dispatchForSwarm({
        type: "remove",
        payload,
      });
    },
    dispatchAddNext: (payload) => {
      actions.addNext({ dispatch: dispatchForSwarm, payload });
    },
    dispatchIndent: (payload) => {
      dispatchForSwarm({
        type: "indent",
        payload,
      });
    },
    dispatchOutdent: (payload) => {
      dispatchForSwarm({
        type: "outdent",
        payload,
      });
    },
    dispatchChangeParent: (payload) => {
      actions.changeParent({ dispatch: dispatchForSwarm, payload });
    },
    dispatchChangeNext: (payload) => {
      actions.changeNext({ dispatch: dispatchForSwarm, payload });
    },
  };

  const pickWorkitem = (wid) => {
    return new ItemPicker({
      id: wid,
      list: swarm.workitemsFromCurrentSwarm,
      idPropName: "workitemid",
    });
  };

  return (
    <WorkitemsContext.Provider
      value={{
        workitems: swarm.workitems,
        workitemsFromCurrentSwarm: swarm.workitemsFromCurrentSwarm,
        loading,
        tree: swarm.tree,
        _setTree,
        getMap,
        loadingPage,
        success,
        lastFetch,
        fetchWorkitems,
        fetchWorkitemsBySwarms,
        refreshWorkitemsAfterUpdate,
        refreshWorkitems,
        swarmActions,
        nodeMapWorkitemId: swarm.nodeMap.workitemids,
        nodeMap: swarm.nodeMap.ids,
        pickWorkitem,
      }}
    >
      {props.children}
    </WorkitemsContext.Provider>
  );
};
