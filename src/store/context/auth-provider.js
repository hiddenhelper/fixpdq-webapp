import React, { useState } from "react";

import { retrieveItem } from "../../utils/local-storage";

export const AuthContext = React.createContext({
  username: null,
  getUserName: null
});

const AUTH_RECORD = "auth-user";

export const AuthProvider = (props) => {
  const [username, setUsername] = useState([]);

  const getUserName = () => {
    const id = retrieveItem(AUTH_RECORD);
    setUsername(id);
    return id;
  }

  return (
    <AuthContext.Provider
      value={{
        username,
        getUserName,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
