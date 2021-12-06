import React from "react";
import { Dropdown } from "semantic-ui-react";
import { default_avatar } from "../../../utils/static-images";
import { pickProperty, generatePersonSelectorStyle } from "../../../utils/user";
import "./search-bar.less";

export const SearchBarMember = ({ addUser, allUsers, playbookid }) => {
  const styles = {
    field: {
      backgroundColor: "#EFEFEF",
      borderRadius: "8px",
      whiteSpace: "nowrap",
    },
  };

  const usersForDropDown =
    allUsers &&
    allUsers
      .map((user) => {
        return {
          key: user.Username,
          text: generatePersonSelectorStyle(user),
          value: user.Username,
          image: {
            avatar: true,
            src: pickProperty(user, "picture") || default_avatar,
          },
        };
      })
      .sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));

  return (
    <Dropdown
      style={styles.field}
      button
      className="icon searchBarClass"
      floating
      labeled
      disabled={playbookid}
      icon="plus"
      options={usersForDropDown}
      selection
      selectOnBlur
      value
      search
      text="Search to add..."
      data-cy="swarm-search-temp-2"
      onChange={(event, data) => {
        //---- Find selected user in all Users---------
        const selectedUser = allUsers.find(
          (user) => user.Username === data.value
        );
        addUser(selectedUser);
        data.value = "";
      }}
    />
  );
};

export default SearchBarMember;
