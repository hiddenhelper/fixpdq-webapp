import React from 'react';

import { MyButton } from './button';

export default {
    title: 'controls/Button',
    component: MyButton
}

const Template = (args) => <MyButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    primary: true,
    label: 'OK'
};

export const Secondary = Template.bind({});
Secondary.args = {
  primary: false,
  label: 'OK'
};

