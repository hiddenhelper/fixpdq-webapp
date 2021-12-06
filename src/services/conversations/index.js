import loggedRequest from "../logged-request";

export const getTwilioToken = async () => {
  return loggedRequest('get', `/conversations`);
};

export const createConversation = async (conversationInfo) => {
  return loggedRequest('post', `/conversations`, conversationInfo);
};

export const storeMessageToDB = async (conversationid, conversationInfo) => {
  return loggedRequest('post', `/conversations/${conversationid}`, conversationInfo);
};

export const addParticipantsToExistingConversation = async (data) => {
  return loggedRequest('post', `/conversations?participant=`, data);
};

export const getConversationsByListOfWorkitemIds = async (workitems) => {
  return loggedRequest('post', "/conversations/workitems", workitems);
};

export const createNewChannel = async (data) => {
  return loggedRequest('post', "/conversations/channel", data);
};
