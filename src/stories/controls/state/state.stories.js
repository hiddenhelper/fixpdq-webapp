import React from 'react';

import { ButtonState } from './state';

export default {
  title: 'controls/State'
}

const Template = args => <ButtonState {...args} />

export const Active = Template.bind({});
Active.args = {
  label: 'Active',
  color: 'olive',
  icon: 'pause circle'
}

export const OnHold = Template.bind({});
OnHold.args = {
  label: 'On Hold',
  color: 'blue',
  icon: 'play circle'
}

export const Open = Template.bind({});
Open.args = {
  label: 'Open',
  color: 'grey',
  icon: 'play circle'
}

export const Review = Template.bind({});
Review.args = {
  label: 'Review',
  color: 'orange',
  icon: 'step backward'
}

export const Done = Template.bind({});
Done.args = {
  label: 'Done',
  color: 'green',
  icon: 'stop circle'
}

export const ReOpen = Template.bind({});
ReOpen.args = {
  label: 'ReOpen',
  color: 'red',
  icon: 'undo'
}
