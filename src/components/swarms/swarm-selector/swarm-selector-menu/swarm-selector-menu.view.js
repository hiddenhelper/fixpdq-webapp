import { css } from "glamor";
import React, { useState } from "react";
import { Dropdown } from "semantic-ui-react";
import { truncateString } from "../../../../utils/truncate-string";
import MenuItem from "./swarm-selector-menu-item/swarm-selector-menu-item.view";
import "./swarm-selector-menu.less";

const SwarmSelectorMenuView = ({
  chosenSwarms,
  changeSwarm,
  options,
  loading,
  selectAllSwarms,
  deselectAllSwarms,
  chosenSwarmsName,
  allSwarmsSelected,
  setAllSwarmsSelected,
}) => {
  const [open, setOpen] = useState(false);

  const onDropdownItemClick = (e, data) => {
    e.stopPropagation();
    changeSwarm(e, data);
  };

  const selectedSwarms = options.filter((option) =>
    chosenSwarms.includes(option.key)
  );

  const handleSelectAllSwarms = (e, data) => {
    e.stopPropagation();
    if (allSwarmsSelected) {
      setAllSwarmsSelected(false);
      deselectAllSwarms();
    } else {
      setAllSwarmsSelected(true);
      selectAllSwarms();
    }
  };

  return (
    <Dropdown
      loading={loading}
      pointing="left"
      button
      open={open}
      onClick={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      className="swarm-selector-menu-view link item"
      fluid
      data-cy="swarm-selector-menu-view"
      trigger={
        <>
          <div className={"swarm-selector-menu-container"}>
            <span className={"fix_title_grey3_12"}>
              {selectedSwarms.length > 0
                ? truncateString(chosenSwarmsName, 14)
                : "Swarms"}
            </span>
          </div>
        </>
      }
    >
      <Dropdown.Menu>
        {/* <Input icon="search" iconPosition="left" className="search" />
        <Dropdown.Divider /> */}
        {options
          .sort((a, b) => {
            const textA = a.text.toUpperCase();
            const textB = b.text.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
          })
          .map((option) => (
            <Dropdown.Item
              name="swarm"
              selected={chosenSwarms.includes(option.key)}
              data-cy={`swarm-selector-menu-view-dropdown-item-${option.key}`}
              key={option.key}
              value={option.key}
              onClick={(e, data) => {
                onDropdownItemClick(e, data);
              }}
            >
              <MenuItem option={option} />
            </Dropdown.Item>
          ))}
        <Dropdown.Item
          name="swarm"
          selected={allSwarmsSelected}
          data-cy={`swarm-selector-menu-view-dropdown-item-all-swarms`}
          key={"all_swarms"}
          value={"all_swarms"}
          onClick={handleSelectAllSwarms}
        >
          <div {...css(styles.all_SwarmsItem)}>
            <label className={"fix_title_grey3_12"}>ALL SWARMS</label>
          </div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const styles = {
  all_SwarmsItem: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
};

export default SwarmSelectorMenuView;
