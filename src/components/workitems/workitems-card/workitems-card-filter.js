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
import { WorkitemsCardFilterContext } from "../../../store/context";
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

export const WorkitemCardFilter = ({ workitems, allUsers, type, cards }) => {
  const { filter, filterCardActions } = useContext(WorkitemsCardFilterContext);
  return (
    <div className="fix_background_grey_shadow" {...css(styles.filterBar)}>
      <div className="displayFlex" style={{ justifyContent: "space-between" }}>
        <div className="displayFlex">
          {type === "workitem" ? (
            <WorkitemStatus
              workitems={workitems}
              filter={filter}
              filterCardActions={filterCardActions}
            />
          ) : (
            <ActionStatus
              filter={filter}
              filterCardActions={filterCardActions}
              cards={cards}
            />
          )}
        </div>

        <div className="displayFlex">
          {type === "workitem" ? (
            <>
              {/* Owner */}
              <ChooseForm
                workitems={workitems}
                allUsers={allUsers}
                filter={filter}
                filterCardActions={filterCardActions}
                type="owner"
              />
              {/* Creator */}
              <ChooseForm
                workitems={workitems}
                allUsers={allUsers}
                filter={filter}
                filterCardActions={filterCardActions}
                type="creator"
              />

              <div {...css(styles.splitDiv, styles.marginLR5)} />
              <ViewActions
                filter={filter}
                filterCardActions={filterCardActions}
              />
            </>
          ) : (
            <></>
          )}

          <div {...css(styles.splitDiv, styles.marginLR5)} />
          {/* priority */}
          <LevelBar
            filter={filter}
            filterCardActions={filterCardActions}
            type="priority"
          />
          <div {...css(styles.splitDiv, styles.marginLR5)} />
          {/* Due Date */}
          <DueDate filter={filter} filterCardActions={filterCardActions} />
        </div>
      </div>
    </div>
  );
};

const WorkitemStatus = ({ workitems, filter, filterCardActions }) => {
  const setFilter = (name, value) => {
    const values = filter[name].slice();
    if (!values.includes(value)) {
      values.push(value);
      filterCardActions(name, values);
    } else {
      filterCardActions(
        name,
        values.filter((item) => item !== value)
      );
    }
  };

  return (
    <>
      <div {...css(styles.marginLR5)} className="fix_menu_12">
        VIEW STATE
      </div>
      {WORKITEM_STATUS.filter((w) => w.value !== STATUS.DELETED).map(
        (w, index) => {
          return (
            <div
              onClick={() => setFilter("status", w.value)}
              {...css(
                styles.marginLR5,
                filter.status.includes(w.value)
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

const ActionStatus = ({ filter, filterCardActions, cards }) => {
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
    if (filter.viewActions && filter.viewActions.includes(value)) {
      filterCardActions(
        "viewActions",
        filter.viewActions.filter((v) => v !== value)
      );
    } else {
      const newValue = filter.viewActions || [];
      newValue.push(value);
      filterCardActions("viewActions", newValue);
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
              filter.viewActions.includes(action.id)
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
  filterCardActions,
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
        text: type,
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
      filterCardActions(type, "everyone");
    }
  };

  useEffect(() => {
    initDropdownOptions();
  }, [workitems, allUsers]);

  return (
    <Dropdown
      style={styles.marginR5}
      placeholder={`Select ${type}`}
      required
      name={type}
      onChange={(event, { name, value }) => {
        filterCardActions(name, value ? value : "everyone");
      }}
      value={filter[type]}
      search
      selection
      options={dropDownOptions}
    />
  );
};

const ViewActions = ({ filter, filterCardActions }) => {
  const handleChange = (value) => {
    if (filter.viewActions && filter.viewActions.includes(value)) {
      filterCardActions(
        "viewActions",
        filter.viewActions.filter((v) => v !== value)
      );
    } else {
      const newValue = filter.viewActions || [];
      newValue.push(value);
      filterCardActions("viewActions", newValue);
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
      filterCardActions("viewActions", []);
    } else {
      filterCardActions(
        "viewActions",
        [...WORKITEMS_ACTION_ICONS.map((w) => w.id), "none"],
      );
    }
  };

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
              checked={filter.viewActions?.includes(action.id)}
              onChange={() => {
                handleChange(action.id);
              }}
            />
          </div>
        );
      })}
      {/* none icon */}
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
          checked={filter.viewActions?.includes("none")}
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

const LevelBar = ({ filter, filterCardActions, type }) => {
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
                filter[type]?.includes(s.name)
                  ? "fix_icon_action_16"
                  : "fix_icon_action_grey2_16"
              }
              checked={filter[type]?.includes(s.name)}
              onChange={() => {
                if (filter[type]?.includes(s.name)) {
                  filterCardActions(
                    type,
                    filter[type].filter((v) => v !== s.name)
                  );
                } else {
                  const newValues = filter[type] || [];
                  newValues.push(s.name);
                  filterCardActions(type, newValues);
                }
              }}
            />
          </div>
        );
      })}
    </Popup>
  );
};

const DueDate = ({ filter, filterCardActions }) => {
  const handleChange = (value) => {
    if (filter.dueDate && filter.dueDate.includes(value)) {
      filterCardActions(
        "dueDate",
        filter.dueDate.filter((v) => v !== value)
      );
    } else {
      const newValue = filter.dueDate || [];
      newValue.push(value);
      filterCardActions("dueDate", newValue);
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
      filterCardActions("dueDate", []);
    } else {
      filterCardActions("dueDate", DUE_DATE);
    }
  };

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

export default WorkitemCardFilter;
