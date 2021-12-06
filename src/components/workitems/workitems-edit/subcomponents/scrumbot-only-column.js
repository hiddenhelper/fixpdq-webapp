/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Segment } from "semantic-ui-react";

import "../workitems-edit.less";
import "./workitems-edit-subcomponents.less";

export const ScrumbotOnlyColumn = () => {
  return (
    <div className={"workitem-edit-column "}>
      <label>The Coach's Suggestion</label>
      <Segment style={{ height: "100%" }}>
        <div style={{ fontWeight: "bold" }}>
          Hey, Click / Drag to upload attachments here!
        </div>
      </Segment>
    </div>
  );
};
