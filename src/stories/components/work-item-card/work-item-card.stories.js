import React from 'react'

import {CardItem} from './work-item-card'

export default {
    title: 'CARD/work-item-card',
    component: CardItem,
}

const Template = (args) => <CardItem {...args} />
export const Default = Template.bind({});
Default.args = {
    name: 'work item here',
    creator: 'AAA',
    priority: 'MEDIUM',
    difficulty: 'HIGH',
    status: 'ACTIVE',
    date_due: '20 Oct 2020',
    description: '*priority input:(LOW, MEDIUM, HIGH, INSANE)*, *difficulty input:(LOW, MEDIUM, HIGH, INSANE)*, *status input:(ACTIVE, ON_HOLD, REVIEW, OPEN, DONE)*,',
};