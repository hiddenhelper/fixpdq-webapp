import React, { useState } from "react";
import { getTwilioToken } from "../../services/conversations";
import { Client as ConversationsClient } from "@twilio/conversations";

export const TwilioContext = React.createContext({
  twilioConversations: [],
  initTwilioConverations: null,
  success: false,
});

export const TwilioProvider = (props) => {
  const [twilioConversations, setTwilioConversations] = useState([]);
  const [success, setSuccess] = useState(false);
  let conversationsClient = null;
  const [loading, setLoading] = useState(false);

  const initTwilioConverations = async () => {
    try {
      setLoading(true);
      const token = await getTwilioToken();
      console.log("token", token);
      conversationsClient = await ConversationsClient.create(token.twilioToken);
      conversationsClient.on("connectionStateChanged", (state) => {
        console.log("twilio connection state:", state);
        if (state === "connected") {
          setSuccess(true);
        }
        if (state === "disconnected" || state === "denied") {
          setSuccess(false);
          setTwilioConversations([]);
          conversationsClient = null;
        }
      });
      conversationsClient.on("conversationJoined", (conversation) => {
        if (!twilioConversations.find((conv) => conv.sid === conversation.sid)) {
          setTwilioConversations((twilioConversations) => [...twilioConversations, conversation]);
        }
      });
      conversationsClient.on("conversationLeft", (thisConversation) => {
        setTwilioConversations(twilioConversations.filter((it) => it.sid !== thisConversation.sid));
      });
      setLoading(false);
    } catch (error) {
      console.log("initTwilioConverations error:", error);
      setLoading(false);
      setSuccess(false);
    }
  };

  return (
    <TwilioContext.Provider
      value={{
        twilioConversations,
        initTwilioConverations,
        success,
        loading,
      }}
    >
      {props.children}
    </TwilioContext.Provider>
  );
};
