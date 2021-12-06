import React from "react";

import { PlayBookDetails } from "./playbook-details.view";

export default {
  title: "playbook/PlayBookDetails",
  component: PlayBookDetails,
};

const Template = (args) => <PlayBookDetails {...args} />;
export const Default = Template.bind({});
Default.args = {
  cardType: 0,
  name: "PlayBook Name here",
  description: "Description here. Explain why the  playbook exists",
};
