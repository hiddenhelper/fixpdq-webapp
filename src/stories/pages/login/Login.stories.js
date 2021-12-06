import React from 'react';

import { Login } from './Login';

export default {
    title: 'pages/Login',
    component: Login
}

const Template = (args) => <Login {...args} />;

export const SignIn = Template.bind({});
