import React from 'react'

import {SwarmCardItem} from './swarms-card-view'

export default {
    title: 'swarms/swarms-card',
    component: SwarmCardItem,
}

const Template = (args) => <SwarmCardItem {...args} />
export const Default = Template.bind({});
Default.args = {
    name: 'Swarm name here....',
    description: 'Description here....',
    creator: 'ABCD',
    deadline: '20 Oct 2020',
    progress: '80',
};