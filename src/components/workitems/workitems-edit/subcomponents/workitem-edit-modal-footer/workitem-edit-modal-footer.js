import {
  faCopy,
  faSave,
  faTimesCircle,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { memo } from "react";
import "../../workitems-edit.less";
import "../workitems-edit-subcomponents.less";
import { StatusAndActions } from "./status-and-actions";

export const WorkitemEditModalFooter = memo(
  ({
    form,
    closeWorkitemModal,
    handleSubmit,
    clearError,
    // currentStatus,
    // statusActionHandlers,
    removeWorkitem,
  }) => {
    const { isRequestOnFlight } = form;

    return (
      <div className={"workitems-edit-footer"}>
        <StatusAndActions
          form={form}
          // currentStatus={currentStatus}
          // statusActionHandlers={statusActionHandlers}
        />
        <div className={"workitems-edit-buttons"}>
          <div>
            <div
              data-cy="workitem-edit-modal-footer-button-43472"
              disabled={isRequestOnFlight}
              onClick={() => {
                if (!isRequestOnFlight) {
                  clearError();
                  closeWorkitemModal();
                }
              }}
              className="fix_border_black_2 fix_background_white fix_submenu_8"
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon
                icon={faTimesCircle}
                style={{ marginRight: "5px" }}
              />
              Cancel
            </div>
          </div>
          <div>
            <div
              data-cy="workitem-edit-modal-footer-button-20533"
              disabled={isRequestOnFlight}
              onClick={() => {
                if (!isRequestOnFlight) {
                  removeWorkitem();
                }
              }}
              className="fix_border_black_2 fix_background_black fix_submenu_white_8"
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faTrash} style={{ marginRight: "5px" }} />
              Remove
            </div>
          </div>
          <div>
            <div
              data-cy="workitem-edit-modal-footer-button-10012"
              disabled={isRequestOnFlight}
              className="fix_border_black_2 fix_background_black fix_submenu_white_8"
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faCopy} style={{ marginRight: "5px" }} />
              Copy
            </div>
          </div>
          <div>
            <div
              data-cy="workitem-edit-modal-footer-button-46071"
              disabled={isRequestOnFlight}
              onClick={() => {
                if (!isRequestOnFlight) {
                  handleSubmit();
                }
              }}
              className="fix_border_yellow_2 fix_background_yellow2 fix_submenu_8"
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faSave} style={{ marginRight: "5px" }} />
              Save
            </div>
          </div>
        </div>
      </div>
    );
  }
);
