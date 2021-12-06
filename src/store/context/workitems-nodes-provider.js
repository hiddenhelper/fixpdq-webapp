import React, { useReducer } from "react";
import _ from "lodash";

import { storeItem, retrieveItem } from "../../utils/local-storage";

const WORKITEMS_NODES_RECORD = "workitems-nodes";

const initialState = {
  expandedNodes: [],
};

export const EXPAND_NODES = "EXPAND_NODES";
export const COLLAPSE_NODE = "COLLAPSE_NODE";
export const GET_STATE = "GET_STATE";

const expandNodeReducer = (state, action) => {
  const { ids } = action.payload;
  const newState = _.cloneDeep(state);
  for (let i = 0; i < ids.length; i++) {
    if (!state.expandedNodes.includes(ids[i])) {
      newState.expandedNodes.push(ids[i]);
    }
  }
  storeItem(WORKITEMS_NODES_RECORD, newState);

  return newState;
};

const collapseNodeReducer = (state, action) => {
  const { id } = action.payload;
  const newState = { ...state };
  const index = newState.expandedNodes.findIndex((n) => n === id);
  if (index > -1) {
    newState.expandedNodes.splice(index, 1);
    storeItem(WORKITEMS_NODES_RECORD, newState);
  }
  
  return newState;
};

const getNodesState = () => {
  const state = retrieveItem(WORKITEMS_NODES_RECORD);
  return state && state !== "undefined" ? state : initialState;
};

const workitemsNodesReducer = (state, action) => {
  const currenState = getNodesState();
  switch (action.type) {
    case EXPAND_NODES:
      return expandNodeReducer(currenState, action);
    case COLLAPSE_NODE:
      return collapseNodeReducer(currenState, action);
    default:
      return currenState;
  }
};

export const WorkitemsNodesContext = React.createContext(initialState);

export const WorkitemsNodesProvider = (props) => {  
  const [nodesState, dispatch] = useReducer(
    workitemsNodesReducer,
    initialState
  );

  const nodesActions = {
    dispatchExpandNodes: (ids) => {
      dispatch({ type: EXPAND_NODES, payload: { ids } });
    },
    dispatchCollapseNode: (id) => {
      dispatch({ type: COLLAPSE_NODE, payload: { id } });
    },
    dispatchGetNodesState: (id) => {
      dispatch({ type: GET_STATE, payload: {} });
    },
  };

  return (
    <WorkitemsNodesContext.Provider
      value={{
        nodesState,
        nodesActions,
      }}
    >
      {props.children}
    </WorkitemsNodesContext.Provider>
  );
};
