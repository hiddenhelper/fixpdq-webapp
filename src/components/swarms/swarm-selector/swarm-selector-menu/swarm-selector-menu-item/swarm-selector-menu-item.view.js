import { css } from "glamor";
import React from "react";
import { Label } from "semantic-ui-react";

const SwarmSelectorMenuItemView = ({ option }) => {
  const styles = {
    item: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    label: {
      marginLeft: "10px",
    },
  };
  return (
    <>
      <div {...css(styles.item)}>
        <div>
          <Label circular>{option.shortText}</Label>
        </div>
        <div {...css(styles.label)}>
          <label className={"fix_title_grey3_12"}>{option.text}</label>
        </div>
      </div>
    </>
  );
};

export default SwarmSelectorMenuItemView;
