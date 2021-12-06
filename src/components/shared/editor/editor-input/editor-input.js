// import { stateToHTML } from "draft-js-export-html";
import { css } from "glamor";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "../react-draft-wysiwyg.css";
import "./editor-input.css";

export const EditorInput = ({ state, handlers, placeholder, height }) => {
  const { content, setContent, minHeight, showToolbar, setShowToolbar } = state;
  const {
    onKeyDown,
    handleChange,
    handleBeforeInput,
    getMentionSuggestions,
    uploadImage,
  } = handlers;

  const uploadImageCallback = async (file) => {
    const link = await uploadImage(file);
    return { data: { link } };
  };

  const toolbarVisible = (showToolbar) => {
    return showToolbar ? "show-toolbar" : "hide-toolbar";
  };

  const styles = {
    wrapper: {
      position: "relative",
    },
    container: {
      borderRadius: "8px",
      width: "100%",
      minHeight,
      maxHeight: height,
      height,
      "overflow-y": "scroll",
    },
    showToolbarButton: {
      position: "absolute",
      top: "-5px",
      left: "95%",
      zIndex: "10000",
    },
    padding10: {
      padding: "10px",
    },
  };

  return (
    <>
      <div {...css(styles.wrapper)}>
        <div
          {...css(styles.container)}
          className="fix_background_grey1 fix_paragraph_body_12"
        >
          <Editor
            editorState={content}
            data-cy="workitem-thread-modal-topic-view-input-91333"
            onEditorStateChange={setContent}
            // toolbarClassName={toolbarVisible(showToolbar)}
            toolbarClassName={"show-toolbar"}
            placeholder={placeholder}
            handleBeforeInput={handleBeforeInput}
            editorClassName={`editor-input-${minHeight} editor-padding`}
            mention={{
              separator: " ",
              trigger: "@",
              suggestions: [...getMentionSuggestions()],
            }}
            toolbar={{
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },
              image: {
                uploadCallback: uploadImageCallback,
                previewImage: true,
                alt: { present: true, mandatory: false },
                inputAccept:
                  "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                defaultSize: {
                  width: "350",
                },
              },
            }}
            onChange={handleChange}
            onKeyDown={onKeyDown}
          />
        </div>
        {/* <div {...css(styles.showToolbarButton)}>
          <Button
            icon="settings"
            circular
            color={showToolbar ? "black" : "grey"}
            onClick={() => setShowToolbar(!showToolbar)}
          />
        </div> */}
      </div>
    </>
  );
};
