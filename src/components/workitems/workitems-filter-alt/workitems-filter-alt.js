import { css } from "glamor";
import React, { useContext, useEffect, useState } from "react";
import { Checkbox, Dropdown, Icon, Popup, Image } from "semantic-ui-react";
import {
  WORKITEM_STATUS,
  STATUS,
  PRIORITY_DIFFICULTY_STATUS,
  DUE_DATE,
  WORKITEMS_ACTION_ICONS,
  ACTION,
} from "../workitems-definitions";
import { WorkitemsFilterContext } from "../../../store/context";
import { default_avatar } from "../../../utils/static-images";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faCalendarExclamation,
  faTachometerAltFast,
  faSignature,
  faVacuum,
  faKeynote,
  faHandshakeAlt,
  faQuestion,
  faTimes,
} from "@fortawesome/pro-solid-svg-icons";

export const WorkitemsFilterAlt = ({
  workitems,
  allUsers,
  type,
  cards,
  handleFilterSelect,
}) => {
  const { filter, filterActions } = useContext(WorkitemsFilterContext);

  // useEffect(() => {
  //   console.log('S1 Filter:', filter);
  // },[filter])

  const {
    dispatchDeselect,
    dispatchSelect,
    dispatchSetProperty,
    dispatchToggle,
  } = filterActions;

  const setProperties = ({ active, display, selection, slice }) => {
    dispatchSetProperty({
      slice,
      property: "active",
      value: active,
    });
    dispatchSetProperty({
      slice,
      property: "display",
      value: display,
    });
    dispatchSetProperty({
      slice,
      property: "selection",
      value: selection,
    });
  };

  return (
    <div className="fix_background_grey_shadow" {...css(styles.filterBar)}>
      <div className="displayFlex" style={{ justifyContent: "space-between" }}>
        <div className="displayFlex">
          <WorkitemStatus
            workitems={workitems}
            filter={filter}
            filterActions={filterActions}
            handleFilterSelect={handleFilterSelect}
          />
        </div>

        <div className="displayFlex">
          {/* Owner */}
          <ChooseForm
            workitems={workitems}
            allUsers={allUsers}
            filter={filter}
            filterActions={filterActions}
            type="ownerid"
            setProperties={setProperties}
            dispatchDeselect={dispatchDeselect}
            dispatchSelect={dispatchSelect}
          />
          {/* Creator */}
          <ChooseForm
            workitems={workitems}
            allUsers={allUsers}
            filter={filter}
            filterActions={filterActions}
            type="creatorid"
            setProperties={setProperties}
            dispatchDeselect={dispatchDeselect}
            dispatchSelect={dispatchSelect}
          />

          <div {...css(styles.splitDiv, styles.marginLR5)} />
          <ViewActions
            filter={filter}
            filterActions={filterActions}
            handleFilterSelect={handleFilterSelect}
          />

          <div {...css(styles.splitDiv, styles.marginLR5)} />
          {/* priority */}
          <LevelBar
            filter={filter}
            filterActions={filterActions}
            dispatchSelect={dispatchSelect}
            dispatchDeselect={dispatchDeselect}
            handleFilterSelect={handleFilterSelect}
            type="priority"
          />
          <div {...css(styles.splitDiv, styles.marginLR5)} />
          {/* Due Date */}
          <DueDate filter={filter} filterActions={filterActions} />
        </div>
      </div>
    </div>
  );
};

const WorkitemStatus = ({
  workitems,
  filter,
  filterActions,
  handleFilterSelect,
}) => {
  return (
    <>
      <div {...css(styles.marginLR5)} className="fix_menu_12">
        VIEW STATE
      </div>
      {WORKITEM_STATUS.filter((w) => w.value !== STATUS.DELETED).map(
        (w, index) => {
          return (
            <div
              onClick={() => handleFilterSelect(w.value, "status")}
              {...css(
                styles.marginLR5,
                filter.status.values.includes(w.value)
                  ? styles.statusBtnClicked
                  : styles.statusBtnNonClicked
              )}
              className="displayFlex"
              key={index}
            >
              <Image src={w.src_c} style={{ marginRight: "8px" }} />
              <label className="fix_title_12">
                {
                  workitems.filter((workitem) => workitem.status === w.value)
                    .length
                }
              </label>
            </div>
          );
        }
      )}
    </>
  );
};

const ActionStatus = ({ filter, handleFilterSelect, cards }) => {
  const [countOfActions, setCountOfActions] = useState();

  useEffect(() => {
    const getNumberOfActions = () => {
      let values = {};
      if (cards && cards.length > 0) {
        cards.forEach((card) => {
          card.actions.forEach((action) => {
            values[action.actionType] = (values[action.actionType] || 0) + 1;
          });

          values["question"] =
            (values["question"] || 0) + card.conversations.length;
        });
        setCountOfActions(values);
      } else {
        setCountOfActions(null);
      }
    };

    getNumberOfActions();
  }, [cards]);

  const handleChange = (value) => {
    if (filter.viewActions && filter.viewActions.values.includes(value)) {
      handleFilterSelect(
        filter.viewActions.values.filter((v) => v !== value),
        "viewActions"
      );
    } else {
      const newValue = filter.viewActions.values || [];
      newValue.push(value);
      handleFilterSelect(newValue, "viewActions");
    }
  };

  return (
    <>
      <div {...css(styles.marginLR5)} className="fix_menu_12">
        VIEW ACTIONS
      </div>
      {WORKITEMS_ACTION_ICONS.map((action, index) => {
        return (
          <div
            onClick={() => {
              handleChange(action.id);
            }}
            {...css(
              styles.marginLR5,
              filter.viewActions &&
                filter.viewActions.values.includes(action.id)
                ? styles.statusBtnClicked
                : styles.statusBtnNonClicked
            )}
            className="displayFlex"
            key={index}
          >
            <FontAwesomeIcon
              icon={generateActionIcon(action.id)}
              style={{ marginRight: "8px" }}
              className="fix_icon_bar_10"
            />
            <label className="fix_title_12">
              {(countOfActions && countOfActions[action.id]) || 0}
            </label>
          </div>
        );
      })}
    </>
  );
};

const ChooseForm = ({
  workitems,
  allUsers,
  filter,
  setProperties,
  dispatchDeselect,
  dispatchSelect,
  filterActions,
  type,
}) => {
  const [dropDownOptions, setDropDownOptions] = useState([]);

  const initDropdownOptions = () => {
    const idList = workitems.map((workitem) => {
      if (type === "owner") {
        return workitem.ownerid ? workitem.ownerid : "";
      }
      return workitem.creatorid ? workitem.creatorid : "";
    });
    const uniqueIdList = idList
      .filter((value, index) => idList.indexOf(value) === index)
      .filter((value) => value !== "");
    const usersList = [
      {
        key: "everyone",
        value: "everyone",
        text: type.replace("id", ""),
        image: {
          avatar: true,
          src: default_avatar,
        },
      },
    ];
    uniqueIdList.forEach((id) => {
      const item = {
        key: id,
        value: id,
        text: allUsers
          .find((a) => a.Username === id)
          ?.Attributes.find((s) => s.Name === "email")?.Value,
        image: {
          avatar: true,
          src: allUsers
            .find((a) => a.Username === id)
            ?.Attributes.find((s) => s.Name === "picture")?.Value
            ? allUsers
                .find((a) => a.Username === id)
                ?.Attributes.find((s) => s.Name === "picture")?.Value
            : default_avatar,
        },
      };
      usersList.push(item);
    });

    setDropDownOptions(usersList);
    if (!usersList.find((u) => u.value === filter[type])) {
      setProperties({
        active: false,
        display: true,
        selection: "everyone",
        slice: type,
      });
      dispatchDeselect({ slice: type });
    }
  };

  useEffect(() => {
    initDropdownOptions();
  }, [workitems, allUsers]);

  return (
    <Dropdown
      style={styles.marginR5}
      placeholder={`Select ${type.replace("id", "")}`}
      required
      name={type}
      onChange={(event, { name, value }) => {
        console.log("Value:", value);
        console.log("Type:", type);
        setProperties({
          active: value === "everyone" ? false : true,
          display: true,
          selection: value,
          slice: type,
        });
        if (value === "everyone") {
          dispatchDeselect({ slice: type });
        } else {
          dispatchSelect({ slice: type, values: [value] });
        }
      }}
      value={filter[type].selection}
      search
      selection
      options={dropDownOptions}
    />
  );
};

const ViewActions = ({ filter, filterActions, handleFilterSelect }) => {
  const handleChange = (value) => {
    if (filter.viewActions && filter.viewActions.includes(value)) {
      filterActions.dispatchToggle({
        slice: "viewActions",
        value: filter.viewActions.filter((v) => v !== value),
      });
    } else {
      const newValue = (filter.viewActions && filter.viewActions) || [];
      newValue.push(value);
      filterActions.dispatchToggle({
        slice: "viewActions",
        value: newValue,
      });
    }
  };

  const isAllSelected = () => {
    let flag = true;
    if (filter.viewActions) {
      WORKITEMS_ACTION_ICONS.forEach((action) => {
        if (!filter.viewActions.includes(action.id)) {
          flag = false;
        }
      });
      if (!filter.viewActions.includes("none")) {
        flag = false;
      }
    } else {
      flag = false;
    }
    return flag;
  };

  const handleSelectAllClick = () => {
    if (isAllSelected()) {
      filterActions.dispatchToggle({
        slice: "viewActions",
        value: [],
      });
    } else {
      filterActions.dispatchToggle({
        slice: "viewActions",
        value: [...WORKITEMS_ACTION_ICONS.map((w) => w.id), "none"],
      });
    }
  };

  // return (
  //   <div style={{ cursor: "pointer" }}>
  //     <span style={{ marginRight: "5px", color: '#e0e0e0' }} className="fix_menu_12">
  //       VIEW ACTIONS
  //     </span>
  //     <Icon name="caret down" style={{ color: '#e0e0e0' }} className="fix_icon_sort_down_8" />
  //   </div>
  // )
  return (
    <Popup
      flowing
      pinned
      on="click"
      trigger={
        <div style={{ cursor: "pointer" }}>
          <span style={{ marginRight: "5px" }} className="fix_menu_12">
            VIEW ACTIONS
          </span>
          <Icon name="caret down" className="fix_icon_sort_down_8" />
        </div>
      }
      position="bottom left"
    >
      {WORKITEMS_ACTION_ICONS.map((action, index) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
            key={index}
          >
            <div className="displayFlex">
              <div style={{ width: "20px" }}>
                <FontAwesomeIcon
                  icon={generateActionIcon(action.id)}
                  className={action.color}
                />
              </div>
              <label style={{ marginRight: "30px" }} className="fix_body2_10">
                {action.text}
              </label>
            </div>
            <Checkbox
              checked={
                filter.viewActions && filter.viewActions.includes(action.id)
              }
              onChange={() => {
                handleChange(action.id);
              }}
            />
          </div>
        );
      })}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div className="displayFlex">
          <div style={{ width: "20px" }}>
            <FontAwesomeIcon
              icon={faTimes}
              className="fix_icon_action_red_10"
            />
          </div>
          <label style={{ marginRight: "30px" }} className="fix_body2_10">
            None
          </label>
        </div>
        <Checkbox
          checked={filter.viewActions && filter.viewActions.includes("none")}
          onChange={() => {
            handleChange("none");
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
        onClick={() => {
          handleSelectAllClick();
        }}
      >
        <label className="fix_menu_12">
          {isAllSelected() ? "UNSELECT ALL" : "SELECT ALL"}
        </label>
      </div>
    </Popup>
  );
};

const LevelBar = ({
  filter,
  filterActions,
  type,
  dispatchDeselect,
  dispatchSelect,
  handleFilterSelect,
}) => {
  const show_Priority_Difficulty = (type, value) => {
    const num =
      PRIORITY_DIFFICULTY_STATUS.find((s) => s.name === value)?.value || 0;

    return PRIORITY_DIFFICULTY_STATUS.map((s, index) => {
      if (index <= num) {
        return (
          <FontAwesomeIcon
            icon={type === "priority" ? faFlag : faTachometerAltFast}
            className={
              PRIORITY_DIFFICULTY_STATUS.find((s) => s.name === value)
                ?.color_card
            }
            style={{ marginRight: "5px" }}
            key={index}
          />
        );
      }
      return (
        <FontAwesomeIcon
          icon={type === "priority" ? faFlag : faTachometerAltFast}
          className="fix_icon_action_grey1_10"
          style={{ marginRight: "5px" }}
          key={index}
        />
      );
    });
  };

  return (
    <Popup
      flowing
      pinned
      on="click"
      trigger={
        <div style={{ cursor: "pointer" }}>
          <FontAwesomeIcon
            icon={faFlag}
            className="fix_icon_bar_10"
            style={{ marginRight: "5px" }}
          />
          <span style={{ marginRight: "5px" }} className="fix_menu_12">
            WORK ITEM PRIORITY
          </span>
          <Icon name="caret down" className="fix_icon_sort_down_8" />
        </div>
      }
      position="bottom left"
    >
      {PRIORITY_DIFFICULTY_STATUS.map((s, index) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: `${
                index < PRIORITY_DIFFICULTY_STATUS.length - 1 ? "10px" : "5px"
              }`,
            }}
            key={index}
          >
            <div>
              {show_Priority_Difficulty("priority", s.name)}
              <label style={{ marginRight: "10px" }} className="fix_body2_10">
                {s.name}
              </label>
            </div>

            <Checkbox
              className={
                filter[type] === s.name
                  ? "fix_icon_action_16"
                  : "fix_icon_action_grey2_16"
              }
              checked={filter[type].values.includes(s.name)}
              onChange={() => {
                handleFilterSelect(s.name, type);
              }}
            />
          </div>
        );
      })}
    </Popup>
  );
};

const DueDate = ({ filter, filterActions }) => {
  const handleChange = (value) => {
    if (filter.dueDate && filter.dueDate.includes(value)) {
      filterActions.dispatchToggle({
        slice: "dueDate",
        value: filter.dueDate.filter((v) => v !== value),
      });
    } else {
      const newValue = filter.dueDate || [];
      newValue.push(value);
      filterActions.dispatchToggle({
        slice: "dueDate",
        value: newValue,
      });
    }
  };

  const isAllSelected = () => {
    let flag = true;
    if (filter.dueDate) {
      DUE_DATE.forEach((date) => {
        if (!filter.dueDate.includes(date)) {
          flag = false;
        }
      });
    } else {
      flag = false;
    }
    return flag;
  };

  const handleSelectAllClick = () => {
    if (isAllSelected()) {
      filterActions.dispatchToggle({
        slice: "dueDate",
        value: [],
      });
    } else {
      filterActions.dispatchToggle({
        slice: "dueDate",
        value: DUE_DATE,
      });
    }
  };

  // return (
  //   <div style={{ cursor: "pointer" }}>
  //     <FontAwesomeIcon
  //       icon={faCalendarExclamation}
  //       style={{ marginRight: "5px", color: '#e0e0e0' }}
  //       className="fix_icon_bar_10"
  //     />
  //     <label style={{ marginRight: "5px", color: '#e0e0e0' }} className="fix_menu_12">
  //       DUE DATE
  //     </label>
  //     <Icon name="caret down" style={{ color: '#e0e0e0' }} className="fix_icon_sort_down_8" />
  //   </div>
  // );
  return (
    <Popup
      flowing
      pinned
      on="click"
      trigger={
        <div style={{ cursor: "pointer" }}>
          <FontAwesomeIcon
            icon={faCalendarExclamation}
            style={{ marginRight: "5px" }}
            className="fix_icon_bar_10"
          />
          <label style={{ marginRight: "5px" }} className="fix_menu_12">
            DUE DATE
          </label>
          <Icon name="caret down" className="fix_icon_sort_down_8" />
        </div>
      }
      position="bottom left"
    >
      {DUE_DATE.map((value, index) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
            key={index}
          >
            <div>
              <FontAwesomeIcon
                icon={faCalendarExclamation}
                className={
                  index === 0 ? "fix_icon_action_red_10" : "fix_icon_bar_10"
                }
                style={{ marginRight: "5px" }}
              />
              <label style={{ marginRight: "30px" }} className="fix_body2_10">
                {value}
              </label>
            </div>
            <Checkbox
              checked={filter.dueDate?.includes(value)}
              onChange={() => {
                handleChange(value);
              }}
            />
          </div>
        );
      })}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
        onClick={() => {
          handleSelectAllClick();
        }}
      >
        <label className="fix_menu_12">
          {isAllSelected() ? "UNSELECT ALL" : "SELECT ALL"}
        </label>
      </div>
    </Popup>
  );
};

const generateActionIcon = (id) => {
  switch (id) {
    case ACTION.ASSIGN:
      return faSignature;
    case ACTION.REQUEST_REVIEW:
      return faKeynote;
    case "collaboration":
      return faHandshakeAlt;
    case "housekeeping":
      return faVacuum;
    case "question":
      return faQuestion;
    default:
      break;
  }
};

const styles = {
  filterBar: {
    marginBottom: "20px",
    borderRadius: "8px",
    padding: "10px",
  },
  splitDiv: {
    width: "2px",
    height: "35px",
    backgroundColor: "rgb(210,210,210)",
  },
  statusBtnClicked: {
    backgroundColor: "white",
    padding: "3px 7px",
    borderRadius: "8px",
  },
  statusBtnNonClicked: {
    backgroundColor: "none",
    padding: "5px 10px",
    borderRadius: "8px",
  },
  marginLR5: {
    marginLeft: "5px",
    marginRight: "5px",
  },
  marginR5: {
    marginRight: "5px",
  },
};

export default WorkitemsFilterAlt;
