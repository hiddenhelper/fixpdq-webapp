import React, { useEffect, useState } from "react";
import { STATUS, PRIORITY_DIFFICULTY_STATUS, DUE_DATE, WORKITEMS_ACTION_ICONS } from "../../components/workitems/workitems-definitions";
import { useLocalStorage } from "../../hooks";

const WORKITEMS_CARD_FILTER_RECORD = "workitems-card-filter";

const initialState = {
  status: [...Object.entries(STATUS).map(([, value]) => value)].filter((s) => s !== STATUS.DELETED),
  owner: "everyone",
  creator: "everyone",
  priority: PRIORITY_DIFFICULTY_STATUS.map((p) => p.name),
  dueDate: DUE_DATE,
  viewActions: WORKITEMS_ACTION_ICONS.map((w) => w.id),
};

export const WorkitemsCardFilterContext = React.createContext(initialState);

export const WorkitemsCardFilterProvider = (props) => {
  const { retrieveRecord, storeRecord } = useLocalStorage();
  const [filter, setFilter] = useState();

  const getFilterState = () => {
    const state = retrieveRecord(WORKITEMS_CARD_FILTER_RECORD);
    return state && state !== "undefined" ? state : initialState;
  };

  const filterCardActions = (name, value) => {
    const currentState = getFilterState();
    currentState[name] = value;
    storeRecord(WORKITEMS_CARD_FILTER_RECORD, currentState);
    setFilter({ ...currentState });
  };

  useEffect(() => {
    const init = getFilterState();
    setFilter(init);
  }, []);

  return (
    <WorkitemsCardFilterContext.Provider
      value={{
        filter,
        filterCardActions,
      }}
    >
      {props.children}
    </WorkitemsCardFilterContext.Provider>
  );
};
