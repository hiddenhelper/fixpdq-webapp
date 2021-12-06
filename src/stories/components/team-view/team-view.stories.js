import React from 'react'

import {MyTeamsItem} from './team-card-view'

export default {
    title: 'Teams/team-card-view',
    component: MyTeamsItem,
}

const Template = (args) => <MyTeamsItem {...args} />
export const Default = Template.bind({});
Default.args = {
    id: "0",
    team_name: "team1",
    purpose: "why team1... write team purpose, description here",
    members: [
        {
            member_name: "member1",
            member_role: "Owner",
            member_email: "member1@test.com",
            member_avatar: "avatar_url",
            member_position: "project manager",
        },
        {
            member_name: "member2",
            member_role: "Member",
            member_email: "member1@test.com",
            member_avatar: "avatar_url",
            member_position: "designer",
        },
        {
            member_name: "member3",
            member_role: "Member",
            member_email: "member1@test.com",
            member_avatar: "avatar_url",
            member_position: "3D animator",
        },
        {
            member_name: "member4",
            member_role: "Member",
            member_email: "member1@test.com",
            member_avatar: "avatar_url",
            member_position: "developer",
        },
        {
            member_name: "member5",
            member_role: "Admin",
            member_email: "member1@test.com",
            member_avatar: "avatar_url",
            member_position: "developer",
        },
        {
            member_name: "member6",
            member_role: "Admin",
            member_email: "member1@test.com",
            member_avatar: "avatar_url",
            member_position: "developer",
        },
        {
            member_name: "member6",
            member_role: "Invited",
            member_email: "member1@test.com",
            member_avatar: "avatar_url",
            member_position: "developer",
        },
        {
            member_name: "member7",
            member_role: "Invited",
            member_email: "member1@test.com",
            member_avatar: "avatar_url",
            member_position: "developer",
        },
        {
            member_name: "member8",
            member_role: "Invited",
            member_email: "member1@test.com",
            member_avatar: "avatar_url",
            member_position: "developer",
        },
    ],
    swarms: [
        {
            swarm_name:"swarm",
            swarm_description:"tagN",
            swarm_avatar:"",
        },
        {
            swarm_name:"swarm_2",
            swarm_description:"tagN",
            swarm_avatar:"",
        },
        {
            swarm_name:"swarm_3",
            swarm_description:"tagN",
            swarm_avatar:"",
        },
        {
            swarm_name:"swarm_4456456546",
            swarm_description:"tagN",
            swarm_avatar:"",
        },
    ],
}