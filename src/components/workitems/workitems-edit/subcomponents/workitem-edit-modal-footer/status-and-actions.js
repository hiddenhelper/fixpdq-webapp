import React from "react";
import { Dropdown } from "semantic-ui-react";
import { WORKITEM_STATUS_DROPDOWN } from "../../../workitems-definitions";
import "../../workitems-edit.less";
import "../workitems-edit-subcomponents.less";

export const StatusAndActions = ({ form }) => {
  return (
    <div className={"workitems-edit-footer-status-and-actions"}>
      <Dropdown
        fluid
        value={form.workitemsEditForm.status}
        search
        selection
        // disabled={true}
        name="status"
        options={WORKITEM_STATUS_DROPDOWN}
        onChange={form.onChange}
        style={{ minWidth: "160px" }}
      />
    </div>
  );
};
