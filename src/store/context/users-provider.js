import React, { useState } from "react";
import { getUsers } from "../../services/users";
import { getUser } from "../../utils/user";

export const UsersContext = React.createContext({
  users: [],
  loading: false,
  success: false,
  fetchUsersList: null,
});

export const UsersProvider = (props) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchUsersList = async () => {
    setLoading(true);
    try {
      const { Users } = await getUsers();
      setSuccess(true);
      setUsers(Users);
      setLoading(false);
    } catch {
      setUsers([]);
      setLoading(false);
    }
  };

  const pickUser = (userid) => {
    return getUser({ userid, allUsers: users });
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        loading,
        success,
        fetchUsersList,
        pickUser,
      }}
    >
      {props.children}
    </UsersContext.Provider>
  );
};
