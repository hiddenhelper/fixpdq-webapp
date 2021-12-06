import React, { memo, useEffect, useState } from "react";
import {
  Grid,
  Image,
  Message,
  Modal,
  Segment,
} from "semantic-ui-react";
import { usePlaybookAddModal } from "../../../hooks";
import { PlayBookAddModal, PlayBookCreateModal } from "../../playbook";
import {
  CreatorAndOwnerColumn,
  DateAndScrumbotColumn,
  MoveWorkitemModal,
  NameAndDescriptionColumn,
  WorkitemEditModalFooter,
} from "./subcomponents";
import "./workitems-edit.less";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faTimes,
  faArrowsAlt,
  faQuestionCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FIX_THECOACH_BLACK_20 } from "../../../utils/static-images";

const styles = {
  field: {
    backgroundColor: "#EFF3E0",
    borderRadius: "5px",
    border: "0 solid #EFF3E0",
  },
  fieldHover: {
    border: "2px solid #63BD46",
    backgroundColor: "#EFF3E0",
    borderRadius: "5px",
  },
  cancelIcon: {
    position: "absolute",
    right: "5px",
    top: "35px",
  },
  charCount: {
    position: "absolute",
    right: "5px",
    top: "0",
    fontSize: "0.75rem",
  },
  modal: {
    minWidth: "70vw",
  },
};

const WorkitemEditModal = memo(
  ({
    tree,
    nodeMapWorkitemId,
    params,
    treeParams,
    allUsers,
    form,
    handleSubmit,
    swarmsDropdownOptions,
    // currentStatus,
    // statusActionHandlers,
    createPlayBook,
    downloadAttachment,
    removeWorkitem,
    playbookid,
    saveMoveWorkitem,
  }) => {
    const {
      workitemToEdit,
      openWorkitemEditModal,
      closeWorkitemModal,
      isMoveWorkitem,
    } = params;

    const playbookAddForm = usePlaybookAddModal({
      owner: form.prevState.owner,
      creator: form.prevState.creator,
      workitemid: workitemToEdit,
      swarmid: form.workitemsEditForm.swarm,
      swarm_name: form.workitemsEditForm.swarmName,
      getLastChild: treeParams.getLastChild,
    });

    const { hasError, workitemsEditErrorMessage, clearError } = form;

    const [openPlayBookModal, setOpenPlayBookModal] = useState(false);
    const [originalFormData, setOriginalFormData] = useState(null);
    const [isFormSaved, setIsFormSaved] = useState(true);
    const [openMoveWorkitemModal, setOpenMoveWorkitemModal] = useState(
      isMoveWorkitem
    );

    const checkFileSize = (file) => {
      let maxSize = 1024 * 1024 * 20;
      if (file.size > maxSize) {
        return false;
      }
      return true;
    };

    useEffect(() => {
      setOriginalFormData(form.workitemsEditForm);
    }, [form.workitemsEditForm]);

    useEffect(() => {
      if (
        JSON.stringify(originalFormData) !==
        JSON.stringify(form.workitemsEditForm)
      ) {
        setIsFormSaved(false);
      } else {
        setIsFormSaved(true);
      }
    }, [originalFormData, form.workitemsEditForm]);

    const closeMoveWorkitemModal = () => {
      setOpenMoveWorkitemModal(false);
      closeWorkitemModal();
    };

    return (
      <>
        {openPlayBookModal && (
          <PlayBookCreateModal
            openPlayBookModal={openPlayBookModal}
            setOpenPlayBookModal={setOpenPlayBookModal}
            createPlayBook={createPlayBook}
            swarmid={form.workitemsEditForm.swarm}
            swarmsDropdownOptions={swarmsDropdownOptions}
          />
        )}
        {playbookAddForm.openAddPlayBookModal && (
          <PlayBookAddModal
            form={playbookAddForm}
            swarmid={form.workitemsEditForm.swarm}
            swarmsDropdownOptions={swarmsDropdownOptions}
          />
        )}
        {openMoveWorkitemModal && (
          <MoveWorkitemModal
            openMoveWorkitemModal={openMoveWorkitemModal}
            tree={tree}
            nodeMapWorkitemId={nodeMapWorkitemId}
            form={form}
            swarmsDropdownOptions={swarmsDropdownOptions}
            closeMoveWorkitemModal={closeMoveWorkitemModal}
            saveMoveWorkitem={saveMoveWorkitem}
          />
        )}
        {!openPlayBookModal &&
          !playbookAddForm.openAddPlayBookModal &&
          !openMoveWorkitemModal && (
            <Modal
              closeOnEscape={true}
              open={openWorkitemEditModal}
              onClose={() => {
                closeWorkitemModal();
              }}
              size="fullscreen"
              style={styles.modal}
            >
              <Modal.Content>
                <div className={"workitems-edit-header"}>
                  <div className="fix_menu_12">Edit work item</div>
                  <div className={"workitems-edit-header"}>
                    <button
                      className="playbookBtnStyle fix_border_grey_1"
                      onClick={() => {
                        setOpenPlayBookModal(true);
                      }}
                      disabled={!isFormSaved}
                    >
                      <FontAwesomeIcon
                        icon={faBolt}
                        className={"fix_icon_rmenu_14"}
                        style={{ marginRight: "5px" }}
                      />
                      <span className="fix_menu_12">Save as Playbook</span>
                    </button>
                    <button
                      className="playbookBtnStyle fix_border_grey_1"
                      onClick={() => {
                        playbookAddForm.setOpenAddPlayBookModal(true);
                      }}
                      disabled={!isFormSaved}
                    >
                      <FontAwesomeIcon
                        icon={faBolt}
                        className={"fix_icon_rmenu_14"}
                        style={{ marginRight: "5px" }}
                      />
                      <span className="fix_menu_12">Apply Playbook</span>
                    </button>

                    <FontAwesomeIcon
                      data-cy="workitems-edit-view-button-62072"
                      icon={faTimes}
                      className={"fix_icon_hero_24"}
                      onClick={() => {
                        clearError();
                        closeWorkitemModal();
                      }}
                    />
                  </div>
                </div>
              </Modal.Content>
              <Modal.Content>
                <Grid>
                  <Grid.Row>
                    <div className={"workitems-edit-context-parent-row"}>
                      <Context
                        setOpenMoveWorkitemModal={setOpenMoveWorkitemModal}
                      />
                    </div>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={4}>
                      <NameAndDescriptionColumn form={form} />
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <DateAndScrumbotColumn form={form} />
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <CreatorAndOwnerColumn
                        form={form}
                        allUsers={allUsers}
                        playbookid={playbookid}
                      />
                    </Grid.Column>
                    <Grid.Column width={4} className="fix_border_green">
                      {/* <ScrumbotOnlyColumn /> */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <Image src={FIX_THECOACH_BLACK_20} alt="img" />
                        <FontAwesomeIcon
                          icon={faQuestionCircle}
                          className="fix_icon_lmenu_grey3_14"
                        />
                      </div>
                      <div className="fix_title_12">
                        Attachments:
                        {form.workitemsEditForm.downloadFileURL &&
                          form.workitemsEditForm.downloadFileURL.map(
                            (url, index) => {
                              return (
                                <div
                                  onClick={() => {
                                    downloadAttachment(
                                      url,
                                      form.workitemsEditForm.files[index].name
                                    );
                                  }}
                                >
                                  {form.workitemsEditForm.files[index].name}
                                </div>
                              );
                            }
                          )}
                      </div>
                      <input
                        data-cy="workitems-edit-view-input-23382"
                        type="file"
                        name="file"
                        multiple
                        onChange={(event) => {
                          let files = event.target.files;
                          let flag = true;
                          for (let i = 0; i < files.length; i++) {
                            if (!checkFileSize(files[i])) {
                              flag = false;
                              break;
                            }
                          }
                          if (flag) {
                            form.setAttachments(event.target.files);
                          }
                        }}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                <Message
                  header="Error"
                  error={hasError}
                  visible={hasError}
                  hidden={!hasError}
                  content={workitemsEditErrorMessage}
                  compact
                  negative
                />
              </Modal.Content>

              <Modal.Actions>
                <WorkitemEditModalFooter
                  form={form}
                  closeWorkitemModal={closeWorkitemModal}
                  handleSubmit={handleSubmit}
                  clearError={clearError}
                  // currentStatus={currentStatus}
                  // statusActionHandlers={statusActionHandlers}
                  removeWorkitem={removeWorkitem}
                />
              </Modal.Actions>
            </Modal>
          )}
      </>
    );
  }
);

const Context = ({ setOpenMoveWorkitemModal }) => {
  // const sections = [
  //   { key: "workitem1", content: "Work item name", link: true },
  //   { key: "workitem2", content: "Work item name", link: true },
  // ];

  return (
    <Segment basic>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {/* <Breadcrumb
          style={{ marginLeft: "10px" }}
          icon="right angle"
          sections={sections}
        /> */}
        {/* <div>Context</div> */}
        <div
          className="moveWorkitemBtn fix_border_grey_1"
          onClick={() => {
            setOpenMoveWorkitemModal(true);
          }}
        >
          <FontAwesomeIcon
            icon={faArrowsAlt}
            className={"fix_icon_rmenu_14"}
            style={{ marginRight: "5px" }}
          />
          <span className="fix_paragraph_body_12">move this work item</span>
        </div>
      </div>
    </Segment>
  );
};

export default WorkitemEditModal;
