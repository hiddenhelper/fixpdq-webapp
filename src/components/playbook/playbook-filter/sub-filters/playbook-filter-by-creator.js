import React from "react";
import { Button, Checkbox, Grid, Icon, Popup } from "semantic-ui-react";

export const PlayBookFilterByCreator = ({ PlayBookFilterListForCreator }) => {
  return (
    <Popup
      flowing
      pinned
      on="click"
      position="bottom left"
      trigger={
        <div
          style={{ cursor: "pointer" }}
          data-cy="playbook-filter-by-creator-button-52697"
        >
          <label style={{ marginRight: "5px" }} className="fix_menu_12">
            Creator
          </label>
          <Icon name="caret down" className="fix_icon_sort_down_8" />
        </div>
      }
    >
      <>
        {PlayBookFilterListForCreator.map((item) => (
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
