import { css } from "glamor";
import React, { memo } from "react";
import { Dropdown, Image, Popup } from "semantic-ui-react";
import {
  WORKITEM_STATUS,
  WORKITEM_STATUS_DROPDOWN,
} from "../../workitems-definitions";

export const StatusAttribute = memo(({ item, playbookid, onChangeStatus }) => {
  const { workitemid, status } = item;
  const styles = {
    status: {
      position: "relative",
    },
    container: {
      width: "100px",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    dropdown: {
      width: "250px",
    },
    field: {
      backgroundColor: "#EFF3E0",
      borderRadius: "8px",
      border: "0 solid #EFF3E0",
      whiteSpace: "nowrap",
      minWidth: "100px",
      overflow: "ellipses",
    },
    dropdownContainer: {
      width: "250px",
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    statusBox: {
      padding: "5px 7px 5px 5px",
      width: "80px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "8px",
    },
  };
  const onChange = async (data) => {
    await onChangeStatus({ newStatus: data.value, workitemid });
  };

  const StatusIcon = () => {
    return (
      <div {...css(styles.container)}>
        <div
          className={
            WORKITEM_STATUS.find((s) => s.value === item.status)?.bgColor
          }
          {...css(styles.statusBox)}
        >
          <Image
            src={
              WORKITEM_STATUS.find((s) => s.value === item.status)?.src_w
            }
          />
          <label className="fix_body1_white_10">
            {WORKITEM_STATUS.find((s) => s.value === item.status)?.title}
          </label>
        </div>
      </div>
    );
  };

  const StatusDropdown = () => {
    return (
      <div {...css(styles.dropdownContainer)}>
        <div {...css(styles.dropdown)}>
          <Dropdown
            style={styles.field}
            placeholder="Select Status"
            fluid
            name={"status"}
            onChange={(e, data) => {
              onChange(data);
            }}
            value={status}
            search
            required
            // disabled={updateLoading}
            selection
            options={WORKITEM_STATUS_DROPDOWN}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {!playbookid ? (
        <Popup
          on="click"
          // onClose={handleClose}
          trigger={
            <div {...css(styles.status)}>
              <StatusIcon />
            </div>
          }
          flowing
          hoverable
        >
          <StatusDropdown />
        </Popup>
      ) : (
        <div {...css(styles.status)}>
          <StatusIcon />
        </div>
      )}
    </>
  );
});
