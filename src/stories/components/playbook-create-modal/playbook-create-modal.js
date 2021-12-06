import { css } from "glamor";
import React, { useContext, useState } from "react";
import { Button, Grid, Icon, Input, Modal, TextArea } from "semantic-ui-react";

export const PlayBookCreateModal = () => {
  const [playBookName, setPlayBookName] = useState("");
  const [playBookDescription, setPlayBookDescription] = useState("");

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
      onClose={()=>{}}
      onOpen={()=>{}}
      open="true"
      size="large"
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
              }}
            />
          </div>
        </div>
      </Modal.Header>

      {/* Main Content */}
      <Modal.Content>
        <Grid>
          <Grid.Row columns={16} className="newTeamGridStyle">
            <Grid.Column width={6}>
              <div className="alignSpaceBetween">
                <div>
                  <h4>PlayBook Name<span style={{ color: "red" }}>*</span></h4>
                </div>
                <div>{playBookName.length}/100</div>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <Input
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
                <div><h4>PlayBook Description</h4></div>
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
              <div><h4>Playbook Creator*</h4></div>
              <div>
                <img className="ui avatar image" src="https://react.semantic-ui.com/images/avatar/small/joe.jpg" />
                <span>creator</span>
              </div>
            </Grid.Column>
            <Grid.Column width={10}>
              <div><h4>Workitem name*</h4></div>
              <Input
                  defaultValue={""}
                  maxLength="100"
                  placeholder="Workitem name here..."
                  disabled
              />
              <div><h4>Workitem description*</h4></div>
              <Input
                  defaultValue={""}
                  maxLength="100"
                  placeholder="Workitem description here..."
                  disabled
              />
              
              <div style={{ marginBottom: "20px" }}>
                <div><h4>Creator*</h4></div>
                <div>
                  <img className="ui avatar image" src="https://react.semantic-ui.com/images/avatar/small/joe.jpg" />
                  <span>{"creator"}</span>
                </div>
              </div>
            
              <div style={{ marginBottom: "20px" }}>
                <div><h4>Owner*</h4></div>
                <div>
                  <img className="ui avatar image" src="https://react.semantic-ui.com/images/avatar/small/joe.jpg" />
                  <span>{"owner"}</span>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div><h4>status*</h4></div>
                <div>{"status"}</div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div><h4>priority*</h4></div>
                <div>{"priority"}</div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div><h4>starts*</h4></div>
                <div>{"start date"}</div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div><h4>ends*</h4></div>
                <div>{"end date"}</div>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <div><h4>swarm*</h4></div>
                <div>{"swarm name"}</div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div><h4>Children*</h4></div>
                <div>
                  {"child workitems"}
                </div>
              </div>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>

      {/* Action Buttons */}
      <Modal.Actions>
        <Button
          icon="close"
          content="Cancel"
          onClick={() => {
          }}
        />
        <Button
          icon="trash"
          content="Remove"
          secondary
          onClick={() => {
          }}
        />

        <Button
          content="Save"
          icon="save"
          color="green"
          onClick={() => {
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default PlayBookCreateModal;
