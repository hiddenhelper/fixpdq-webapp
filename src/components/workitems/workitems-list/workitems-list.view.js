import {
  faCaretDown,
  faCaretRight,
  faCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "glamor";
import React, { memo } from "react";
import { Grid, List } from "semantic-ui-react";
import { AttributesBarGrid, ContextMenu, WorkItemName } from "./subcomponents";
import "./workitems-list.less";

export const WorkItem = ({ data, params, nodesState, allUsers }) => {
  return (
    <List.List className={"workitems-list-children "}>
      {data.map((item, index) => (
        <WorkItemListView
          data={[item]}
          params={params}
          key={`wi_${index}_${item.id}`}
          nodesState={nodesState}
          allUsers={allUsers}
        />
      ))}
    </List.List>
  );
};

export const WorkItemListView = memo(
  ({ data, params, nodesState, allUsers }) => {
    const styles = {
      row: {
        position: "absolute",
        left: "0",
        marginLeft: "20px",
        width: "75vw",
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      },
      rowChecked: {
        backgroundColor: "#EBFAE2",
        borderRadius: "7px",
        height: "36px",
      },
      title: {
        minHeight: "25px",
        cursor: "pointer",
      },
      inputField: {
        position: "relative",
        top: "-1px",
      },
      inputSelected: {
        "& > * > * > *": {
          backgroundColor: "#EBFAE2 !important",
        },
      },
      hoverBarStyle: {
        backgroundColor: "dimgray !important",
      },
    };

    const {
      handleItemSelect,
      onClickToggleExpand,
      onKeyDownInputBox,
      handleItemClick,
      handleItemDoubleClick,
      onBackwardClick,
      onForwardClick,
      onConversationClick,
      onEditClick,
      checkedItems,
      filter,
      itemBeingEdited,
      focusedWorkItem,
      playbookid,
      handleItemBlurEvent,
      removeWorkitem,
      onMoveWorkitemModalClick,
    } = params;

    const areVisible = (list) => {
      return list.some((item) => item.display);
    };

    return (
      <>
        <List>
          {data &&
            data
              .filter((item) => item.display)
              .map((item, index) => (
                <div key={`div_${item.id}_${index}`}>
                  {/* {`%*${item.display}*%: ** ci: ${item.checkIds} f: ${item.filterCondition} ad:${item.isAllChildrenDispaly} cv: ${item.areChildrenVisible} id: ${item.inIds}`} */}
                  <div
                    {...css(
                      styles.row,
                      checkedItems.includes(item.workitemid) &&
                        styles.rowChecked
                    )}
                  >
                    {item.workitemid && (
                      <div
                        style={{
                          backgroundColor: "green",
                          padding: "10px 0 15px 0",
                          position: "relative",
                          top: "-2px",
                        }}
                        checked={checkedItems.includes(item.workitemid)}
                        onChange={(event) => handleItemSelect(event, item)}
                      />
                    )}
                    {item.workitemid ? (
                      <AttributesBarGrid
                        playbookid={playbookid}
                        item={item}
                        filter={filter}
                        allUsers={allUsers}
                      />
                    ) : (
                      <div style={{ minHeight: "1em" }}></div>
                    )}
                  </div>
                  <List.Item className={"workItem"}>
                    <List.Content verticalAlign="middle">
                      <Grid
                        padded="vertically"
                        style={{
                          position: "relative",
                          top: "1px",
                        }}
                      >
                        <Grid.Row verticalAlign="middle" stretched>
                          <Grid.Column width={1}>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {item.workitemid === itemBeingEdited && (
                                <ContextMenu
                                  onBackwardClick={(e) => {
                                    onBackwardClick(e, {
                                      inputValue: item.name,
                                      playbookid,
                                      id: item.id,
                                      workitemid: item.workitemid,
                                    });
                                  }}
                                  onForwardClick={(e) => {
                                    onForwardClick(e, {
                                      inputValue: item.name,
                                      playbookid,
                                      id: item.id,
                                      workitemid: item.workitemid,
                                    });
                                  }}
                                  onConversationClick={onConversationClick}
                                  onEditClick={onEditClick}
                                  itemid={item.id}
                                  workitemid={item.workitemid}
                                  playbookid={playbookid}
                                  removeWorkitem={removeWorkitem}
                                  onMoveWorkitemModalClick={
                                    onMoveWorkitemModalClick
                                  }
                                />
                              )}
                              {item._children.length >= 1 &&
                              areVisible(item._children) ? (
                                <FontAwesomeIcon
                                  size="small"
                                  icon={
                                    nodesState.expandedNodes.includes(
                                      item.workitemid
                                    )
                                      ? faCaretDown
                                      : faCaretRight
                                  }
                                  onClick={(e) =>
                                    onClickToggleExpand(e, item.workitemid)
                                  }
                                />
                              ) : (
                                <FontAwesomeIcon size="xs" icon={faCircle} />
                              )}
                            </div>
                          </Grid.Column>
                          <Grid.Column width={10}>
                            <WorkItemName
                              onKeyDownInputBox={onKeyDownInputBox}
                              handleItemClick={handleItemClick}
                              handleItemDoubleClick={handleItemDoubleClick}
                              checkedItems={checkedItems}
                              item={item}
                              itemBeingEdited={itemBeingEdited}
                              isFocused={item.workitemid === focusedWorkItem}
                              handleItemBlurEvent={handleItemBlurEvent}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </List.Content>
                    {item._children &&
                      item._children.length >= 1 &&
                      nodesState.expandedNodes.includes(item.workitemid) &&
                      WorkItem({
                        data: item._children,
                        params,
                        nodesState,
                        allUsers,
                      })}
                  </List.Item>
                </div>
              ))}
        </List>
      </>
    );
  }
);
