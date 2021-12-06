import React from "react";

import WorkitemsFilter from "../../../components/workitems/workitems-filter/workitems-filter";

const WorkitemsFilterStory = ({ params, ...props }) => {
  return (
    <>
      <WorkitemsFilter params={params} />
    </>
  );
};

const Template = (args) => {
  return <WorkitemsFilterStory {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  params: {
    handleCheckAll: () => {},
    handleExpand: () => {},
    handleFilterSelect: () => {},
    handleFilterToggle: () => {},
    filter: {
      status: ["DONE", "OPEN", "REVIEW", "RE_OPEN", "ON_HOLD", "ACTIVE"],
      ownerId: true,
      checkAll: true,
    },
  },
};

export default {
  title: "components/WORKITEMS/Work Items Filter",
  component: WorkitemsFilterStory,
};
