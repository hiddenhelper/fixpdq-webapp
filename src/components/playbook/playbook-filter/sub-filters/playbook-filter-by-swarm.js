import React from "react";
import { Button, Checkbox, Grid, Icon, Input, Popup } from "semantic-ui-react";

export const PlayBookFilterBySwarm = ({ PlayBookFilterListForSwarm }) => {
  return (
    <Popup
      flowing
      pinned
      on="click"
      position="bottom left"
      trigger={
        <div
          style={{ cursor: "pointer" }}
          data-cy="playbook-filter-by-swarm-button-56921"
        >
          <label style={{ marginRight: "5px" }} className="fix_menu_12">
            Swarm purpose
          </label>
          <Icon name="caret down" className="fix_icon_sort_down_8" />
        </div>
      }
    >
      <>
        <Input
          data-cy="playbook-filter-by-swarm-input-78321"
          icon="search"
          placeholder="Search swarm purpose..."
        />
        {PlayBookFilterListForSwarm.map((item) => (
          <div
            className="displayFlex"
            style={{
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
            key={item.value}
          >
            <div style={{ marginRight: "30px" }} className="fix_body2_10">
              {item.title}
            </div>

            <Checkbox />
          </div>
        ))}
        <div
          className="displayFlex"
          style={{
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div style={{ color: "green" }} className="fix_menu_12">Select All</div>
          <div style={{ color: "pink" }} className="fix_menu_12">Uncheck All</div>
        </div>
      </>
    </Popup>
  );
};
