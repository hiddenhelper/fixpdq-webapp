import React, { useContext, useState } from "react";
import { getSwarms } from "../../services/swarms";
import ItemPicker from "../../utils/shared/item-picker";
import { CurrentSwarmContext } from "./current-swarm-provider";

export const SwarmsContext = React.createContext({
  swarms: [],
  swarmsDropdownOptions: [],
  myFirstSwarm: null,
  loading: false,
  success: false,
  fetchSwarmsList: null,
  clearMyFirstSwarm: null,
});

export const SwarmsProvider = (props) => {
  const { currentSwarm, getSwarms: getAllCurrentSwarms } = useContext(
    CurrentSwarmContext
  );
  const [swarms, setSwarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [swarmsDropdownOptions, setSwarmsDropdownOptions] = useState([]);
  const [myFirstSwarm, setMyFirstSwarm] = useState(null);

  const fetchSwarmsList = async () => {
    setLoading(true);
    try {
      const { items } = await getSwarms();
      setSuccess(true);
      setSwarms(items.slice());
      setSwarmsDropdownOptions(
        items
          .slice()
          .sort((x, y) =>
            x.isFirstSwarm === y.isFirstSwarm ? 0 : x.isFirstSwarm ? -1 : 1
          )
          .map((s) => {
            return {
              key: s.swarmid,
              text: s.name,
              shortText: s.name.substring(0, 1).toUpperCase(),
              value: s.swarmid,
            };
          })
      );
      setMyFirstSwarm(items.find((s) => s.isFirstSwarm));
      setLoading(false);
    } catch {
      setSwarms([]);
      setLoading(false);
    }
  };

  const clearMyFirstSwarm = () => {
    setMyFirstSwarm(null);
  };

  const getCurrentSwarmUsers = () => {
    const currentSwarmUsers = [];
    if (currentSwarm) {
      getAllCurrentSwarms().forEach((s) => {
        const swarmUsers = swarms
          .find((swarm) => swarm.swarmid === s)
          ?.users.map((u) => u.userid);
        const swarmUsersNoDuplicates = [...new Set(swarmUsers)];
        swarmUsersNoDuplicates.forEach((s) => {
          currentSwarmUsers.push(s);
        });
      });
    }
    return [...new Set(currentSwarmUsers)];
  };

  const getCurrentSwarmProperty = ({ property, currentSwarmId }) => {
    if (currentSwarmId) {
      return pickSwarm(currentSwarmId).pickProp(property);
    } else {
      const { chosenSwarms } = currentSwarm;
      return pickSwarm(chosenSwarms[0]).pickProp(property);
    }
  };

  const pickSwarm = (swarmid) => {
    return new ItemPicker({
      id: swarmid,
      list: swarms,
      idPropName: "swarmid",
    });
  };

  return (
    <SwarmsContext.Provider
      value={{
        swarms,
        swarmsDropdownOptions,
        myFirstSwarm,
        loading,
        success,
        fetchSwarmsList,
        clearMyFirstSwarm,
        getCurrentSwarmUsers,
        getCurrentSwarmProperty,
        pickSwarm,
      }}
    >
      {props.children}
    </SwarmsContext.Provider>
  );
};
