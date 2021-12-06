import React, { useState } from "react";

import { getPlaybookById } from "../../services/playbook";
import { useLocalStorage } from "../../hooks";

const CURRENT_PLAYBOOK_RECORD = "current-playbook";

export const CurrentPlaybookContext = React.createContext({
  currentPlaybook: [],
  currentPlaybookId: null,
  loading: false,
  success: false,
  fetchCurrentPlaybook: null,
  upadateCurrentPlaybook: null,
  getCurrentPlaybook: null,
  lastFetch: null,
});

export const CurrentPlaybookProvider = (props) => {
  const { retrieveRecord, storeRecord } = useLocalStorage();
  const [currentPlaybookId, setCurrentPlaybookId] = useState(null);
  const [currentPlaybook, setCurrentPlaybook] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchCurrentPlaybook = async (playbookid) => {
    const id = playbookid || retrieveRecord(CURRENT_PLAYBOOK_RECORD).playbookid;

    if (id) {
      setLoading(true);
      try {
        const playbooks = await getPlaybookById(id);
        setSuccess(true);
        if (playbooks && playbooks.length > 0) {
          setCurrentPlaybook(playbooks);
          storeRecord(
            CURRENT_PLAYBOOK_RECORD,
            playbooks.find((p) => p.playbookid === currentPlaybookId)
          );
        }
        setLoading(false);
      } catch {
        setCurrentPlaybook([]);
        storeRecord(CURRENT_PLAYBOOK_RECORD, {});
        setLoading(false);
      }
    }
  };

  const upadateCurrentPlaybook = (playbook) => {
    setCurrentPlaybookId(playbook.playbookid);
    storeRecord(CURRENT_PLAYBOOK_RECORD, playbook);
  };

  const getCurrentPlaybook = () => {
    const playbook = retrieveRecord(CURRENT_PLAYBOOK_RECORD);
    setCurrentPlaybookId(playbook ? playbook.playbookid : null);
    return playbook;
  };

  return (
    <CurrentPlaybookContext.Provider
      value={{
        currentPlaybookId,
        currentPlaybook,
        loading,
        success,
        params: {
          setLoading,
          setSuccess,
          setCurrentPlaybook,
        },
        fetchCurrentPlaybook,
        upadateCurrentPlaybook,
        getCurrentPlaybook,
      }}
    >
      {props.children}
    </CurrentPlaybookContext.Provider>
  );
};
