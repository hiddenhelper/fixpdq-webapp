/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Dropdown } from "semantic-ui-react";

const SwarmSelectorDropdownView = ({
  swarmid,
  changeSwarm,
  options,
  loading,
}) => {
  return (
    <>
      <Dropdown
        placeholder={loading ? "Loading" : "Swarms"}
        fluid
        name="swarm"
        search
        // disabled={loading || swarmid === "none"}
        value={swarmid}
        onChange={changeSwarm}
        selection
        options={options}
        data-cy="swarm-selector"
        className="fix_title_12"
      />
    </>
  );
};

export default SwarmSelectorDropdownView;
