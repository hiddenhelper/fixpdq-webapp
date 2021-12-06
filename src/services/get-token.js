import { Auth } from "aws-amplify";

export const getToken = async () => {
  const {
    accessToken: { jwtToken },
  } = await Auth.currentSession();
  return jwtToken;
};
