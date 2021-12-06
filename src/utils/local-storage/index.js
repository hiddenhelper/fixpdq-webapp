import { LOCAL_STORAGE_RECORD_PREFIX } from "../../constants";

export const retrieveItem = (recordName, user="default_user") => {
  try {
    const record = localStorage.getItem(
      `${user}-${LOCAL_STORAGE_RECORD_PREFIX}${recordName}`
    );
    if (record !== "null") {
      return JSON.parse(record);
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const storeItem = (recordName, item, user="default_user") => {
  localStorage.setItem(
    `${user}-${LOCAL_STORAGE_RECORD_PREFIX}${recordName}`,
    JSON.stringify(item)
  );
};

export const removeItem = (recordName) => {
  for (let i = 0; i < localStorage.length; i++){
    if (localStorage.key(i).includes(recordName)) {
      localStorage.removeItem(localStorage.key(i));
    }
  }
};
