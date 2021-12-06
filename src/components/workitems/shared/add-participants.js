import { addParticipantsToExistingConversation } from "../../../services/conversations";

export const addParticipants = async ({ userid, workitemid }) => {
  const payload = {
    useridlist: [userid],
    workitemidlist: [workitemid],
  };
  await addParticipantsToExistingConversation(payload);
};
