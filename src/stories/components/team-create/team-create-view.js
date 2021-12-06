// Modal for creating new team

import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  Form,
  Grid,
  GridColumn,
  Header,
  Icon,
  Image,
  Input,
  Modal,
  TextArea,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { css } from "glamor";

import "./team-create-view.less";
import MemberItem from "./subcomponents/member-item";
import SwarmItem from "./subcomponents/swarm-item";
import SearchBarMember from "./subcomponents/search-bar-member";
import SearchBarSwarm from "./subcomponents/search-bar-swarm";
import { indexOf } from "lodash";

export const CreateNewTeamComponent = ({
  id,
  team_name,
  purpose,
  members,
  swarms,
}) => {
  const styles = {
    fullWidth: {
      width: "100% !important",
      marginBottom: "5px !important",
    },
    fullHeight: {
      height: "80% !important",
    },
    textInputStyle: {
      minHeight: "70px !important",
    },
    textInputBorderRed: {
      border: "solid",
      borderWidth: "1px",
      borderColor: "red",
      borderRadius: "0.28571429rem",
    },
    textAreaStyle: {
      minHeight: "300px !important",
    },
  };

  const [open, setOpen] = useState(true);
  const [teamName, setTeamName] = useState(team_name);
  const [teamNameLength, setTeamNameLength] = useState(team_name.length);
  const [teamContent, setTeamContent] = useState(purpose);
  const [teamContentLength, setTeamContentLength] = useState(
    purpose.length
  );
  const [numberOfNewMembers, setNumberOfNewMembers] = useState(
    members.length
  );
  const [numberOfNewSwarms, setNumberOfNewSwarms] = useState(
    swarms.length
  );
  const [scrumbotContent, setScrumbotContent] = useState("");

  //-------------- add or remove new members-------------
  // set team Creater as default
  const [addedNewMembers, setAddedNewMembers] = useState(members);

  const addMember = (data) => {
    // return if new member is already added to
    if (addedNewMembers && addedNewMembers.find((s) => s.member_name === data))
      return;

    setAddedNewMembers((addedNewMembers) => [
      ...addedNewMembers,
      {
        member_name: data,
        member_role: "Member",
        member_email: "member1@test.com",
        member_avatar: "avatar_url",
        member_position: "project manager",
      },
    ]);
    setNumberOfNewMembers(numberOfNewMembers + 1);
  };

  const removeMember = (data) => {
    setAddedNewMembers(addedNewMembers.filter((item) => item !== data));
    setNumberOfNewMembers(numberOfNewMembers - 1);
  };

  const changeMemberRole = (data, role) => {
    const updatedMembers = [...addedNewMembers];
    const index = addedNewMembers.findIndex((element) => element === data);
    if (index !== -1) {
      updatedMembers[index] = {
        ...updatedMembers[index],
        member_role: role,
      };
      setAddedNewMembers(updatedMembers);
    }
  };

  //----------------------------------------------------

  //---------- add or remove new swarms that using this new team.-----------
  const [addedNewSwarms, setAddedNewSwarms] = useState(swarms);

  const addSwarm = (data) => {
    // return if new swarm is already added to
    if (addedNewSwarms && addedNewSwarms.find((s) => s.swarm_name === data))
      return;

    setAddedNewSwarms((addedNewSwarms) => [
      ...addedNewSwarms,
      {
        swarm_name: data,
        swarm_description: "tagN",
        swarm_avatar: "",
      },
    ]);
    setNumberOfNewSwarms(numberOfNewSwarms + 1);
  };

  const removeSwarm = (data) => {
    setAddedNewSwarms(addedNewSwarms.filter((item) => item !== data));
    setNumberOfNewSwarms(numberOfNewSwarms - 1);
  };
  //----------------------------------------------------

  //----- Check if the Team Name Field empty------------
  const [TeamNameFlag, setTeamNameFlag] = useState(
    teamName === "" ? true : false
  );
  //----------------------------------------------------

  return (
    <div>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="fullscreen"
        {...css(styles.fullHeight)}
      >
        {/* Header */}
        <Modal.Header className="modalHeaderStyle">
          <div className="alignSpaceBetween">
            <div style={{ fontSize: "16px" }}>Add new team</div>
            <div>
              <Icon
                name="times circle outline"
                size="large"
                onClick={() => {}}
              />
            </div>
          </div>
        </Modal.Header>

        {/* Main Content */}
        <Modal.Content>
          <Grid>
            <Grid.Row columns={4} className="newTeamGridStyle">
              {/* Team Name, Description, Creator */}
              <Grid.Column>
                <div className="alignSpaceBetween">
                  <div>
                    Team name<span style={{ color: "red" }}>*</span>
                  </div>
                  <div>{teamNameLength}/100</div>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <Input
                    defaultValue={teamName}
                    maxLength="100"
                    placeholder="Input team name here..."
                    {...css(
                      styles.fullWidth,
                      styles.textInputStyle,
                      TeamNameFlag && styles.textInputBorderRed
                    )}
                    onChange={(e) => {
                      if (e.target.value.length > 0 && TeamNameFlag)
                        setTeamNameFlag(false);
                      else if (e.target.value.length <= 0 && !TeamNameFlag)
                        setTeamNameFlag(true);
                      setTeamNameLength(e.target.value.length);
                      setTeamName(e.target.value);
                    }}
                  />
                </div>
                <div className="alignSpaceBetween">
                  <div>Purpose/Description</div>
                  <div>{teamContentLength}/300</div>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <TextArea
                    defaultValue={teamContent}
                    maxLength="300"
                    placeholder="Input your team purpose or description here..."
                    {...css(styles.fullWidth, styles.textAreaStyle)}
                    onChange={(e) => {
                      setTeamContentLength(e.target.value.length);
                      setTeamContent(e.target.value);
                    }}
                  />
                </div>
                <div className="alignSpaceBetween">
                  <div>
                    Creator<span style={{ color: "red" }}>*</span>
                  </div>
                  <div>The one who created the team 1/1</div>
                </div>
                <div style={{ pointerEvents: "none" }}>
                  {addedNewMembers.length ? (
                    <MemberItem data={addedNewMembers[0]} />
                  ) : (
                    <div />
                  )}
                </div>
              </Grid.Column>

              {/* Add members and set roles */}
              <Grid.Column>
                <div className="alignSpaceBetween fontSizeSmaller">
                  <div>Add person & set roles of team</div>
                  <div>{numberOfNewMembers}</div>
                </div>
                <div>
                  <SearchBarMember addMember={addMember} />
                </div>
                <div className="addedMemberGroupStyle">
                  {addedNewMembers &&
                    addedNewMembers.map((element, index) => {
                      return (
                        <MemberItem
                          data={element}
                          key={index}
                          removeMember={removeMember}
                          changeMemberRole={changeMemberRole}
                        />
                      );
                    })}
                </div>
              </Grid.Column>

              {/* Add swarms that using this team */}
              <Grid.Column>
                <div className="alignSpaceBetween fontSizeSmaller">
                  <div>Swarms that using this team</div>
                  <div>{numberOfNewSwarms}</div>
                </div>
                <div>
                  <SearchBarSwarm addSwarm={addSwarm} />
                </div>
                <div className="addedMemberGroupStyle">
                  {addedNewSwarms &&
                    addedNewSwarms.map((element, index) => {
                      return (
                        <SwarmItem
                          data={element}
                          key={index}
                          removeSwarm={removeSwarm}
                        />
                      );
                    })}
                </div>
              </Grid.Column>

              {/* The Coach's Suggestion */}
              <Grid.Column>
                <div className="alignSpaceBetween fontSizeSmaller">
                  <div>The Coach's Suggestion</div>
                  <div>Count</div>
                </div>
                <Form className="scrumbotFormStyle">
                  <div className="alignSpaceBetween scrumbotIconDivStyle">
                    <Icon name="commenting" />
                    <Icon name="question circle" />
                  </div>
                  <TextArea
                    placeholder="Tell us more"
                    className="scrumbotTextEditorStyle"
                    onChange={(e) => {
                      setScrumbotContent(e.target.value);
                    }}
                  />
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>

        {/* Action Buttons */}
        <Modal.Actions>
          <Button icon="close" content="Cancel" onClick={() => {}} />
          <Button icon="trash" content="Remove" secondary />

          <Button content="Save" icon="save" color="green" onClick={() => {}} />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default CreateNewTeamComponent;
