import loggedRequest from "../logged-request";

export const getUsers = async () => {
  return loggedRequest('get', `/users`);
};

export const getUserByUserId = async (userid) => {
  return loggedRequest('get', `/users?userid=${userid}`);
};

export const updateUser = async(user, userInfo) => {
  return loggedRequest('put', `/users/${user}`, userInfo);
}
