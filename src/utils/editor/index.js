import { JSONObjectValidator } from "../validator";

const getTextFromString = (string) => {
  const json = JSONObjectValidator(string);
  return json ? getText(json) : string;
};
const getText = (json) => {
  return (
    json &&
    json.blocks &&
    json.blocks
      .map((block) => (!block.text.trim() && "\n") || block.text)
      .join("\n")
  );
};

const getTextWithWhitespaces = (json) => {
  return (
    json &&
    json.blocks &&
    json.blocks.map((block) => (!block.text && "\n") || block.text).join("\n")
  );
};

const getTextFromStringForCharCount = (string) => {
  const json = JSONObjectValidator(string);
  return json ? getTextWithWhitespaces(json) : string;
};

const getMentionedUsers = (json) => {
  const { entityMap } = json;
  const users = Object.values(entityMap).map((entity) => {
    if (entity.type === "MENTION") {
      return entity.data.url;
    } else {
      return null;
    }
  });
  return users;
};

export default {
  getText,
  getTextFromString,
  getTextFromStringForCharCount,
  getMentionedUsers,
};
