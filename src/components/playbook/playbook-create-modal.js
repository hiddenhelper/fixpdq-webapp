import { css } from "glamor";
import React, { useState } from "react";
import {
  Button,
  Dropdown,
  Grid,
  Icon,
  Input,
  Modal,
  TextArea,
} from "semantic-ui-react";

export const PlayBookCreateModal = ({
  openPlayBookModal,
  setOpenPlayBookModal,
  createPlayBook,
  swarmid,
  swarmsDropdownOptions,
}) => {
  const [playBookName, setPlayBookName] = useState("");
  const [playBookDescription, setPlayBookDescription] = useState("");
  const [selectedSwarm, setSelectedSwarm] = useState({
    swarmId: swarmid,
    swarmName: swarmsDropdownOptions.find((s) => s.value === swarmid).text,
  });

  const styles = {
    fullHeight: {
      height: "80% !important",
    },
    fullWidth: {
      width: "100% !important",
      marginBottom: "5px !important",
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

  return (
    <Modal
      onClose={() => setOpenPlayBookModal(false)}
      onOpen={() => setOpenPlayBookModal(true)}
      open={openPlayBookModal}
      size="mini"
      {...css(styles.fullHeight)}
    >
      {/* Header */}
      <Modal.Header className="modalHeaderStyle">
        <div className="alignSpaceBetween">
          <div style={{ fontSize: "16px" }}>Create a New PlayBook</div>
          <div>
            <Icon
              name="times circle outline"
              size="large"
              onClick={() => {
                setOpenPlayBookModal(false);
              }}
            />
          </div>
        </div>
      </Modal.Header>

      {/* Main Content */}
      <Modal.Content>
        <Grid>
          <Grid.Row columns={16} className="newTeamGridStyle">
            <Grid.Column width={16}>
              <div className="alignSpaceBetween">
                <div>
                  <h4>
                    PlayBook Name<span style={{ color: "red" }}>*</span>
                  </h4>
                </div>
                <div>{playBookName.length}/100</div>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <Input data-cy="playbook-create-modal-input-63732" 
                  defaultValue={playBookName}
                  maxLength="100"
                  placeholder="Input PlayBook name here..."
                  {...css(
                    styles.fullWidth,
                    styles.textInputStyle,
                    !playBookName && styles.textInputBorderRed
                  )}
                  onChange={(e) => {
                    setPlayBookName(e.target.value);
                  }}
                />
              </div>

              <div className="alignSpaceBetween">
                <div>
                  <h4>PlayBook Description</h4>
                </div>
                <div>{playBookDescription.length}/300</div>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <TextArea
                  defaultValue={playBookDescription}
                  maxLength="300"
                  placeholder="Input PlayBook description here..."
                  {...css(styles.fullWidth, styles.textAreaStyle)}
                  onChange={(e) => {
                    setPlayBookDescription(e.target.value);
                  }}
                />
              </div>

              <div>
                Select Swarm:
                <Dropdown
                  placeholder="Swarms"
                  fluid
                  name="swarm"
                  search
                  value={selectedSwarm.swarmId}
                  onChange={(event, data) => {
                    setSelectedSwarm({
                      swarmId: data.value,
                      swarmName: swarmsDropdownOptions.find(
                        (s) => s.value === data.value
                      ).text,
                    });
                  }}
                  selection
                  options={swarmsDropdownOptions}
                />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>

      {/* Action Buttons */}
      <Modal.Actions>
        <Button data-cy="playbook-create-modal-button-16907" 
          icon="close"
          content="Cancel"
          onClick={() => {
            setOpenPlayBookModal(false);
          }}
        />
        <Button data-cy="playbook-create-modal-button-83814" 
          content="Save"
          icon="save"
          color="green"
          onClick={async () => {
            if (playBookName) {
              await createPlayBook(playBookName, playBookDescription, selectedSwarm.swarmId, selectedSwarm.swarmName);
              setOpenPlayBookModal(false);
            }
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

