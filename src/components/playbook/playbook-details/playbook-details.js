/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";

import { PlayBookDetailsView } from "./playbook-details.view";
import { CurrentPlaybookContext } from "../../../store/context";

export const PlayBookDetails = (props) => {
  const [params, setParams] = useState();
  const {
    currentPlaybook,
    currentPlaybookId,
    fetchCurrentPlaybook,
    success,
    loading
  } = useContext(CurrentPlaybookContext);

  useEffect(() => {
    setParams(props.location.state.params ? props.location.state.params : null);
  }, []);

  useEffect(() => {
    const getPlaybook = async () => {
      await fetchCurrentPlaybook(currentPlaybookId);
    };
  
    getPlaybook();
  }, [currentPlaybookId]);

  useEffect(() => {
    if (success && currentPlaybook) {
      setParams((params) => ({ ...params, playbook: currentPlaybook[0] }));
    }
  }, [loading]);

  const refreshPlaybookWorkitem = async () => {
    await fetchCurrentPlaybook(currentPlaybookId);
  };

  return (
    <>
      {params && (
        <PlayBookDetailsView
          playbook={params.playbook}
          index={params.index}
          refreshPlaybookWorkitem={refreshPlaybookWorkitem}
        />
      )}
    </>
  );
};

