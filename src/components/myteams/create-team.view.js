// Modal for creating new team

import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Icon,
  Input,
  Modal,
  TextArea,
} from "semantic-ui-react";
import { css } from "glamor";

import "./create-team.less";
import MemberItem from "../shared/subcomponents/member-item.view";
import SwarmItem from "../shared/subcomponents/swarm-item.view";
import SearchBarMember from "../shared/subcomponents/search-bar-member.view";
import SearchBarSwarm from "../shared/subcomponents/search-bar-swarm.view";
import { MEMBER_ROLE_PRIORITY } from "../shared/subcomponents/member-role-priority";

const CreateNewTeamComponent = (props) => {
  const {
    modalType,
    myRole,
    modalTitle,
    teamName,
    setTeamName,
    teamContent,
    setTeamContent,
    numberofNewUsers,
    //numberOfNewSwarms,
    scrumbotContent,
    setScrumbotContent,
    allUsers,
    teamCreator,
    addedNewUsers,
    addUser,
    removeUser,
    changeUserRole,
    // addedNewSwarms,
    // addSwarm,
    // removeSwarm,
    addNewTeamInfo,
    deleteTeamFromList,
    closeTeamModal,
  } = props;

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
    disableBlock: {
      pointerEvents: "none !important",
    },
  };

  const [open, setOpen] = useState(true);
  const checkNameField = (key) => {
    const str = "~`!@#$%^&*()+=<>,.?/{}[]|";
    if (str.indexOf(key) >= 0) {
      return false;
    }
    return true;
  };
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="fullscreen"
    >
      {/* Header */}
      <Modal.Header className="modalHeaderStyle">
        <div className="alignSpaceBetween">
          <div style={{ fontSize: "16px" }}>{modalTitle}</div>
          <div>
            <Icon
              name="times circle outline"
              size="large"
              onClick={() => {
                closeTeamModal();
                setOpen(false);
              }}
            />
          </div>
        </div>
      </Modal.Header>

      {/* Main Content */}
      <Modal.Content
        {...css(
          MEMBER_ROLE_PRIORITY.find((m) => m.role === myRole)?.priority < 3 &&
            styles.disableBlock
        )}
      >
        <Grid>
          <Grid.Row columns={4}>
            {/* Team Name, Description, Creator */}
            <Grid.Column>
              <div className="alignSpaceBetween">
                <div>
                  Team name<span style={{ color: "red" }}>*</span>
                </div>
                <div>{teamName ? teamName.length : 0}/100</div>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <Input data-cy="create-team-view-input-68553" 
                  value={teamName}
                  maxLength="100"
                  placeholder="Input team name here..."
                  {...css(
                    styles.fullWidth,
                    styles.textInputStyle,
                    !teamName && styles.textInputBorderRed
                  )}
                  onChange={(e) => {
                    if (
                      !checkNameField(e.target.value[e.target.value.length - 1])
                    ) {
                      e.target.value = teamName;
                    } else {
                      setTeamName(e.target.value);
                    }
                  }}
                />
              </div>
              <div className="alignSpaceBetween">
                <div>Purpose/Description</div>
                <div>{teamContent ? teamContent.length : 0}/300</div>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <TextArea
                  value={teamContent}
                  maxLength="300"
                  placeholder="Input your team purpose or description here..."
                  {...css(styles.fullWidth, styles.textAreaStyle)}
                  onChange={(e) => {
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
                <MemberItem user={teamCreator} myRole={myRole} />
              </div>
            </Grid.Column>

            {/* Add members and set roles */}
            <Grid.Column>
              <div className="alignSpaceBetween fontSizeSmaller">
                <div>Add person & set roles of team</div>
                <div>{numberofNewUsers}</div>
              </div>
              <div>
                <SearchBarMember addUser={addUser} allUsers={allUsers} />
              </div>
              <div className="addedMemberGroupStyle">
                {addedNewUsers &&
                  addedNewUsers.map((element, index) => {
                    return (
                      <MemberItem
                        key={index}
                        user={element}
                        myRole={myRole}
                        removeUser={removeUser}
                        changeUserRole={changeUserRole}
                      />
                    );
                  })}
              </div>
            </Grid.Column>

            {/* Add swarms that using this team */}
            <Grid.Column>
              {/* <div className = "alignSpaceBetween fontSizeSmaller">
                                <div>Swarms that using this team</div>
                                <div>{numberOfNewSwarms}</div>
                            </div>
                            <div>
                                <SearchBarSwarm addSwarm = { addSwarm }/>
                            </div>
                            <div className="addedMemberGroupStyle">
                                {
                                    addedNewSwarms && (addedNewSwarms.map((element, index)=>{
                                        return (<SwarmItem data = {element} key={ index } removeSwarm={removeSwarm}/>)
                                    }))
                                }
                            </div> */}
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
        <Button data-cy="create-team-view-button-93081" 
          icon="close"
          content="Cancel"
          onClick={() => {
            closeTeamModal();
            setOpen(false);
          }}
        />
        <Button data-cy="create-team-view-button-88371" 
          icon="trash"
          content="Remove"
          secondary
          onClick={() => {
            if (modalType === "NewTeam") {
              closeTeamModal();
              setOpen(false);
            } else if (myRole !== "Owner") {
              return;
            } else {
              deleteTeamFromList();
              closeTeamModal();
              setOpen(false);
            }
          }}
          {...css(
            MEMBER_ROLE_PRIORITY.find((m) => m.role === myRole)?.priority < 3 &&
              styles.disableBlock
          )}
        />

        <Button data-cy="create-team-view-button-44385" 
          content="Save"
          icon="save"
          color="green"
          onClick={() => {
            // check if name field is empty
            if (teamName) {
              // check if this team has a owner
              if (!addedNewUsers.find((user) => user.Role === "Owner")) {
                return;
              }
              addNewTeamInfo();
              closeTeamModal();
              setOpen(false);
            }
          }}
          {...css(
            MEMBER_ROLE_PRIORITY.find((m) => m.role === myRole)?.priority < 3 &&
              styles.disableBlock
          )}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default CreateNewTeamComponent;
