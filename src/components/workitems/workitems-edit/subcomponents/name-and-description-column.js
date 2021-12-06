import { css } from "glamor";
import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useEditor } from "../../../../hooks";
import editorUtils from "../../../../utils/editor";
import { EditorInput, EditorView } from "../../../shared/editor";
import "../workitems-edit.less";

export const NameAndDescriptionColumn = ({ form }) => {
  const styles = {
    field: {
      borderRadius: "8px",
      border: "0 solid #EFF3E0",
    },
    fieldHover: {
      border: "2px solid #63BD46",
      borderRadius: "8px",
    },
    cancelIcon: {
      position: "absolute",
      right: "5px",
      top: "35px",
    },
    editIcon: {
      backgroundColor: "white",
    },
    modal: {
      minWidth: "70vw",
    },
    descriptionContainer: {
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column",
    },
  };

  const { workitemsEditForm, prevState, onChange, clearField } = form;
  const { description, workitemid } = workitemsEditForm;
  const { state: editorInputState, handlers: editorInputHandlers } = useEditor({
    workitemid,
    users: [],
    inputContent: prevState.description,
    changeHandler: () => {
      onChange(null, {
        name: "description",
        value: editorInputHandlers.serializeContent(),
      });
    },
  });
  const [nameHover, setNameHover] = useState(false);
  const [editMode, setEditMode] = useState(prevState.description.length === 0);

  return (
    <div>
      <Form>
        <div className={"workitem-edit-column"}>
          <div className={"workitem-edit-field"}>
            <div className="alignSpaceBetween">
              <div className="fix_body2_10">
                Work item name <span className="fix_color_magenta">*</span>
              </div>
              <div className="fix_title_grey2_12">
                {workitemsEditForm.name ? workitemsEditForm.name.length : 0}/100
              </div>
            </div>
            {nameHover && (
              <Button
                data-cy="name-and-description-column-button-17793"
                circular
                icon="cancel"
                compact
                style={styles.cancelIcon}
                onMouseEnter={() => setNameHover(true)}
                onClick={(e) => {
                  e.preventDefault();
                  clearField("name");
                }}
              />
            )}
            <textarea
              required
              clearable
              name={"name"}
              onChange={(event) => {
                onChange(null, { name: "name", value: event.target.value });
              }}
              value={workitemsEditForm.name}
              placeholder="Work item name"
              rows={3}
              style={nameHover ? styles.fieldHover : styles.field}
              onMouseEnter={() => setNameHover(true)}
              onMouseLeave={() => setNameHover(false)}
              maxLength="100"
              className="fix_background_grey1 fix_paragraph_body_12"
            />
          </div>
          <div style={{ position: "relative" }}>
            <div {...css(styles.descriptionContainer)}>
              <div>
                <div className="alignSpaceBetween">
                  <div className="fix_body2_10">Description</div>
                  <div className="fix_title_grey2_12">
                    {description
                      ? editorUtils.getTextFromStringForCharCount(description)
                          .length
                      : 0}
                    /3000
                  </div>
                </div>
                <div>
                  {!editMode && (
                    <Button
                      data-cy="name-and-description-column-button-34071"
                      circular
                      icon="edit"
                      compact
                      style={styles.editIcon}
                      onClick={(e) => {
                        e.preventDefault();
                        setEditMode(true);
                      }}
                    />
                  )}
                </div>
              </div>
              <div>
                {editMode ? (
                  <EditorInput
                    data-cy="name-and-description-column-input-72504"
                    state={editorInputState}
                    handlers={editorInputHandlers}
                    height={"230px"}
                    placeholder={"Description"}
                  />
                ) : (
                  <EditorView content={description} height={"230px"} />
                )}
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
