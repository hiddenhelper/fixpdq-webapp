import { css } from "glamor";
import React from "react";
import { Button, Icon, Input } from "semantic-ui-react";
import WorkItemThreadModalTopic from "./subcomponents/workitem-thread-modal-topic.view";
import "./workitem-thread-modal.view.less";

export const WorkItemThreadModalView = (props) => {
  const styles = {
    avatarStyle: {
      width: "30px !important",
      height: "30px !important",
      marginRight: "-10px !important",
    },
    avatarBorder: {
      border: "solid",
      borderWidth: "2px",
      borderColor: "white",
    },
    splitDiv: {
      width: "2px",
      height: "35px",
      backgroundColor: "rgb(244,244,244)",
    },
  };

  return (
    <div className="workItemThreadModalBodyStyle">
      {/* Header */}
      <div
        className="displayFlex marginBottom20"
        style={{ justifyContent: "space-between" }}
      >
        <div>
          {" "}
          <h3>Work item name</h3>{" "}
        </div>
        <div>
          <button className="ThreadModalBodyBtnSelectedStyle">
            {" "}
            <h4>Conversations</h4>{" "}
          </button>
          <button className="ThreadModalBodyBtnNonSelectedStyle">
            {" "}
            <h4>Context</h4>{" "}
          </button>
          <button className="ThreadModalBodyBtnNonSelectedStyle">
            {" "}
            <h4>The Coach</h4>{" "}
          </button>
          <Icon name="times circle outline" size="large" />
        </div>
      </div>
      {/* Filter Bar*/}
      <div className="workItemThreadModalFilterBar marginBottom20 marginRight40">
        <div
          className="displayFlex marginLR10"
          style={{ justifyContent: "space-between" }}
        >
          <div className="displayFlex">
            <div>SORT BY TIME</div>
            <div className="ui toggle checkbox">
              <label> </label>
              <input type="checkbox" name="public" />
            </div>
          </div>

          <div className="displayFlex">
            <div className="marginLR10">
              <div>People connected</div>
              <div>to this task:</div>
            </div>
            <div className="displayFlex marginLR10">
              <img
                className="ui medium circular image"
                style={{ zIndex: 999 }}
                src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
                alt="img"
                {...css(styles.avatarStyle, styles.avatarBorder)}
              />
              <img
                className="ui medium circular image"
                style={{ zIndex: 998 }}
                src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
                alt="img"
                {...css(styles.avatarStyle, styles.avatarBorder)}
              />
              <img
                className="ui medium circular image"
                style={{ zIndex: 997 }}
                src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
                alt="img"
                {...css(styles.avatarStyle, styles.avatarBorder)}
              />
            </div>
            <button className="ThreadModalBodyPlusBtn">
              <i className="plus icon ThreadModalBodyPlusIcon" size="large" />
            </button>
          </div>
        </div>
      </div>
      {/* Conversation Section */}
      <div className="ThreadModalConversationSection paddingRight40">
        <WorkItemThreadModalTopic />
        <WorkItemThreadModalTopic />
      </div>
      {/* Footer */}
      <div className="paddingRight40 ThreadModalFooterStyle">
        <Input
          focus
          placeholder="write text here"
          className="fullWidth marginBottom20"
        />
        <div
          className="displayFlex"
          style={{ justifyContent: "space-between" }}
        >
          <div className="displayFlex">
            <div style={{ marginRight: "5px" }}>Actions</div>
            <Icon name="lock icon" size="large" />
            <Icon name="question icon" size="large" />
            <Icon name="cut icon" size="large" />
            <Icon name="clipboard check icon" size="large" />
            <Icon name="handshake icon" size="large" />
            <Icon name="caret down icon" size="large" />
            <div {...css(styles.splitDiv)} className="marginLR10" />
            <Icon name="attach icon" size="large" />
          </div>

          <Button style={{ padding: "10px 15px" }}>
            <Icon name="send icon" size="large" />
            {"  Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkItemThreadModalView;
