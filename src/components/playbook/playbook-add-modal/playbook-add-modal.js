import { css } from "glamor";
import React from "react";
import {
  Button,
  Dropdown,
  Grid,
  Icon,
  Message,
  Modal,
} from "semantic-ui-react";

import "./playbook-add-modal.less";

export const PlayBookAddModal = ({ form }) => {
  const styles = {
    fullHeight: {
      height: "30% !important",
    },
    fullWidth: {
      width: "100% !important",
      marginBottom: "5px !important",
    },
    columnFlexLayout: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      "& > *": {
        marginBottom: "20px",
      },
    },
    label: {
      marginBottom: "5px",
    },
  };

  const {
    playbookid,
    playbooks,
    selectedSwarm,
    openAddPlayBookModal,
    swarmsDropdownOptions,
    setOpenAddPlayBookModal,
    setSelectedSwarm,
    setPlaybookid,
    errorMessage,
    hasError,
    isRequestOnFlight,
    handleAddClick,
  } = form;

  return (
    <Modal
      onClose={() => setOpenAddPlayBookModal(false)}
      onOpen={() => setOpenAddPlayBookModal(true)}
      open={openAddPlayBookModal}
      size="mini"
      {...css(styles.fullHeight)}
    >
      {/* Header */}
      <Modal.Header className="modalHeaderStyle">
        <div className="alignSpaceBetween">
          <div style={{ fontSize: "16px" }}>Apply Playbook</div>
          <div>
            <Icon
              name="times circle outline"
              size="large"
              onClick={() => {
                setOpenAddPlayBookModal(false);
              }}
            />
          </div>
        </div>
      </Modal.Header>

      {/* Main Content */}
      <Modal.Content>
        <Grid>
          <Grid.Row columns={16} className="playbook-add-modal-grid-style">
            <Grid.Column width={16}>
              <div {...css(styles.columnFlexLayout)}>
                <div>
                  <div {...css(styles.label)}>
                    <h4>
                      Select PlayBook<span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                  <Dropdown
                    placeholder={
                      playbooks.length > 0
                        ? "Choose a playbook"
                        : "No playbooks found"
                    }
                    fluid
                    name="playbook"
                    search
                    value={playbookid}
                    onChange={(event, data) => {
                      setPlaybookid(data.value);
                    }}
                    selection
                    options={playbooks}
                  />
                </div>
                <div>
                  <div {...css(styles.label)}>
                    <div>Select Swarm:</div>
                  </div>
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
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Message
          header="Error"
          error={hasError}
          visible={hasError}
          hidden={!hasError}
          content={errorMessage}
          compact
          negative
        />
      </Modal.Content>

      {/* Action Buttons */}
      <Modal.Actions>
        <Button data-cy="playbook-add-modal-button-86658" 
          icon="close"
          disabled={isRequestOnFlight}
          content="Cancel"
          onClick={() => {
            setOpenAddPlayBookModal(false);
          }}
        />
        <Button data-cy="playbook-add-modal-button-3073" 
          content="Add"
          icon="plus"
          disabled={isRequestOnFlight}
          color="green"
          onClick={handleAddClick}
        />
      </Modal.Actions>
    </Modal>
  );
};
