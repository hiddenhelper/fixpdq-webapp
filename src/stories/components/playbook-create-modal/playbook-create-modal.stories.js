import React from "react";

import { PlayBookCreateModal } from "./playbook-create-modal";

export default {
  title: "playbook/playbook-create-modal",
  component: PlayBookCreateModal,
};

const Template = (args) => <PlayBookCreateModal {...args} />;
export const Default = Template.bind({});
Default.args = {};
