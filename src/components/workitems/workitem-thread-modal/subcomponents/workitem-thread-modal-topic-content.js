import React from "react";
import { getUser } from "../../../../utils/user";
import { WorkItemThreadModalTopicContentContainer } from "./workitem-thread-modal-topic-content-container";

const WorkItemThreadModalTopicContent = ({
  message,
  allUsers,
}) => {
  const generateMessage = () => {
    let msgText = message.body;
    if (message.attributes.recipient) {
      const emailList = message.attributes.recipient
        .split(",")
        .map((userid) => {
          return getUser({ userid, allUsers }).getPropertyValue("email");
        });
      let posList = [];
      let splitLetter = [];
      emailList.forEach((email) => {
        const index = msgText.indexOf(email);
        posList.push({ index, email });
      });
      posList.sort((a, b) => a.index - b.index);
      if (posList[0].index > 0) {
        splitLetter.push({
          text: msgText.slice(0, posList[0].index),
          bold: false,
        });
      }
      posList.forEach((p, index) => {
        splitLetter.push({ text: p.email, bold: true });
        if (index < posList.length - 1) {
          splitLetter.push({
            text: msgText.slice(
              p.index + p.email.length,
              posList[index + 1].index
            ),
            bold: false,
          });
        } else if (p.index + p.email.length < msgText.length) {
          splitLetter.push({
            text: msgText.slice(p.index + p.email.length, msgText.length),
            bold: false,
          });
        }
      });
      const components = splitLetter.map((s, index) => {
        if (s.bold) {
          return (
            <b style={{ color: "red" }} key={index}>
              {s.text}
            </b>
          );
        }
        return <label key={index}>{s.text}</label>;
      });
      return components;
    }
    return <label>{msgText}</label>;
  };
  return (
    <WorkItemThreadModalTopicContentContainer
      message={message}
      allUsers={allUsers}
    >
      <div>{generateMessage()}</div>
    </WorkItemThreadModalTopicContentContainer>
  );
};

export default WorkItemThreadModalTopicContent;
