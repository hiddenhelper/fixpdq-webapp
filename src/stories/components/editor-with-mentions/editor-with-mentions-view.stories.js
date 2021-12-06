import React from "react";
import SimpleMentionEditor from "./editor-with-mentions";

export default {
  title: "EditorWitMentions/editor-with-mentions",
  component: SimpleMentionEditor,
};

const Template = (args) => <SimpleMentionEditor {...args} />;
export const Default = Template.bind({});
Default.args = {};
