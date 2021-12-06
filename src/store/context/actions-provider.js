import React, { useState } from "react";

import {
  getActions,
  getActionsByListOfWorkitemIds,
} from "../../services/actions";

export const ActionsContext = React.createContext({
  actions: [],
  loading: false,
  success: false,
  fetchActions: null,
});

export const ActionsProvider = (props) => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchActions = async (workitemid) => {
    if (workitemid) {
      setLoading(true);
      try {
        const { items } = await getActions(workitemid);
        setSuccess(true);
        setActions(items.length > 0 ? items : []);
        setLoading(false);
      } catch {
        setActions([]);
        setLoading(false);
      }
    }
  };

  const fetchActionsByWorkitems = async (workitems) => {
    if (workitems && workitems.length > 0) {
      setLoading(true);
      try {
        const { items } = await getActionsByListOfWorkitemIds(workitems);
        setSuccess(true);
        setActions(items.length > 0 ? items : []);
        setLoading(false);
      } catch {
        setActions([]);
        setLoading(false);
      }
    }
  };

  return (
    <ActionsContext.Provider
      value={{
        actions,
        loading,
        success,
        fetchActions,
        fetchActionsByWorkitems,
      }}
    >
      {props.children}
    </ActionsContext.Provider>
  );
};
