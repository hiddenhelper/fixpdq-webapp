import { useContext } from "react";
import { toast } from "react-semantic-toasts";
import { ConversationsContext } from "../store/context";

export const useConversations = () => {
  const { openConversationsModal, addParticipantsSuccess } = useContext(
    ConversationsContext
  );

  const openConversations = async ({ wid, userid, onOpen }) => {
    openConversationsModal({
      wid,
      userid,
      onOpen,
    });
  };

  const openToastForAddParticipants = () => {
    if (!addParticipantsSuccess) {
      toast({
        type: "error",
        icon: "user",
        title: "Add Participant",
        description: "Error adding participant",
        animation: "bounce",
        time: 5000,
      });
    }
  };

  return {
    openConversations,
    addParticipantsSuccess,
    openToastForAddParticipants,
  };
};
