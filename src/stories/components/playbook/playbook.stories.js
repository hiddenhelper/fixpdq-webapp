import React from "react";

import { PlayBook } from "./playbook";

export default {
  title: "playbook/playbook",
  component: PlayBook,
};

const Template = (args) => <PlayBook {...args} />;
export const Default = Template.bind({});
Default.args = {
  cardType: 0,
  name: "PlayBook Name here",
  description: "Description here. Explain why the  playbook exists",
};
