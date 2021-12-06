/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState } from "react";
import { useSwarmSelector } from "../../../hooks/use-swarm-selector";
import { CurrentSwarmContext, SwarmsContext } from "../../../store/context";
import SwarmSelectorMenuView from "./swarm-selector-menu/swarm-selector-menu.view";

const SwarmSelector = ({ isMenuMode }) => {
  const { currentSwarm, upadateCurrentSwarm } = useContext(CurrentSwarmContext);
  const { pickSwarm, myFirstSwarm } = useContext(SwarmsContext);

  const { swarms, swarmsDropdownOptions, loading } = useSwarmSelector();

  const [allSwarmsSelected, setAllSwarmsSelected] = useState(false);

  const selectCurrentSwarm = (swarmIds) => {
    if (swarmIds) {
      let name;
      if (swarmIds.length === 1) {
        name = pickSwarm(swarmIds[0]).pickProp("name");
      } else {
        name = swarmsDropdownOptions
          .filter((s) => swarmIds.includes(s.key))
          .map((s) => s.shortText)
          .join(", ");
      }
      upadateCurrentSwarm({
        chosenSwarms: swarmIds,
        name,
      });
    }
  };

  const selectAllSwarms = () => {
    const ids = swarms.map((s) => s.swarmid);
    selectCurrentSwarm(ids);
  };

  const deselectAllSwarms = () => {
    selectCurrentSwarm([myFirstSwarm.swarmid]);
  };

  const changeSwarm = (e, data) => {
    const allSwarms = swarms.map((s) => s.swarmid);
    let updatedChosenSwarms;
    if (!loading) {
      const { chosenSwarms } = currentSwarm;
      const sid = data.value;
      if (chosenSwarms.includes(sid)) {
        if (chosenSwarms.length > 1) {
          const filtered = chosenSwarms.filter((s) => s !== sid);
          updatedChosenSwarms = [...filtered];
        }
      } else {
        updatedChosenSwarms = [...chosenSwarms, sid];
      }
      if (updatedChosenSwarms) {
        selectCurrentSwarm(updatedChosenSwarms);
        if (updatedChosenSwarms.length === allSwarms.length) {
          setAllSwarmsSelected(true);
        } else {
          setAllSwarmsSelected(false);
        }
      }
    }
  };

  const getDropDownOptions = () => {
    return swarmsDropdownOptions;
  };

  return (
    <>
      {isMenuMode && (
        <SwarmSelectorMenuView
          loading={loading}
          chosenSwarms={currentSwarm ? currentSwarm.chosenSwarms : []}
          chosenSwarmsName={currentSwarm?.name}
          changeSwarm={changeSwarm}
          selectAllSwarms={selectAllSwarms}
          deselectAllSwarms={deselectAllSwarms}
          options={getDropDownOptions()}
          allSwarmsSelected={allSwarmsSelected}
          setAllSwarmsSelected={setAllSwarmsSelected}
        />
      )}
    </>
  );
};

export default SwarmSelector;
