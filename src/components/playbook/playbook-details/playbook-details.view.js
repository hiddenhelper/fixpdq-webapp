/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "glamor";
import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Form, Grid, Image, Input } from "semantic-ui-react";
import { useWorkitemsEditModal } from "../../../hooks";
import { useWorkitemsTree } from "../../../hooks/use-workitems-tree";
import { WorkitemsNodesContext } from "../../../store/context";
import { FIX_THECOACH_BLACK_20 } from "../../../utils/static-images";
import { listToTree } from "../../../utils/workitems";
import { STATUS } from "../../workitems/workitems-definitions";
import WorkitemsEdit from "../../workitems/workitems-edit";
import { WorkItemList } from "../../workitems/workitems-list";
import { PlayBookDetailsCard } from "./playbook-details-card.view";
import { PlayBookDetailsFilterBar } from "./playbook-details-filter";

export const PlayBookDetailsView = ({
  playbook,
  index,
  refreshPlaybookWorkitem,
}) => {
  const {
    getAncestorId,
    getChildren,
    updateTitle,
    getPredecessor,
    getSuccessor,
    getLastChild,
    getDescendants,
    filter,
    getMap,
  } = useWorkitemsTree();

  const {
    workitemToEdit,
    openWorkitemEditModal,
    handleOpenWorkitemEditModal,
    handleCloseWorkitemEditModal,
  } = useWorkitemsEditModal();

  const [hoverVisible, setHoverVisible] = useState(true);
  const [checkedItems, setCheckedItems] = useState([]);

  const { nodesState, nodesActions } = useContext(WorkitemsNodesContext);

  const [playbookid, setPlaybookid] = useState(null);
  const [treeForPlaybook, setTreeForPlaybook] = useState([]);

  useEffect(() => {
    if (playbook) {
      setPlaybookid(playbook.playbookid);
      setTreeForPlaybook(
        listToTree(
          playbook.workitems.filter((w) => w.status !== STATUS.DELETED)
        )
      );
    }
  }, [playbook]);

  const onClickToggleExpand = (event, workitemid) => {
    if (!nodesState.expandedNodes.includes(workitemid)) {
      nodesActions.dispatchExpandNodes([workitemid]);
    } else {
      nodesActions.dispatchCollapseNode(workitemid);
    }
  };

  const handleItemSelect = (event, data) => {
    const nodeWithChildrenIds = [
      ...getChildren(getMap(treeForPlaybook).ids[data.id]),
      data.workitemid,
    ];

    if (!checkedItems.includes(data.workitemid)) {
      setCheckedItems([...checkedItems, ...nodeWithChildrenIds]);
    } else {
      const filtered = checkedItems.filter(
        (item) => !nodeWithChildrenIds.includes(item)
      );
      setCheckedItems(filtered);
    }
  };

  const onEditClick = (event, { id }) => {
    handleOpenWorkitemEditModal(id);
  };

  const closeWorkitemModal = () => {
    handleCloseWorkitemEditModal();
  };

  const onConversationClick = (event, params) => {};

  const handleItemDoubleClick = (id) => {
    handleOpenWorkitemEditModal(id);
  };

  const handleItemClick = (id) => {};

  return (
    <>
      {playbook && (
        <div>
          {/* Header */}
          <PlayBookDetailsHeader
            swarmname={playbook.swarmname}
            playbookname={playbook.playbookname}
          />

          {/* Card */}
          <PlayBookDetailsCard
            index={index}
            name={playbook.playbookname}
            description={playbook.playbookdescription}
          />

          {/* Filter Bar */}
          <PlayBookDetailsFilterBar />

          {/* WorkItem List */}
          <Form>
            <Grid verticalAlign={"top"}>
              <Grid.Row textAlign={"left"}>
                <Grid.Column width={10}></Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={8}>
                  <WorkItemList
                    data={treeForPlaybook}
                    params={{
                      onClickToggleExpand,
                      handleItemSelect,
                      onConversationClick,
                      onEditClick,
                      hoverVisible,
                      checkedItems,
                      getAncestorId,
                      updateTitle,
                      getPredecessor,
                      getSuccessor,
                      getLastChild,
                      filter,
                      nodeMap: getMap(treeForPlaybook).ids,
                      nodeMapWorkitemId: getMap(treeForPlaybook).workitemids,
                      playbookid,
                      handleItemDoubleClick,
                      handleItemClick,
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
          {workitemToEdit && (
            <WorkitemsEdit
              tree={treeForPlaybook}
              treeParams={{
                getLastChild,
                getPredecessor,
                getSuccessor,
                getDescendants,
                nodeMap: getMap(treeForPlaybook).ids,
                nodeMapWorkitemId: getMap(treeForPlaybook).workitemids,
              }}
              params={{
                workitemToEdit,
                openWorkitemEditModal,
                closeWorkitemModal,
              }}
              playbookid={playbook.playbookid}
              refreshPlaybookWorkitem={refreshPlaybookWorkitem}
            />
          )}
        </div>
      )}
    </>
  );
};

const PlayBookDetailsHeader = ({ swarmname, playbookname }) => {
  return (
    <div
      className="displayFlex marginBottom20"
      style={{ justifyContent: "space-between" }}
    >
      <Breadcrumb>
        <Breadcrumb.Section
          data-cy="playbook-details-view-button-20401"
          className="fix_menu_grey2_12"
        >
          My PlayBook
        </Breadcrumb.Section>
        <Breadcrumb.Divider
          icon="right chevron"
          className="fix_menu_grey2_12"
        />
        <Breadcrumb.Section
          data-cy="playbook-details-view-button-61697"
          className="fix_menu_grey2_12"
        >
          {swarmname}
        </Breadcrumb.Section>
        <Breadcrumb.Divider
          icon="right chevron"
          className="fix_menu_grey2_12"
        />
        <Breadcrumb.Section
          data-cy="playbook-details-view-button-72633"
          className="fix_menu_12 fix_border_yellow_2"
          {...css(styles.bottomBorder)}
        >
          {playbookname}
        </Breadcrumb.Section>
      </Breadcrumb>

      <div className="displayFlex">
        <Input icon="search" iconPosition="left" placeholder="SEARCH" />
        <Image
          src={FIX_THECOACH_BLACK_20}
          alt="img"
          width="40px"
          height="40px"
        />
      </div>
    </div>
  );
};

const styles = {
  bottomBorder: {
    borderWidth: "0px 0px 4px 0px",
    borderRadius: "0px",
  },
};
export default PlayBookDetailsView;
