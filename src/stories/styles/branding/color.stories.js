import React from 'react';

import { Label } from './color'

export default {
  title: 'Style/Color'
}

const Template = args => <Label {...args} />

export const Red = Template.bind({});
Red.args = {
  label: 'I am Red',
  color: 'red'
}

export const Green = Template.bind({});
Green.args = {
  label: 'I am Green',
  color: 'green'
}

export const Olive = Template.bind({});
Olive.args = {
  label: 'I am Olive',
  color: 'olive'
}


