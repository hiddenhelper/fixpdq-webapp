import loggedRequest from "../logged-request";

export const getActions = async (workitemid) => {
  return loggedRequest('get', `/actions?workitemid=${workitemid}`);
};

export const getActionsByListOfWorkitemIds = async (workitems) => {
  return loggedRequest('post', "/actions/workitems", workitems);
};

export const getActionsByTypeAndOwnerAndTimeStamp = async (
  actionType,
  activeFor,
  timeStamp
) => {
  return loggedRequest(
    'get', 
    `/actions?actionType=${actionType}&activeFor=${activeFor}&timeStamp=${timeStamp}`
    );
};