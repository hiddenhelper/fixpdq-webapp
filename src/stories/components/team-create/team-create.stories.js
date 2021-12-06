import React from 'react'

import {CreateNewTeamComponent} from './team-create-view'

export default {
    title: 'Teams/team-create',
    component: CreateNewTeamComponent,
}

const Template = (args) => <CreateNewTeamComponent {...args} />
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
    ],
    swarms: [
        {
            swarm_name:"swarm",
            swarm_description:"tagN",
            swarm_avatar:"",
        },
    ],
}
