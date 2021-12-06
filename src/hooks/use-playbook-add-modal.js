/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { POSITION_ACTION } from "../components/workitems/workitems-definitions";
import { getPlaybooksBySwarmId } from "../services/playbook";
import { updateWorkitem } from "../services/workitems";
import {
  SwarmsContext,
  UsersContext,
  WorkitemsContext,
} from "../store/context";

export const usePlaybookAddModal = ({
  workitemid,
  swarmid,
  swarm_name,
  owner,
  creator,
  getLastChild,
}) => {
  const { swarmsDropdownOptions, loading: swarmsLoading } = useContext(
    SwarmsContext
  );
  const { fetchWorkitemsBySwarms } = useContext(WorkitemsContext);
  const { users } = useContext(UsersContext);

  const [selectedSwarm, setSelectedSwarm] = useState({
    swarmId: "none",
    swarmName: "none",
  });

  const [openAddPlayBookModal, setOpenAddPlayBookModal] = useState(false);
  const [playbooks, setPlaybooks] = useState([]);
  const [playbookid, setPlaybookid] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isRequestOnFlight, setIsRequestOnFlight] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (
      !swarmsLoading &&
      swarmsDropdownOptions &&
      swarmsDropdownOptions.length > 0
    ) {
      setSelectedSwarm({
        swarmId: swarmid,
        swarmName: swarmsDropdownOptions.find((s) => s.value === swarmid).text,
      });
    }
  }, [swarmsLoading]);

  useEffect(() => {
    if (openAddPlayBookModal) {
      clearError();
      fetchPlaybooks(selectedSwarm.swarmId);
    }
  }, [openAddPlayBookModal]);

  useEffect(() => {
    if (selectedSwarm) {
      fetchPlaybooks(selectedSwarm.swarmId);
    }
  }, [selectedSwarm]);

  const fetchPlaybooks = async (swarmid) => {
    if (swarmid !== "none" && openAddPlayBookModal) {
      try {
        const result = await getPlaybooksBySwarmId(swarmid);
        setPlaybooks(
          result.slice().map((pb) => {
            return {
              ...pb,
              key: pb.playbookid,
              text: pb.playbookname,
              value: pb.playbookid,
            };
          })
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleError = (message) => {
    setHasError(true);
    setErrorMessage(message);
  };

  const isValid = () => {
    if (!playbookid) {
      handleError("Please choose a playbook from the list");
      return false;
    }

    return true;
  };

  const clearError = () => {
    setErrorMessage("");
    setHasError(false);
  };

  const addPlayBook = async (playbookid) => {
    const getEmailFromId = (userid) => {
      if (!userid) {
        return undefined;
      }
      return users
        .find((u) => u.Username === userid)
        .Attributes.find((a) => a.Name === "email").Value;
    };
    try {
      setIsRequestOnFlight(true);
      const result = await updateWorkitem(workitemid, {
        positionActions: [
          {
            name: POSITION_ACTION.ADD_PLAYBOOK,
            payload: {
              parent: workitemid,
              owner,
              ownerEmail: getEmailFromId(owner),
              creator,
              swarmid,
              swarm_name,
              creatorEmail: getEmailFromId(creator),
              lastChild: getLastChild(workitemid),
              workitems: playbooks.find((pb) => pb.playbookid === playbookid)
                .workitems,
            },
          },
        ],
      });
      setIsRequestOnFlight(false);
      if (result.workitemid) {
        await fetchWorkitemsBySwarms([swarmid]);
        setOpenAddPlayBookModal(false);
      } else {
        handleError(
          `Error adding playbook ${
            result.message ? JSON.stringify(result.message) : ""
          }`
        );
      }
    } catch (err) {
      setIsRequestOnFlight(false);
      console.log(err);
    }
  };

  const handleAddClick = async () => {
    clearError();
    const isFormValid = isValid();
    if (isFormValid) {
      await addPlayBook(playbookid);
    }
  };

  return {
    playbookid,
    playbooks,
    openAddPlayBookModal,
    selectedSwarm,
    swarmsDropdownOptions,
    errorMessage,
    hasError,
    isRequestOnFlight,
    setOpenAddPlayBookModal,
    setSelectedSwarm,
    addPlayBook,
    setPlaybookid,
    isValid,
    handleError,
    clearError,
    setIsRequestOnFlight,
    handleAddClick,
  };
};
