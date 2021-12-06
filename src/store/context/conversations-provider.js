import React, { useState } from "react";
import { addParticipants } from "../../components/workitems/shared/add-participants";
import { getConversationsByListOfWorkitemIds } from "../../services/conversations";

export const ConversationsContext = React.createContext({
  conversations: [],
  loading: false,
  success: false,
  fetchConversationsByWorkitems: null,
});

export const ConversationsProvider = (props) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openConversationsLoading, setOpenConversationsLoading] = useState(
    false
  );
  const [addParticipantsSuccess, setAddParticipantsSuccess] = useState(true);

  const fetchConversationsByWorkitems = async (workitems) => {
    if (workitems && workitems.length > 0) {
      setLoading(true);
      try {
        const items = await getConversationsByListOfWorkitemIds(workitems);
        setSuccess(true);
        setConversations(items.length > 0 ? items : []);
        setLoading(false);
      } catch {
        setConversations([]);
        setLoading(false);
      }
    }
  };

  const openConversationsModal = async ({ wid, userid, onOpen }) => {
    setOpenConversationsLoading(true);
    setAddParticipantsSuccess(true);
    try {
      await addParticipants({
        userid: userid,
        workitemid: wid,
      });
      setOpenConversationsLoading(false);
    } catch (error) {
      setOpenConversationsLoading(false);
      setAddParticipantsSuccess(false);
    } finally {
      onOpen();
    }
  };

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        openConversationsModal,
        openConversationsLoading,
        loading,
        success,
        fetchConversationsByWorkitems,
        addParticipantsSuccess,
      }}
    >
      {props.children}
    </ConversationsContext.Provider>
  );
};
