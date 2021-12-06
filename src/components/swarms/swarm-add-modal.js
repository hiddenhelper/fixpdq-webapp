/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "glamor";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Form,
  Grid,
  Message,
  Modal,
} from "semantic-ui-react";
import { createSwarm } from "../../services/swarms";
import { SwarmsContext, UsersContext } from "../../store/context";
import MemberItem from "../shared/subcomponents/member-item.view";
import SearchBarMember from "../shared/subcomponents/search-bar-member.view";
import UserContext from "../user/context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faTrash,
  faCopy,
  faSave,
  faTimes,
} from "@fortawesome/pro-solid-svg-icons";

const CreateSwarmModal = ({ openModal, setOpenModal }) => {
  const { swarmsDropdownOptions, fetchSwarmsList } = useContext(SwarmsContext);
  const { users, success: usersLoadingSuccess } = useContext(UsersContext);

  const [addSwarmErrorMessage, setAddSwarmErrorMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [inputSwarmName, setInputSwarmName] = useState("");
  const [inputSwarmDescription, setInputSwarmDescription] = useState("");

  const context = useContext(UserContext);
  const creatorid = context.user.username;
  const [swarmCreator, setSwarmCreator] = useState();
  const [addedNewUsers, setAddedNewUsers] = useState([]);
  const [isRequestOnFlight, setIsRequestOnFlight] = useState(false);
  const [hoverEffect, setHoverEffect] = useState({
    name: false,
    description: false,
  });
  let history = useHistory();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const creator = {
          ...users.find((s) => s.Username === creatorid),
          Role: "Creator",
        };
        const owner = {
          ...users.find((s) => s.Username === creatorid),
          Role: "Owner",
        };
        setSwarmCreator(creator);
        setAddedNewUsers([{ ...owner }]);
      } catch (err) {
        console.log(err);
      }
    };
    if (usersLoadingSuccess) {
      fetchUsers();
    }
  }, []);

  const toggleModal = () => {
    setOpenModal(!openModal);
    setInputSwarmName("");
    setHasError(false);
    history.push({
      pathname: "./swarm-management",
    });
  };

  const handleError = (message) => {
    setAddSwarmErrorMessage(message);
    setHasError(true);
  };

  const clearError = () => {
    setAddSwarmErrorMessage("");
    setHasError(false);
  };

  const isExisting = () => {
    if (swarmsDropdownOptions) {
      if (
        swarmsDropdownOptions.find((swarm) => swarm.text === inputSwarmName)
      ) {
        handleError(`The swarm "${inputSwarmName}" already exists.`);
        return true;
      }
    }
    return false;
  };

  const isValid = () => {
    if (inputSwarmName.trim() === "") {
      handleError(`Empty string not allowed.`);
      return false;
    }

    if (inputSwarmName.trim() != inputSwarmName) {
      handleError(`Cannot start or end with space.`);
      return false;
    }

    if (inputSwarmName.indexOf("  ") >= 0) {
      handleError(`Contiguous spaces not allowed.`);
      return false;
    }

    if (addedNewUsers.findIndex((user) => user.Role === "Owner") === -1) {
      handleError(`Owner is not existing in this swarm`);
      return false;
    }

    return true;
  };

  const addSwarm = async () => {
    clearError();
    const doesSwarmExist = isExisting();
    const isValueValid = isValid();
    if (!doesSwarmExist && isValueValid) {
      setIsRequestOnFlight(true);
      const creator = swarmCreator.Username;
      let owner;
      let updatedUsers = [];
      addedNewUsers.forEach((user) => {
        if (user.Role === "Owner") {
          owner = user.Username;
        } else {
          updatedUsers.push({
            userid: user.Username,
            userrole: user.Role.charAt(0),
          });
        }
      });
      try {
        await createSwarm({
          name: `${inputSwarmName}`,
          description: `${inputSwarmDescription}`,
          owner: `${owner}`,
          creator: `${creator}`,
          users: updatedUsers,
        });
        await fetchSwarmsList();
        setIsRequestOnFlight(false);
        toggleModal();
      } catch (err) {
        console.log(err);
        setIsRequestOnFlight(false);
      }
    }
  };

  const handleMessage = (e) => {
    const regexRule = /^([\p{N}\p{L}A-Za-z0-9_\-']|([\p{N}\p{L}A-Za-z0-9_\-'][\p{L}\p{N}A-Za-z0-9_\-' ]{0,30}[\p{L}\p{N}A-Za-z0-9_\-' ]))$/u;
    if (e.target.value === "" || regexRule.test(e.target.value)) {
      setInputSwarmName(e.target.value);
    }
  };

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
  };

  const removeUser = (username) => {
    setAddedNewUsers(
      addedNewUsers.filter((item) => item.Username !== username)
    );
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
    const index = addedNewUsers.findIndex(
      (element) => element.Username === username
    );
    if (index !== -1) {
      updatedMembers[index] = {
        ...updatedMembers[index],
        Role: role,
      };
      setAddedNewUsers(updatedMembers);
    }
  };

  return (
    <Modal
      closeOnEscape={true}
      open={openModal}
      onClose={toggleModal}
      size="small"
    >
      <Modal.Header>
        <div className="workitems-edit-header" style={{ marginBottom: "30px" }}>
          <span className="fix_menu_12">Add New Swarm</span>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              className={"fix_icon_hero_24"}
              onClick={toggleModal}
            />
          </div>
        </div>
      </Modal.Header>
      <Modal.Content>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Form>
                <Form.Field required>
                  <div className="alignSpaceBetween">
                    <div className="fix_body2_10">
                      Swarm name<span className="fix_color_magenta">*</span>
                    </div>
                    <div className="fix_title_grey2_12">
                      {inputSwarmName ? inputSwarmName.length : 0}/100
                    </div>
                  </div>
                  <textarea
                    required
                    clearable
                    rows={3}
                    maxLength="100"
                    placeholder="swarm name"
                    value={inputSwarmName}
                    onChange={handleMessage}
                    data-cy="swarm-name-input-new"
                    className="fix_background_grey1 fix_paragraph_body_12"
                    onMouseEnter={() =>
                      setHoverEffect({ ...hoverEffect, name: true })
                    }
                    onMouseLeave={() =>
                      setHoverEffect({ ...hoverEffect, name: false })
                    }
                    style={hoverEffect.name ? styles.fieldHover : styles.field}
                  />
                </Form.Field>
                <Form.Field>
                  <div className="alignSpaceBetween">
                    <div className="fix_body2_10">
                      Description
                      <span className="fix_color_magenta">*</span>
                    </div>
                    <div className="fix_title_grey2_12">
                      {inputSwarmDescription ? inputSwarmDescription.length : 0}
                      /300
                    </div>
                  </div>
                  <textarea
                    data-cy="swarm-desc-input-new"
                    maxLength="300"
                    placeholder="swarm description"
                    value={inputSwarmDescription}
                    onChange={(e) => {
                      setInputSwarmDescription(e.target.value);
                    }}
                    onMouseEnter={() =>
                      setHoverEffect({ ...hoverEffect, description: true })
                    }
                    onMouseLeave={() =>
                      setHoverEffect({ ...hoverEffect, description: false })
                    }
                    style={
                      hoverEffect.description ? styles.fieldHover : styles.field
                    }
                    {...css(styles.fullWidth, styles.textAreaStyle)}
                    className="fix_background_grey1 fix_paragraph_body_12"
                  />
                </Form.Field>
              </Form>
            </Grid.Column>

            <Grid.Column>
              <div className="marginBottom20">
                {/* Swarm Creator */}
                <div
                  className="alignSpaceBetween"
                  style={{ alignItems: "center" }}
                >
                  <div className="fix_body2_10">
                    Creator <span className="fix_color_magenta">*</span>
                  </div>
                  <div className="fix_title_grey2_12">
                    The one who created the swarm 1/1
                  </div>
                </div>
                <MemberItem user={swarmCreator} myRole="Creator" />
              </div>
              <label className="fix_body2_10">Interested Party</label>
              <SearchBarMember addUser={addUser} allUsers={users} />
              <div className="addedMemberGroupStyle">
                {addedNewUsers &&
                  addedNewUsers.map((element, index) => {
                    return (
                      <MemberItem
                        key={index}
                        user={element}
                        myRole="Creator"
                        removeUser={removeUser}
                        changeUserRole={changeUserRole}
                      />
                    );
                  })}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Message
          header="Error"
          error={hasError}
          visible={hasError}
          hidden={!hasError}
          content={addSwarmErrorMessage}
          compact
          negative
        />
      </Modal.Content>

      <Modal.Actions>
        <div {...css(styles.swarms_edit_buttons)}>
          <div
            data-cy="swarm-edit-modal-button-25201"
            disabled={isRequestOnFlight}
            onClick={toggleModal}
            className="fix_border_black_2 fix_background_white fix_submenu_8"
            style={{ cursor: "pointer", marginRight: "5px" }}
          >
            <FontAwesomeIcon
              icon={faTimesCircle}
              style={{ marginRight: "5px" }}
            />
            Cancel
          </div>

          <div
            data-cy="workitem-edit-modal-footer-button-20533"
            disabled={isRequestOnFlight}
            className="fix_border_black_2 fix_background_black fix_submenu_white_8"
            style={{ cursor: "pointer", marginRight: "5px" }}
          >
            <FontAwesomeIcon icon={faTrash} style={{ marginRight: "5px" }} />
            Remove
          </div>

          <div
            data-cy="workitem-edit-modal-footer-button-10012"
            disabled={isRequestOnFlight}
            className="fix_border_black_2 fix_background_black fix_submenu_white_8"
            style={{ cursor: "pointer", marginRight: "5px" }}
          >
            <FontAwesomeIcon icon={faCopy} style={{ marginRight: "5px" }} />
            Copy
          </div>

          <div
            data-cy="swarm-edit-modal-button-32823"
            disabled={isRequestOnFlight}
            onClick={() => addSwarm()}
            className="fix_border_yellow_2 fix_background_yellow2 fix_submenu_8"
            style={{ cursor: "pointer", marginRight: "5px" }}
          >
            <FontAwesomeIcon icon={faSave} style={{ marginRight: "5px" }} />
            Save
          </div>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

const styles = {
  fullWidth: {
    width: "100% !important",
    marginBottom: "5px !important",
  },
  fullHeight: {
    height: "80% !important",
  },
  textAreaStyle: {
    minHeight: "300px !important",
  },
  field: {
    borderRadius: "8px",
    border: "0 solid #EFF3E0",
  },
  fieldHover: {
    border: "2px solid #63BD46",
    borderRadius: "8px",
  },
  swarms_edit_buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
};

export default CreateSwarmModal;
