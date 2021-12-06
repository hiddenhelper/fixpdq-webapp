import React, { useState } from "react";
import { useLocalStorage } from "../../hooks";

const CURRENT_SWARM_RECORD = "current-swarm";

export const CurrentSwarmContext = React.createContext({
  currentSwarm: null,
  upadateCurrentSwarm: null,
  getCurrentSwarm: null,
  clearCurrentSwarm: null,
  getSwarms: null,
});

export const CurrentSwarmProvider = (props) => {
  const { retrieveRecord, storeRecord, removeRecord } = useLocalStorage();
  const [currentSwarm, setCurrentSwarm] = useState(null);

  const upadateCurrentSwarm = (swarm) => {
    setCurrentSwarm(swarm);
    storeRecord(CURRENT_SWARM_RECORD, swarm);
  };

  const getSwarms = () => {
    return currentSwarm.chosenSwarms;
  };

  const getCurrentSwarm = () => {
    const swarm = retrieveRecord(CURRENT_SWARM_RECORD);
    setCurrentSwarm(swarm);
  };

  const clearCurrentSwarm = () => {
    removeRecord(CURRENT_SWARM_RECORD);
    setCurrentSwarm(null);
  };

  return (
    <CurrentSwarmContext.Provider
      value={{
        currentSwarm,
        upadateCurrentSwarm,
        getCurrentSwarm,
        getSwarms,
        clearCurrentSwarm,
      }}
    >
      {props.children}
    </CurrentSwarmContext.Provider>
  );
};
