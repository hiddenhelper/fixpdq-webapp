import React from 'react'

import {WorkItemThreadModal} from './workitem-thread-modal'

export default {
    title: 'components/WorkItem Thread Modal',
    component: WorkItemThreadModal,
}

const Template = (args) => <WorkItemThreadModal {...args} />
export const Default = Template.bind({});
Default.args = {
    id: 0,
}
