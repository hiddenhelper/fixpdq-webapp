/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "glamor";
import React, { useContext, useEffect, useState } from "react";
import { Button, Sidebar, Segment } from "semantic-ui-react";
import { SwarmsContext, UsersContext, CoachModalContext } from "../../store/context";
import CreateSwarmModal from "./swarm-add-modal";
import { SwarmCard } from "./swarm-card/swarm-card";
import SwarmEditModal from "./swarm-edit-modal";
import {
  SwarmManagementFilter,
  SwarmManagementHeader,
} from "./swarm-management-header";
import WorkItemThreadModal from "../workitems/workitem-thread-modal/workitem-thread-modal";

const SwarmManagement = ({ isCreateModal }) => {
  const { swarms, success: swarmsLoadingSuccess } = useContext(SwarmsContext);

  const { users, success: usersLoadingSuccess } = useContext(UsersContext);

  const [swarmsList, setSwarmsList] = useState([]);
  const [swarmIdToEdit, setSwarmIdToEdit] = useState(null);
  const [openSwarmEditModal, setOpenSwarmEditModal] = useState(false);
  const [openSwarmCreateModal, setOpenSwarmCreateModal] = useState(
    isCreateModal
  );
  const [usersList, setUsersList] = useState([]);
  const [threadVisible, setThreadVisible] = useState("init");
  const { openCoachModal, setOpenCoachModal } = useContext(CoachModalContext);

  useEffect(() => {
    if (usersLoadingSuccess) {
      setUsersList(users);
    }
  }, [users]);

  useEffect(() => {
    if (swarmsLoadingSuccess) {
      const list = swarms.sort((x, y) =>
        x.isFirstSwarm === y.isFirstSwarm ? 0 : x.isFirstSwarm ? -1 : 1
      );
      setSwarmsList(list);
    }
  }, [swarmsLoadingSuccess, swarms]);

  useEffect(() => {
    if (openCoachModal) {
      setThreadVisible("open");
    }
  }, [openCoachModal]);

  const onSwarmEditButtonClicked = (swarmid) => {
    setSwarmIdToEdit(swarmid);
    setOpenSwarmEditModal(true);
  };

  const closeConversationModal = () => {
    setThreadVisible("closed");
    setOpenCoachModal(false);
  };

  return (
    <>
      <div style={{ align: "left" }}>
        <SwarmManagementHeader />
        <Sidebar.Pushable {...css(styles.sidebarPushableSize)}>
          <Sidebar
            animation="overlay"
            icon="labeled"
            direction="right"
            inverted
            vertical
            visible={threadVisible === "open"}
            onHide={() => closeConversationModal()}
            {...css(styles.sidebarSize)}
          >
            {/* conversation modal */}
              <WorkItemThreadModal
                closeConversationModal={closeConversationModal}
              />
          </Sidebar>
          <Sidebar.Pusher {...css(styles.sidebarPusherSize)}>
            <Segment basic>
              <SwarmManagementFilter />
              <SwarmCard
                swarmsList={swarmsList}
                allUsers={usersList}
                onSwarmEditButtonClicked={onSwarmEditButtonClicked}
              />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
      {openSwarmCreateModal && (
        <CreateSwarmModal
          openModal={openSwarmCreateModal}
          setOpenModal={setOpenSwarmCreateModal}
        />
      )}
      {openSwarmEditModal && swarmIdToEdit && (
        <SwarmEditModal
          openModal={openSwarmEditModal}
          setOpenModal={setOpenSwarmEditModal}
          swarmIdToEdit={swarmIdToEdit}
          setSwarmIdToEdit={setSwarmIdToEdit}
        />
      )}
      <div className="playBookAddButtonDiv">
        <Button
          data-cy="swarm-add-button-00947"
          size="huge"
          className="playBookAddButton"
          icon="plus"
          onClick={() => {
            setOpenSwarmCreateModal(true);
          }}
        ></Button>

        <div>New Swarm</div>
      </div>
    </>
  );
};

export const styles = {
  sidebarPushableSize: {
    width: "100% !important",
    height: "calc(100vh - 102px) !important",
  },
  sidebarSize: {
    width: "90% !important",
  },
  sidebarPusherSize: {
    height: "100% !important",
    overflowY: "auto !important",
  },
}
export default SwarmManagement;
