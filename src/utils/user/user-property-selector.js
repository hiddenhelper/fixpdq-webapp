import { truncateString } from "../truncate-string";

class UserPropertySelector {
  constructor({ userid, allUsers }) {
    if (allUsers) {
      this.user = allUsers.find((s) => s.Username === userid);
    }
  }

  getPropertyValue(property) {
    return this.user?.Attributes.find((attr) => attr.Name === property)?.Value;
  }

  getUserIdentity() {
    const user = {
      nickname: this.getPropertyValue("nickname"),
      firstname: this.getPropertyValue("given_name"),
      lastname: this.getPropertyValue("family_name"),
      email: this.getPropertyValue("email"),
    };
    if (user.nickname) {
      return user.nickname;
    } else if (user.firstname && user.lastname) {
      return user.firstname + " " + user.lastname;
    } else {
      return user.email;
    }
  }
  getAllUserIdentity() {
    const user = {
      nickname: this.getPropertyValue("nickname"),
      firstname: this.getPropertyValue("given_name"),
      lastname: this.getPropertyValue("family_name"),
      email: this.getPropertyValue("email"),
    };
    const identityList = [];
    if (user.nickname) {
      identityList.push(user.nickname.toLowerCase());
    }
    if (user.firstname) {
      if (user.lastname) {
        identityList.push((user.firstname + " " + user.lastname).toLowerCase());
      } else {
        identityList.push(user.firstname.toLowerCase());
      }
    }
    identityList.push(user.email.toLowerCase());
    return identityList;
  }
}

export const getUser = ({ userid, allUsers }) => {
  return new UserPropertySelector({ userid, allUsers });
};

export const pickProperty = (user, property) => {
  try {
    return user?.Attributes?.find((attr) => attr.Name === property)?.Value;
  } catch (err) {
    return null;
  }
};

export const generatePersonSelectorStyle = (user) => {
  const given_name = pickProperty(user, "given_name");
  const family_name = pickProperty(user, "family_name");
  const email = pickProperty(user, "email");
  let str="";
  if (given_name) {
    str += given_name + " ";
  }
  if (family_name) {
    str += family_name + " ";
  }
  str += str ? "(" + email + ")" : email;
  return truncateString(str, 25);
}
