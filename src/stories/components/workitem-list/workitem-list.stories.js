/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { WorkItemListView } from "../../../components/workitems/workitems-list/workitems-list.view";
import { useWorkitemsTree } from "../../../hooks/use-workitems-tree";
import { listToTree, traverseFromRoot } from "../../../utils/workitems";
import * as MOCK_WORKITEMS_LIST from "./workitems-list-mock.json";

const WorkItemListStory = ({ workitemsList, params, ...props }) => {
  const { getTree, setTree } = useWorkitemsTree();
  const [ expandedNodes, setExpandedNodes ] = useState([]);

  useEffect(() => {
    const root = listToTree(workitemsList);
    traverseFromRoot({root, cb: (node) => {
      setExpandedNodes(expandedNodes => ([...expandedNodes, node.workitemid]));
    }});
    setTree(root);
  }, []);

  return (
    <>
      <WorkItemListView
        data={getTree()}
        params={params}
        nodesState={{ expandedNodes }}
      />
      {/* {JSON.stringify(getTree())} */}
    </>
  );
};

const Template = (args) => {
  return <WorkItemListStory {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  workitemsList: MOCK_WORKITEMS_LIST.items,
  params: {
    onChangeInputBox: () => {},
    onKeyDownInputBox: () => {},
    onClickToggleExpand: () => {},
    handleItemSelect: () => {},
    handleItemClick: () => {},
    onBackwardClick: () => {},
    onForwardClick: () => {},
    checkedItems: [],
    filter: {
      status: [],
      ownerId: false,
      checkAll: false,
    },
  },
};

export default {
  title: "components/WORKITEMS/Work Items List",
  component: WorkItemListStory,
};
