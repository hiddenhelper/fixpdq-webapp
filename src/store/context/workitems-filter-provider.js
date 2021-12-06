import React, { useReducer } from "react";
import _ from "lodash";
import { useLocalStorage } from "../../hooks";
import { STATUS, PRIORITY_DIFFICULTY_STATUS, DUE_DATE, WORKITEMS_ACTION_ICONS } from "../../components/workitems/workitems-definitions";

const WORKITEMS_FILTER_RECORD = "workitems-filter";

// display owner = off => don't display owners => active = false, display = false
// display owner = me => active = true, values: [id]
// display owner = everyone => active = false, display = true
const deprecatedStatuses = ["ASSIGNED"];

const initialState = {
  status: {
    active: true,
    values: [...Object.entries(STATUS).map(([, value]) => value)].filter(
      (s) => !deprecatedStatuses.includes(s)
    ),
  },
  ownerid: {
    active: false,
    selection: "everyone",
    display: true,
    values: [],
  },
  checkAll: false,
  creator: true,
  creatorid: {
    active: false,
    selection: "everyone",
    display: true,
    values: [],
  },
  difficulty: true,
  priority: {
    active: true,
    values: PRIORITY_DIFFICULTY_STATUS.map((p) => p.name),
  },
  viewActions: [...WORKITEMS_ACTION_ICONS.map((w) => w.id), 'none'],
  dueDate: DUE_DATE,
};

const ACTION = {
  GET_STATE: "GET_STATE",
  TOGGLE: "TOGGLE",
  SELECT: "SELECT",
  DESELECT: "DESELECT",
  SET_PROPERTY: "SET_PROPERTY",
};

export const WorkitemsFilterContext = React.createContext(initialState);

export const WorkitemsFilterProvider = (props) => {
  const { retrieveRecord, storeRecord } = useLocalStorage();

  const getFilterState = () => {
    const state = retrieveRecord(WORKITEMS_FILTER_RECORD);
    return state && state !== "undefined" ? state : initialState;
  };

  const selectReducer = (state, action) => {
    const { slice, values } = action.payload;
    const newState = { ...state };
    newState[slice].values = values;
    storeRecord(WORKITEMS_FILTER_RECORD, newState);

    return newState;
  };

  const deselectReducer = (state, action) => {
    const { slice } = action.payload;
    const newState = { ...state };
    newState[slice].values = [];
    storeRecord(WORKITEMS_FILTER_RECORD, newState);

    return newState;
  };

  const setPropertyReducer = (state, action) => {
    const { slice, value, property } = action.payload;
    const newState = { ...state };
    newState[slice][property] = value;
    storeRecord(WORKITEMS_FILTER_RECORD, newState);

    return newState;
  };

  const toggleReducer = (state, action) => {
    const { slice, value } = action.payload;
    const newState = _.cloneDeep(state);
    newState[slice] = value;
    storeRecord(WORKITEMS_FILTER_RECORD, newState);

    return newState;
  };

  const workitemsFilterReducer = (state, action) => {
    const currenState = getFilterState();
    switch (action.type) {
      case ACTION.TOGGLE:
        return toggleReducer(currenState, action);
      case ACTION.SELECT:
        return selectReducer(currenState, action);
      case ACTION.DESELECT:
        return deselectReducer(currenState, action);
      case ACTION.SET_PROPERTY:
        return setPropertyReducer(currenState, action);
      default:
        return currenState;
    }
  };

  const [filter, dispatch] = useReducer(workitemsFilterReducer, initialState);

  const filterActions = {
    dispatchToggle: (payload) => {
      dispatch({ type: ACTION.TOGGLE, payload });
    },
    dispatchSelect: (payload) => {
      dispatch({ type: ACTION.SELECT, payload });
    },
    dispatchDeselect: (payload) => {
      dispatch({ type: ACTION.DESELECT, payload });
    },
    dispatchGetState: () => {
      dispatch({ type: ACTION.GET_STATE, payload: {} });
    },
    dispatchSetProperty: (payload) => {
      dispatch({ type: ACTION.SET_PROPERTY, payload });
    },
  };

  return (
    <WorkitemsFilterContext.Provider
      value={{
        filter,
        filterActions,
      }}
    >
      {props.children}
    </WorkitemsFilterContext.Provider>
  );
};
