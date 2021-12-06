/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react";
import { CurrentSwarmContext, SwarmsContext } from "../store/context";

export const useSwarmSelector = () => {
  const {
    swarms,
    swarmsDropdownOptions,
    fetchSwarmsList,
    success: swarmsLoadingSuccess,
    loading,
    myFirstSwarm,
  } = useContext(SwarmsContext);
  const { currentSwarm, getCurrentSwarm, upadateCurrentSwarm } = useContext(
    CurrentSwarmContext
  );

  useEffect(() => {
    const getSwarms = async () => {
      getCurrentSwarm();
      await fetchSwarmsList();
    };
    getSwarms();
  }, []);

  useEffect(() => {
    if (swarmsLoadingSuccess) {
      if (!currentSwarm) {
        const myFirstSwarm = swarms.find((s) => s.isFirstSwarm);
        if (myFirstSwarm) {
          upadateCurrentSwarm({
            chosenSwarms: [myFirstSwarm.swarmid],
            name: myFirstSwarm.name,
          });
        }
      }
    }
  }, [loading]);

  return {
    loading,
    swarmsDropdownOptions,
    swarms,
    myFirstSwarm,
  };
};
