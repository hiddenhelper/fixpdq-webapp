import React from 'react';

import {WorkItemComponent as WorkItem} from '../../../components/workitems/workitems';

export default  {
  title: 'components/LEGACY/WorkItem',
  component: WorkItem
}

const Template = args => {
  return <WorkItem {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  label: "hi from storybook"
}
