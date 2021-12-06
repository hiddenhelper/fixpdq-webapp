/* eslint-disable react-hooks/exhaustive-deps */

import { useContext } from "react";

import { storeItem, retrieveItem, removeItem } from "../utils/local-storage";
import { AuthContext } from "../store/context";


export const useLocalStorage = () => {
  const { getUserName } = useContext(AuthContext);
  const storeRecord = (recordName, item) => {
    storeItem(recordName, item, getUserName());
  }
  const retrieveRecord = (recordName) => {
    return retrieveItem(recordName, getUserName());
  }
  const removeRecord = (recordName) => {
    removeItem(recordName);
  }
  return {
    storeRecord,
    retrieveRecord,
    removeRecord,
  }
}