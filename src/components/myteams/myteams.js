import React, { useEffect, useState, useContext } from "react";
import { Button, Card, Sidebar, Segment } from "semantic-ui-react";

import { MyTeamsHeader } from "./sub-components/myteams-header";
import { MyTeamsItem } from "./myteams.view";
import TeamComponent from "./create-team";
import { WorkItemThreadModal } from "../workitems/workitem-thread-modal/workitem-thread-modal";

import UserContext from "../user/context";
import { CoachModalContext } from "../../store/context";
import {
  createTeam,
  deleteTeam,
  getAllTeamsByPersonId,
  updateTeam,
} from "../../services/teams";
import { getUsers } from "../../services/users";
import { css } from "glamor";

export const MyTeamsComponent = (props) => {
  const context = useContext(UserContext);
  const personid = context.user.username;

  const [teamsinfo, setTeamsInfo] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [threadVisible, setThreadVisible] = useState("init");
  const { openCoachModal, setOpenCoachModal } = useContext(CoachModalContext);

  useEffect(() => {
    getTeamsByPerson();
    getAllUsersFromDB();
  }, []);

  useEffect(() => {
    if (openCoachModal) {
      setThreadVisible("open");
    }
  }, [openCoachModal]);

  // get needed data from back-end
  const getTeamsByPerson = async () => {
    try {
      const response = await getAllTeamsByPersonId(personid);
      if (response) {
        setTeamsInfo(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsersFromDB = async () => {
    try {
      const response = await getUsers();
      if (response) {
        setAllUsers(response.Users);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addNewTeamToDB = async (data) => {
    try {
      const response = await createTeam(data);
      if (response) {
        setTeamsInfo((teamsinfo) => [...teamsinfo, response]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateTeamToDB = async (teamid, data) => {
    try {
      const response = await updateTeam(teamid, data);
      if (response) {
        let updatedTeamsInfo = [...teamsinfo];
        updatedTeamsInfo[selectedIndex] = response;
        setTeamsInfo(updatedTeamsInfo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTeamDB = async (index, teamid) => {
    try {
      const response = await deleteTeam(teamid);
      if (response) {
        let updatedTeamsInfo = [...teamsinfo];
        updatedTeamsInfo.splice(index, 1);
        setTeamsInfo(updatedTeamsInfo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Create Team Modal Open-Flag
  const [showTeamModal, setShowTeamModal] = useState(
    props.isMyTeams ? "" : "NewTeam"
  );

  const closeTeamModal = () => {
    setShowTeamModal("");
    setSelectedIndex(-1);
  };

  // Add created new team info
  const addNewTeamInfo = (data) => {
    if (showTeamModal === "NewTeam") {
      addNewTeamToDB(data);
    } else if (showTeamModal === "EditTeam" && selectedIndex !== -1) {
      updateTeamToDB(teamsinfo[selectedIndex].teamid, data);
    }
  };

  // delete a team from teamlist
  const deleteTeamFromList = (data) => {
    const index = teamsinfo.findIndex((element) => element === data);
    if (index < 0) return;
    deleteTeamDB(index, teamsinfo[index].teamid);
  };

  // Edit Existing Team
  const editExistingTeamComponent = (data) => {
    const index = teamsinfo.findIndex((element) => element === data);
    if (index < 0) {
      return;
    }
    setShowTeamModal("EditTeam");
    setSelectedIndex(index);
  };

  // return my Role in the team
  const getMyRoleFromTeam = (index) => {
    if (teamsinfo[index].creator.Username === personid) {
      return "Creator";
    }

    if (teamsinfo[index].owner.Username === personid) {
      return "Owner";
    }

    for (const user of teamsinfo[index].users) {
      if (user.Username === personid) {
        return user.Role;
      }
    }
  };

  const closeConversationModal = () => {
    setThreadVisible("closed");
    setOpenCoachModal(false);
  };

  return (
    <div>
      <MyTeamsHeader />
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
            {/* Display Existing Teams */}
            <Card.Group>
              {teamsinfo &&
                teamsinfo.map((element, index) => {
                  return (
                    <MyTeamsItem
                      myteamItem={element}
                      key={index}
                      editExistingTeamComponent={editExistingTeamComponent}
                    />
                  );
                })}
            </Card.Group>

            <div className="buttonDiv">
              {/* New Team Button */}
              <Button
                data-cy="myteams-button-59817"
                size="huge"
                className="addButton"
                icon="plus"
                onClick={() => {
                  setShowTeamModal("NewTeam");
                }}
              ></Button>

              <div>New Team</div>
            </div>
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>

      {/* Display Team Modal */}
      {showTeamModal === "NewTeam" ? (
        <TeamComponent
          closeTeamModal={closeTeamModal}
          addNewTeamInfo={addNewTeamInfo}
          deleteTeamFromList={deleteTeamFromList}
          type="NewTeam"
          allUsers={allUsers}
          myRole="Creator"
        />
      ) : showTeamModal === "EditTeam" && selectedIndex !== -1 ? (
        <TeamComponent
          closeTeamModal={closeTeamModal}
          addNewTeamInfo={addNewTeamInfo}
          deleteTeamFromList={deleteTeamFromList}
          type="EditTeam"
          data={teamsinfo[selectedIndex]}
          allUsers={allUsers}
          myRole={getMyRoleFromTeam(selectedIndex)}
        />
      ) : showTeamModal === "ViewTeam" && selectedIndex !== -1 ? (
        <TeamComponent
          closeTeamModal={closeTeamModal}
          addNewTeamInfo={addNewTeamInfo}
          deleteTeamFromList={deleteTeamFromList}
          type="ViewTeam"
          data={teamsinfo[selectedIndex]}
          allUsers={allUsers}
          myRole={getMyRoleFromTeam(selectedIndex)}
        />
      ) : (
        ""
      )}
    </div>
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
};

export default MyTeamsComponent;
