import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
} from "draft-js";
import { useContext, useEffect, useState } from "react";
import { SwarmsContext } from "../store/context";
import editorUtils from "../utils/editor";
import { pickProperty } from "../utils/user";
import { JSONObjectValidator } from "../utils/validator";
import { useMentionUsers } from "./use-mention-users";
import { useUploadFile } from "./use-upload-file";

export const useEditor = ({
  workitemid,
  users,
  hivemind,
  changeHandler,
  inputContent,
}) => {
  const { getCurrentSwarmUsers } = useContext(SwarmsContext);
  const { uploadFile } = useUploadFile();
  const { createWorkitemsForMentionedUsers } = useMentionUsers();
  const [content, setContent] = useState(() => {
    if (inputContent) {
      const json = JSONObjectValidator(inputContent);
      return json
        ? EditorState.createWithContent(convertFromRaw(json))
        : EditorState.createWithContent(
            ContentState.createFromText(inputContent)
          );
    }
    return EditorState.createEmpty();
  });
  const [minHeight, setMinHeight] = useState("25px");
  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    return () => {
      setContent(null);
    };
  }, []);

  const serializeContent = () => {
    const contentState = content.getCurrentContent();
    const raw = convertToRaw(contentState);
    const text = editorUtils.getText(raw);
    if (hivemind || /^\/\w+/.test(text)) {
      return text;
    } else {
      return JSON.stringify(raw);
    }
  };

  const getMentions = () => {
    const contentState = content.getCurrentContent();
    const raw = convertToRaw(contentState);
    return editorUtils.getMentionedUsers(raw);
  };

  const handleBeforeInput = (ch, editorState) => {
    if (ch === "@") {
      setMinHeight("100px");
    }
  };

  const handleChange = (editorState) => {
    if (changeHandler) {
      changeHandler();
    }
  };

  // { text: "APPLE", value: "apple", url: "apple" },
  const getMentionSuggestions = () => {
    const currentSwarmUsers = getCurrentSwarmUsers();
    const usersToSuggest = users
      .filter((user) => currentSwarmUsers.includes(user.Username))
      .map((user) => {
        const email = pickProperty(user, "email");
        return {
          text: email,
          value: email,
          url: user.Username,
        };
      });
    return usersToSuggest;
  };

  const clearState = () => {
    setContent(null);
    setMinHeight("25px");
    setShowToolbar(false);
  };

  const sendMessage = ({ handler }) => {
    clearState();
    handler();
    const mentionedUsers = getMentions();
    if (mentionedUsers && mentionedUsers.length > 0) {
      createWorkitemsForMentionedUsers({ wid: workitemid, mentionedUsers });
    }
  };

  const uploadImage = async (file) => {
    return uploadFile({ wid: workitemid, file });
  };

  return {
    state: {
      content,
      setContent,
      minHeight,
      showToolbar,
      setShowToolbar,
    },
    handlers: {
      serializeContent,
      handleBeforeInput,
      handleChange,
      getMentionSuggestions,
      clearState,
      getMentions,
      sendMessage,
      uploadImage,
    },
  };
};
