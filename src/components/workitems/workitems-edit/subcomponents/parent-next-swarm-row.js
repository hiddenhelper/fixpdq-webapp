/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Dropdown, Menu } from "semantic-ui-react";
import { splitDots } from "../../../../utils/workitems";
import SwarmSelectorDropdownView from "../../../swarms/swarm-selector/swarm-selector-dropdown/swarm-selector-dropdown.view";
import "../workitems-edit.less";
import "./workitems-edit-subcomponents.less";

const trimName = (name, length = 50) => {
  if (name.length === 0) {
    return " ";
  }
  if (name) {
    return name.length < length ? name : name.substring(0, length) + "...";
  } else {
    return name;
  }
};

export const ParentNextSwarmRow = ({
  tree,
  nodeMapWorkitemId,
  form,
  swarmsDropdownOptions,
}) => {
  return (
    <div>
      <SwarmSelector
        form={form}
        swarmsDropdownOptions={swarmsDropdownOptions}
      />
      <ParentSelector
        tree={tree}
        nodeMapWorkitemId={nodeMapWorkitemId}
        form={form}
      />
      <NextSelector
        tree={tree}
        nodeMapWorkitemId={nodeMapWorkitemId}
        form={form}
      />
    </div>
  );
};

export const NextSelector = ({ tree, nodeMapWorkitemId, form }) => {
  const { prevState, workitemsEditForm, onChange } = form;
  const parentNodeId = workitemsEditForm.parentid
    ? workitemsEditForm.parentid
    : nodeMapWorkitemId[workitemsEditForm.workitemid]
    ? nodeMapWorkitemId[workitemsEditForm.workitemid].parentid
    : "0";
  const list = (nodeMapWorkitemId[parentNodeId]
    ? nodeMapWorkitemId[parentNodeId]._children
    : tree
  )
    .filter((item) => item.workitemid !== workitemsEditForm.workitemid)
    .filter((item) => item.swarm === prevState.swarm);

  const workitemid_Next_Null = list.find(
    (item) => item.next === undefined || item.next === "" || item.next === "0"
  )?.workitemid;

  const getName = (workitemid) => {
    return nodeMapWorkitemId[workitemid]
      ? nodeMapWorkitemId[workitemid].name
      : "none";
  };

  return (
    <div className="workitems-edit-subcomponents-parent-div">
      <div style={{ marginRight: "10px", minWidth: "50px" }}>Next:</div>
      <Menu vertical>
        <Dropdown
          item
          disabled={
            prevState.swarm !== workitemsEditForm.swarm ||
            prevState.parentid !== workitemsEditForm.parentid
          }
          pointing={"left"}
          className={"workitems-edit-subcomponents-parent-selected"}
          text={
            workitemsEditForm.next
              ? trimName(getName(workitemsEditForm.next))
              : "none"
          }
        >
          <Dropdown.Menu className="workitems-edit-subcomponents-next-dropdown-menu">
            {list.length > 0 ? (
              <>
                {list.map((item) => (
                  <Dropdown.Item
                    data-cy="parent-next-swarm-row-dropdown-31099"
                    name={"next"}
                    key={"workitems-edit-next" + item.workitemid}
                    onClick={onChange}
                    value={item.workitemid}
                    text={trimName(item.name, 100)}
                  ></Dropdown.Item>
                ))}
                <Dropdown.Item
                  data-cy="parent-next-swarm-row-dropdown-61831"
                  name="next"
                  key={"workitems-edit-next_0"}
                  onClick={onChange}
                  value={
                    workitemid_Next_Null ? workitemid_Next_Null + "/" : "0/"
                  }
                  text={"none"}
                ></Dropdown.Item>
              </>
            ) : (
              <Dropdown.Item
                data-cy="parent-next-swarm-row-dropdown-45297"
                disabled
              >
                No Results Found
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    </div>
  );
};

export const ParentSelector = ({ tree, nodeMapWorkitemId, form }) => {
  const { workitemsEditForm, prevState, onChange } = form;
  const [selectorData, setSelectorData] = useState(null);

  useEffect(() => {
    if (selectorData) {
      const { name, value } = selectorData;
      onChange({}, { name, value });
    }
  }, [selectorData]);

  const getName = (workitemid) => {
    return nodeMapWorkitemId[workitemid]
      ? nodeMapWorkitemId[workitemid].name
      : "none";
  };

  const parentNodeId = nodeMapWorkitemId[workitemsEditForm.workitemid]
    ? nodeMapWorkitemId[workitemsEditForm.workitemid].parentid
    : "0";
  const parentNodeName = getName(parentNodeId);

  const dropdownOptions = (root) => {
    return (
      <Dropdown.Menu className="workitems-edit-subcomponents-parent-dropdown-menu">
        {root[0] && splitDots(root[0].id).length === 1 && (
          <Dropdown.Item
            data-cy="parent-next-swarm-row-dropdown-28192"
            text="none"
            key={"dropdownOptions_0"}
            name={"parentid"}
            onClick={(e, data) => {
              e.stopPropagation();
              onChange(e, data);
            }}
            value={"0"}
          ></Dropdown.Item>
        )}
        {root
          .filter((item) => item.workitemid !== workitemsEditForm.workitemid)
          .filter((item) => item.swarm === prevState.swarm)
          .map((item) =>
            item._children.length < 1 ? (
              <>
                <Dropdown.Item
                  data-cy="parent-next-swarm-row-dropdown-46427"
                  key={"workitems-edit-parent_A" + item.workitemid}
                  name={"parentid"}
                  onClick={(e, data) => {
                    setSelectorData(data);
                  }}
                  value={item.workitemid}
                  text={trimName(item.name, 100)}
                ></Dropdown.Item>
                {/* <Dropdown.Divider></Dropdown.Divider> */}
              </>
            ) : (
              <Dropdown
                basic
                item
                key={"workitems-edit-parent_B" + item.workitemid}
                pointing={"left"}
                text={trimName(item.name, 100)}
                name={"parentid"}
                onClick={(e, data) => {
                  e.stopPropagation();
                  onChange(e, data);
                }}
                value={item.workitemid}
                className="workitems-edit-subcomponents-parent"
              >
                {dropdownOptions(item._children)}
              </Dropdown>
            )
          )}
      </Dropdown.Menu>
    );
  };
  return (
    <div className="workitems-edit-subcomponents-parent-div">
      <div style={{ marginRight: "10px", minWidth: "50px" }}>Parent:</div>
      <Menu vertical>
        <Dropdown
          disabled={prevState.swarm !== workitemsEditForm.swarm}
          item
          pointing={"left"}
          key={"workitems-edit-parent-menu"}
          className={"workitems-edit-subcomponents-parent-selected"}
          text={trimName(
            workitemsEditForm.parentid
              ? getName(workitemsEditForm.parentid)
              : parentNodeName
          )}
        >
          {dropdownOptions(tree)}
        </Dropdown>
      </Menu>
    </div>
  );
};

export const SwarmSelector = ({ form, swarmsDropdownOptions }) => {
  return (
    <div className="workitems-edit-subcomponents-parent-div">
      <div style={{ marginRight: "10px", minWidth: "50px" }}>Swarm:</div>
      <SwarmSelectorDropdownView
        swarmid={form.workitemsEditForm.swarm}
        changeSwarm={form.onChange}
        options={swarmsDropdownOptions}
      />
    </div>
  );
};
