import React, { useState } from 'react';

import { WorkItem } from './workitem';

const defaultWorkItem = { id: 4, title: 'Improve UI', owner: 'Emma', parent: '', predecessor: '', dueDate: '', priority: '', stateLabel: 'Not Started', stateColor: 'grey'};

const emptyWorkItem = [];
const defaultWorkItems = [
  { id: 1, title: 'Research Homepages', owner: 'Richard', parent: '', predecessor: '', dueDate: '', priority: '', stateLabel: 'In Progress', stateColor: 'olive'},
  { id: 2, title: 'Pricing', owner: 'Al', parent: '', predecessor: '', dueDate: '', priority: '', stateLabel: 'On Hold', stateColor: 'blue'},
  { id: 3, title: 'Written Content', owner: 'Sol', parent: '', predecessor: '', dueDate: '', priority: '', stateLabel: 'On Hold', stateColor: 'blue',
    subItems: [
      { id: 1, title: 'Task 1' },
      { id: 2, title: 'Task 2' },
      { id: 3, title: 'Task 3' },
      { id: 4, title: 'Task 4' },
      { id: 5, title: 'Task 5' },
    ]
  },
  { id: 4, title: 'Signup Page', owner: 'Emma', parent: '', predecessor: '', dueDate: '', priority: '', stateLabel: 'Not Started', stateColor: 'grey'},
  { id: 5, title: 'Backlog', owner: 'Rommel', parent: '', predecessor: '', dueDate: '', priority: '', stateLabel: 'Not Started', stateColor: 'grey'},
];

export default {
    title: 'components/LEGACY/WorkItemMockup',
    component: WorkItem
}

const Template = args => {
  return <WorkItem {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  onClick: () => {
    console.log('default button clicked')
  },
  workItems: [],
  data: defaultWorkItem
}

export const withSingleItem = Template.bind({});
withSingleItem.args = {
  onClick: () => {
    console.log('withSingleItem button clicked')
  },
  workItems: defaultWorkItems[0],
  data: defaultWorkItems[0]
}

export const withSubItems = Template.bind({});
withSubItems.args = {
  onClick: () => { console.log('with sub items button clicked')},
  workItems: defaultWorkItems,
}
