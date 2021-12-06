import { css } from "glamor";
import React, { useState } from "react";
import { Button, Icon, Modal } from "semantic-ui-react";
import { ParentNextSwarmRow } from "./parent-next-swarm-row";

export const MoveWorkitemModal = ({
  openMoveWorkitemModal,
  closeMoveWorkitemModal,
  saveMoveWorkitem,
  tree,
  nodeMapWorkitemId,
  form,
  swarmsDropdownOptions,
}) => {
  const { isRequestOnFlight } = form;

  const styles = {
    content: {
      height: "250px !important"
    }
  };

  return (
    <Modal
      closeOnEscape={true}
      onClose={() => closeMoveWorkitemModal()}
      open={openMoveWorkitemModal}
      size="large"
      // style={styles.content}
    >
      {/* Header */}
      <Modal.Header className="modalHeaderStyle">
        <div className="alignSpaceBetween">
          <div style={{ fontSize: "16px" }}>Move Work Item</div>
          <div>
            <Icon
              name="times circle outline"
              size="large"
              onClick={() => closeMoveWorkitemModal()}
            />
          </div>
        </div>
      </Modal.Header>

      {/* Main Content */}
      <Modal.Content scrolling {...css(styles.content)}>
        <ParentNextSwarmRow
          tree={tree}
          nodeMapWorkitemId={nodeMapWorkitemId}
          form={form}
          swarmsDropdownOptions={swarmsDropdownOptions}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button data-cy="move-workitem-modal-button-70702" 
          onClick={() => saveMoveWorkitem()}
          color="green"
          disabled={isRequestOnFlight}
        >
          <Icon name="arrows alternate" />
          Move
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default MoveWorkitemModal;
