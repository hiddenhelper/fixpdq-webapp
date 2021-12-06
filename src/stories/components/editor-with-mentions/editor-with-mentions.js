import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "./SimpleMentionEditor.module.css";
/**
 * Default trigger is '@' and default separator between words is ' '.
 * thus there fields are optional.
 */
const Mention = () => (
  <div className="rdw-storybook-root">
    <span>Type @ to see suggestions</span>
    <Editor
      mention={{
        separator: " ",
        trigger: "@",
        suggestions: [
          { text: "APPLE", value: "apple", url: "apple" },
          { text: "BANANA", value: "banana", url: "banana" },
          { text: "CHERRY", value: "cherry", url: "cherry" },
          { text: "DURIAN", value: "durian", url: "durian" },
          { text: "EGGFRUIT", value: "eggfruit", url: "eggfruit" },
          { text: "FIG", value: "fig", url: "fig" },
          { text: "GRAPEFRUIT", value: "grapefruit", url: "grapefruit" },
          { text: "HONEYDEW", value: "honeydew", url: "honeydew" },
        ],
      }}
      toolbarClassName="rdw-storybook-toolbar"
      wrapperClassName="rdw-storybook-wrapper"
      editorClassName="rdw-storybook-editor"
      toolbar={{
        inline: { inDropdown: true },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: true },
      }}
    />
  </div>
);

export default Mention;
