import React, { useState, useContext, useEffect } from "react";
import CreateNewTeamComponent from "./create-team.view";
import UserContext from "../user/context";

const TeamComponent = ({
  closeTeamModal,
  addNewTeamInfo,
  deleteTeamFromList,
  type,
  data,
  allUsers,
  myRole,
}) => {
  const context = useContext(UserContext);
  const creatorid = context.user.username;

  const modalTitle =
    type === "NewTeam"
      ? "Add new team"
      : type === "EditTeam"
      ? "Edit Team"
      : "View team details";
  const [teamName, setTeamName] = useState(
    type === "NewTeam" ? "" : data.team_name
  );
  const [teamContent, setTeamContent] = useState(
    type === "NewTeam" ? "" : data.team_purpose
  );
  const [numberofNewUsers, setNumberofNewUsers] = useState(
    type === "NewTeam" ? 1 : data.users.length + 1
  );
  //const [numberOfNewSwarms, setNumberOfNewSwarms]=useState(type==="NewTeam" ? 0 : data.Swarms.length);
  const [scrumbotContent, setScrumbotContent] = useState("");

  // set default-value or load existing team members (Creator/Owner/Admin/Member/Invited)
  const [teamCreator, setTeamCreator] = useState();
  const [addedNewUsers, setAddedNewUsers] = useState([]);

  useEffect(() => {
    let initialUsers = [];
    if (type !== "NewTeam") {
        setTeamCreator(data.creator);
        initialUsers.push(data.owner);
        initialUsers = initialUsers.concat(data.users);
    } else {
        const creator = { ...allUsers.find((s) => s.Username === creatorid), Role: "Creator" };
        const owner = { ...allUsers.find((s) => s.Username === creatorid), Role: "Owner" };
        setTeamCreator(creator);
        initialUsers.push(owner);
    }
    setAddedNewUsers(initialUsers);
  }, [allUsers]);

  const addUser = (data) => {
    // return if new member is already added to
    if (
      addedNewUsers &&
      addedNewUsers.find((s) => s.Username === data.Username)
    ) {
      return;
    }

    setAddedNewUsers((addedNewUsers) => [
      ...addedNewUsers,
      { ...data, Role: "Member" },
    ]);
    setNumberofNewUsers(numberofNewUsers + 1);
  };

  const removeUser = (username) => {
    setAddedNewUsers(addedNewUsers.filter((item) => item.Username !== username));
    setNumberofNewUsers(numberofNewUsers - 1);
  };

  const changeUserRole = (username, role) => {
    const updatedMembers = [...addedNewUsers];
    if (role === "Owner") {
      // replace old owner to admin
      const ownerIndex = addedNewUsers.findIndex(
        (element) => element.Role === "Owner"
      );
      if (ownerIndex !== -1) {
        updatedMembers[ownerIndex] = {
          ...updatedMembers[ownerIndex],
          Role: "Admin",
        };
      }
    }
    const index = addedNewUsers.findIndex((element) => element.Username === username);
    if (index !== -1) {
      updatedMembers[index] = {
        ...updatedMembers[index],
        Role: role,
      };
      setAddedNewUsers(updatedMembers);
    }
  };

  //----------------------------------------------------

  //---------- add or remove new swarms that using this new team.-----------
  // const [addedNewSwarms, setAddedNewSwarms] = useState(type==="NewTeam" ? [] : data.Swarms);

  // const addSwarm = ( data ) => {
  //     // return if new swarm is already added to
  //     if ( addedNewSwarms && (addedNewSwarms.find((s)=>s.swarm_name === data))) return;

  //     setAddedNewSwarms(addedNewSwarms=>[...addedNewSwarms, {
  //         swarm_name: data,
  //         swarm_description: "tagN",
  //         swarm_avatar: "",
  //     }]);
  //     setNumberOfNewSwarms( numberOfNewSwarms + 1);
  // }

  // const removeSwarm = ( data ) => {
  //     setAddedNewSwarms( addedNewSwarms.filter(item => item !== data ) );
  //     setNumberOfNewSwarms( numberOfNewSwarms - 1);
  // }
  //----------------------------------------------------

  return (
    <CreateNewTeamComponent
      modalType={type}
      myRole={myRole}
      modalTitle={modalTitle}
      teamName={teamName}
      setTeamName={setTeamName}
      teamContent={teamContent}
      setTeamContent={setTeamContent}
      numberofNewUsers={numberofNewUsers}
      //numberOfNewSwarms = {numberOfNewSwarms}
      scrumbotContent={scrumbotContent}
      setScrumbotContent={setScrumbotContent}
      allUsers={allUsers}
      teamCreator={teamCreator}
      addedNewUsers={addedNewUsers}
      addUser={addUser}
      removeUser={removeUser}
      changeUserRole={changeUserRole}
      // addedNewSwarms = {addedNewSwarms}
      // addSwarm = {addSwarm}
      // removeSwarm = {removeSwarm}

      addNewTeamInfo={() => {
        let newTeamData = {
          team_name: teamName,
          team_purpose: teamContent,
          creator: teamCreator.Username,
          owner: addedNewUsers.find((user)=>user.Role === "Owner"),
        };
        let addedPerson = [];
        addedNewUsers.forEach((user) => {
          if (user.Role !== "Owner") {
            addedPerson.push({
              Username: user.Username,
              Role: user.Role,
            });
          }
        });
        newTeamData = { ...newTeamData, users: addedPerson };
        addNewTeamInfo(newTeamData);
      }}
      deleteTeamFromList={() => {
        deleteTeamFromList(data);
      }}
      closeTeamModal={() => {
        closeTeamModal();
      }}
    />
  );
};

export default TeamComponent;
