import React from "react";

import { WorkItemTree } from './workitem-tree';

const data = [
  {
    title: 'hi',
    children: []
  },
  {
    title: 'hello'
  }
];

export default {
  title: 'components/LEGACY/Work Item Tree',
  component: WorkItemTree
}

const Template = args => {
  return <WorkItemTree {...args} />
}

export const Default = Template.bind({});
Default.args = {
}
