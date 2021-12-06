import loggedRequest from "../logged-request";

export const saveSubscription = async (data) => {
  return loggedRequest('post', `/subscriptions`, data);
};
