import React from "react";
import { Form, Segment, Image } from "semantic-ui-react";
import "../workitems-edit.less";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { PRIORITY_DIFFICULTY_STATUS } from "../../workitems-definitions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarExclamation,
  faQuestionCircle,
  faFlag,
  faTachometerAltFast,
} from "@fortawesome/pro-solid-svg-icons";
import { css } from "glamor";
import { FIX_THECOACH_BLACK_20 } from "../../../../utils/static-images";

export const DateAndScrumbotColumn = ({ form }) => {
  const { workitemsEditForm, onChange } = form;

  const styles = {
    iconDiv: {
      position: "absolute",
      left: "10px",
      top: "30%",
    },
  };

  const show_Priority_Difficulty = (type, value) => {
    const num =
      PRIORITY_DIFFICULTY_STATUS.find((s) => s.name === value)?.value || 0;
    return PRIORITY_DIFFICULTY_STATUS.map((s, index) => {
      if (index <= num) {
        return (
          <FontAwesomeIcon
            icon={type === "priority" ? faFlag : faTachometerAltFast}
            className={
              PRIORITY_DIFFICULTY_STATUS.find((s) => s.name === value)
                ?.color_card
            }
            style={{ marginRight: "5px" }}
            key={index}
            onClick={()=>{
              form.onChange(null, {
                name: type,
                value: s.name,
              });
            }}
          />
        );
      }
      return (
        <FontAwesomeIcon
          icon={type === "priority" ? faFlag : faTachometerAltFast}
          className="fix_icon_action_grey1_10"
          style={{ marginRight: "5px" }}
          key={index}
          onClick={()=>{
            form.onChange(null, {
              name: type,
              value: s.name,
            });
          }}
        />
      );
    });
  };

  return (
    <Form style={{ minHeight: "300px" }}>
      <div className={"workitem-edit-column "}>
        <div>
          <Form.Field>
            <label className="fix_body2_10">Starts</label>
            <Datetime
              value={new Date(workitemsEditForm.starts)}
              onChange={(date) => {
                onChange(null, { name: "starts", value: date });
              }}
              timeFormat={true}
              dateFormat="DD-MM-YY"
              renderInput={(props) => {
                return (
                  <div style={{ position: "relative" }}>
                    <FontAwesomeIcon
                      icon={faCalendarExclamation}
                      className="fix_icon_bar_10"
                      {...css(styles.iconDiv)}
                    />
                    <input
                      data-cy="date-and-scrumbot-column-input-67624"
                      {...props}
                      className="fix_background_grey1 fix_paragraph_body_12"
                      style={{ paddingLeft: "25px" }}
                    />
                  </div>
                );
              }}
            />
          </Form.Field>
        </div>
        <div>
          <Form.Field>
            <label className="fix_body2_10">Ends</label>
            <Datetime
              value={new Date(workitemsEditForm.ends)}
              onChange={(date) => {
                onChange(null, { name: "ends", value: date });
              }}
              timeFormat={true}
              dateFormat="DD-MM-YY"
              renderInput={(props) => {
                return (
                  <div style={{ position: "relative" }}>
                    <FontAwesomeIcon
                      icon={faCalendarExclamation}
                      className="fix_icon_bar_10"
                      {...css(styles.iconDiv)}
                    />
                    <input
                      data-cy="date-and-scrumbot-column-input-76870"
                      {...props}
                      className="fix_background_grey1 fix_paragraph_body_12"
                      style={{ paddingLeft: "25px" }}
                    />
                  </div>
                );
              }}
            />
          </Form.Field>
        </div>
        <div>
          <Form.Field>
            <span className="fix_body2_10">Scrumbot suggestion</span>
            <Segment style={{ minHeight: "150px" }} className="fix_border_green">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Image
                  src={FIX_THECOACH_BLACK_20}
                  alt="img"
                />
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  className="fix_icon_lmenu_grey3_14"
                />
              </div>

              <div className="fix_font_color_black_12" style={{ marginBottom: "10px" }}>
                Hey, this work item will Start in <span className="fix_font_color_pink_12">3 days</span>, last for <span className="fix_font_color_yellow2_12">1 day</span>
              </div>

              <div style={{ marginBottom: "10px" }} className="fix_body2_grey3_10">
                You many need to add a few sub-work items under this work that will help you manage the time.
              </div>

              <div style={{ marginTop: "10px" }}>
                <label className="fix_body2_grey3_10">Priority <span className="fix_body1_grey3_10">{workitemsEditForm.priority}</span></label>
                <div>
                  {show_Priority_Difficulty("priority", workitemsEditForm.priority)}
                </div>
              </div>

              <div style={{ marginTop: "10px" }}>
                <label className="fix_body2_grey3_10">Difficulty <span className="fix_body1_grey3_10">{workitemsEditForm.difficulty}</span></label>
                <div>
                  {show_Priority_Difficulty("difficulty", workitemsEditForm.difficulty)}
                </div>
              </div>
            </Segment>
          </Form.Field>
        </div>
      </div>
    </Form>
  );
};
