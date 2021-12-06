import React from 'react'

import { MyProfile } from './profile-view'

export default {
    title: 'Profile/profile',
    component: MyProfile,
}

const Template = (args) => <MyProfile {...args} />
export const Default = Template.bind({});
Default.args = {
    userName: "nick",
    firstName: "first",
    lastName: "last",
    location: "LA, CA, US",
    avatar: "https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
}
