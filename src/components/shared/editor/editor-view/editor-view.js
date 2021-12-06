/* eslint-disable react-hooks/exhaustive-deps */
import { CompositeDecorator, convertFromRaw, EditorState } from "draft-js";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { JSONObjectValidator } from "../../../../utils/validator";
import "../react-draft-wysiwyg.css";

function findMentionEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'MENTION'
      );
    },
    callback
  );
}

const Mention = props => {
  const {value} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <span {...props} style={{color: '#7CBD6D'}}>
      {value}
    </span>
  );
};

export const EditorView = ({ content, height }) => {

  const compositeDecorator = ([
    {
      strategy: findMentionEntities,
      component: Mention,
    },
  ]);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  // const msg =
  //   '{"blocks":[{"key":"1bvmi","text":"yes","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';
  const [isJson, setIsJson] = useState(false);

  useEffect(() => {
    const json = JSONObjectValidator(content);
    if (json) {
      console.log('json:', json);
      setEditorState(() => EditorState.createWithContent(convertFromRaw(json)));
      setIsJson(true);
    } else {
      setIsJson(false);
    }

    return () => {
      setEditorState(null);
    };
  }, [content]);

  return (
    <>
      {isJson ? (
        <div style={{ height }}>
          <Editor
            customDecorators={compositeDecorator}
            editorStyle={{ maxHeight: height, "overflow-y": "scroll" }}
            editorState={editorState}
            readOnly={true}
            toolbarClassName={"hide-toolbar"}
            editorClassName={"editor-padding"}
          />
        </div>
      ) : (
        <div style={{ height }}>{content}</div>
      )}
    </>
  );
};
