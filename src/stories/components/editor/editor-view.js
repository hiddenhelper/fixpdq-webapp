import { EditorState } from "draft-js";
// import { stateToHTML } from "draft-js-export-html";
import { css } from "glamor";
import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { Button } from "semantic-ui-react";
import "./react-draft-wysiwyg.css";

export const DraftEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [showToolbar, setShowToolbar] = useState(false);

  const uploadImageCallback = (file) => {
    console.log(file);
  };

  const toolbarVisible = (showToolbar) => {
    return showToolbar ? "show-toolbar" : "hide-toolbar";
  };

  const onChange = () => {
    // const html = stateToHTML(contentState, opts);
    // setHtmlState(html);
    // console.log(html);
  };

  const styles = {
    container: {
      position: "relative",
      border: "1px solid lightgrey",
    },
    showToolbarButton: {
      position: "absolute",
      top: "-10px",
      left: "95%",
      zIndex: "10000",
    },
  };

  return (
    <>
      {/* <div dangerouslySetInnerHTML={{ __html: htmlState }}></div> */}
      {/* <div>
        <Editor
          editorState={editorState}
          readOnly={true}
          toolbarClassName={"hide-toolbar"}
        />
      </div> */}
      <div {...css(styles.container)}>
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          toolbarClassName={toolbarVisible(showToolbar)}
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: true },
            image: {
              uploadCallback: uploadImageCallback,
              alt: { present: true, mandatory: true },
            },
          }}
          onChange={onChange}
        />

        <div {...css(styles.showToolbarButton)}>
          <Button
            icon="edit"
            color={showToolbar ? "black" : "grey"}
            onClick={() => setShowToolbar(!showToolbar)}
          />
        </div>
      </div>
    </>
  );
};
