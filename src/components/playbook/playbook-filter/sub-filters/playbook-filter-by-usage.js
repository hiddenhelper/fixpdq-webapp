import React from "react";
import { Checkbox, Grid, Icon, Popup } from "semantic-ui-react";

export const PlayBookFilterByUsage = ({ PlayBookFilterListForUsage }) => {
  return (
    <Popup
      flowing
      pinned
      on="click"
      position="bottom left"
      trigger={
        <div
          style={{ cursor: "pointer" }}
          data-cy="playbook-filter-by-usage-button-8072"
        >
          <label style={{ marginRight: "5px" }} className="fix_menu_12">
            Usage
          </label>
          <Icon name="caret down" className="fix_icon_sort_down_8" />
        </div>
      }
    >
      <>
        {PlayBookFilterListForUsage.map((item) => (
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
      </>
    </Popup>
  );
};
