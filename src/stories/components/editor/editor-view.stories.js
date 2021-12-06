import React from "react";
import { DraftEditor } from "./editor-view";

export default {
  title: "Editor/editor",
  component: DraftEditor,
};

const Template = (args) => <DraftEditor {...args} />;
export const Default = Template.bind({});
Default.args = {};
