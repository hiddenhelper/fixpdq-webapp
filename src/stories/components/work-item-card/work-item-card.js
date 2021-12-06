import React, { useState } from "react";
import { Card, Icon } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
import { css, style } from "glamor";
import "./work-item-card.less";
import { WORKITEM_STATUS } from "../../../components/workitems/workitems-definitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignature, faVacuum, faKeynote, faHandshakeAlt, faQuestion } from "@fortawesome/pro-solid-svg-icons";  
export const CardItem = ({
  name,
  creator,
  priority,
  difficulty,
  status,
  date_due,
}) => {
  // Priority & Difficulty Sliderbar Setting
  const sliderSetting = {
    min: 1,
    max: 4,
    step: 1,
    // onChange: value => {
    //   setValue(value);
    // }
  };

  const styles = {
    cardStyle: {
      borderTop: "solid !important",
      borderWidth: "5px !important",
      maxWidth: "175px !important",
    },
    borderColor_green: {
      borderColor: "green !important",
    },
    borderColor_blue: {
      borderColor: "blue !important",
    },
    borderColor_yellow: {
      borderColor: "yellow !important",
    },
    borderColor_grey: {
      borderColor: "grey !important",
    },
    borderColor_teal: {
      borderColor: "teal !important",
    },
    actionBtnStyle: {
      width: "30px !important",
      height: "30px !important",
      display: "flex !important",
      alignItems: "center !important",
      justifyContent: "center !important",
      borderRadius: "5px !important",
    },
    avatarStyle: {
      width: "25px !important",
      height: "25px !important",
    },
    btnSelected: {
      color: "white",
      backgroundColor: "green",
      borderRadius: "8px",
      border: "solid",
      padding: "5px 10px",
      margin: "0px 5px 0px 0px",
    },
    btnNonSelected: {
      color: "black",
      backgroundColor: "white",
      borderRadius: "8px",
      border: "none",
      padding: "5px 10px",
      margin: "0px 5px 0px 0px",
    },
    viewTypeBtnSelected: {
      backgroundColor: "black",
      color: "white",
      borderRadius: "8px",
      padding: "5px 15px !important",
    },
    viewTypeBtnNonSelected: {
      backgroundColor: "white",
      color: "black",
      borderRadius: "8px",
      padding: "5px 15px !important",
    },
    coachCardStyle: {
      backgroundColor: "rgb(54,54,54) !important",
      color: "white !important",
      maxWidth: "175px !important",
    },
    coachDetailFieldStyle: {
      backgroundColor: "white",
      color: "black",
      borderRadius: "5px",
      padding: "3px 5px",
    },
    peopleCardStyle: {
      backgroundColor: "white !important",
      color: "black !important",
      maxWidth: "175px !important",
    },
    peopleDetailFieldStyle: {
      backgroundColor: "rgb(239,239,239)",
      color: "black",
      borderRadius: "5px",
      padding: "3px 5px",
    },
    imageBackground: {
      width: "40px",
      height: "40px",
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      borderRadius: "7px",
    },
  };

  const [whoNeedsMyHelpSelected, setWhoNeedsMyHelpSelected] = useState(true);
  const [whoNeedToHelpMeSelected, setWhoNeedToHelpMeSelected] = useState(false);

  const viewTypeBtn = (type, selected) => {
    const display = () => {
      if (type === "WhoNeedsMyHelp") {
        return (
          <div
            {...css(
              selected
                ? styles.viewTypeBtnSelected
                : styles.viewTypeBtnNonSelected
            )}
            style={{ marginRight: "30px" }}
            onClick={() => {
              if (!whoNeedsMyHelpSelected) {
                setWhoNeedToHelpMeSelected(false);
              }
              setWhoNeedsMyHelpSelected(!whoNeedsMyHelpSelected);
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <Icon name="group" size="big" />
              <label style={{ fontSize: "x-large" }}>35</label>
            </div>
            <div>WHO NEEDS MY HELP</div>
          </div>
        );
      } else if (type === "WhoNeedToHelpMe") {
        return (
          <div
            {...css(
              selected
                ? styles.viewTypeBtnSelected
                : styles.viewTypeBtnNonSelected
            )}
            onClick={() => {
              if (!whoNeedToHelpMeSelected) {
                setWhoNeedsMyHelpSelected(false);
              }
              setWhoNeedToHelpMeSelected(!whoNeedToHelpMeSelected);
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <Icon name="hand pointer outline" size="big" />
              <label style={{ fontSize: "x-large" }}>12</label>
            </div>
            <div>WHO NEED TO HELP ME</div>
          </div>
        );
      }
    };

    return <>{display()}</>;
  };

  const workItemCard = () => {
    return (
      <Card
        {...css(
          styles.cardStyle,
          WORKITEM_STATUS.find((s) => s.value === status) &&
            WORKITEM_STATUS.find((s) => s.value === status).color === "green" &&
            styles.borderColor_green,
          WORKITEM_STATUS.find((s) => s.value === status) &&
            WORKITEM_STATUS.find((s) => s.value === status).color === "blue" &&
            styles.borderColor_blue,
          WORKITEM_STATUS.find((s) => s.value === status) &&
            WORKITEM_STATUS.find((s) => s.value === status).color ===
              "yellow" &&
            styles.borderColor_yellow,
          WORKITEM_STATUS.find((s) => s.value === status) &&
            WORKITEM_STATUS.find((s) => s.value === status).color === "grey" &&
            styles.borderColor_grey,
          WORKITEM_STATUS.find((s) => s.value === status) &&
            WORKITEM_STATUS.find((s) => s.value === status).color === "teal" &&
            styles.borderColor_teal
        )}
      >
        {/* Header */}
        <Card.Content header={name} className={"cardHeaderStyle"} />

        {/* Card Main Content */}
        <Card.Content>
          {/* Creator */}
          <Card.Description className={"cardDescriptionStyle"}>
            <div>
              Creator <b>{creator}</b>
            </div>
          </Card.Description>

          {/* Priority */}
          <Card.Description className={"cardDescriptionStyle"}>
            <div>
              Priority <b>{priority}</b>
            </div>
          </Card.Description>
          <Slider
            color="grey"
            settings={sliderSetting}
            value={
              priority === "LOW"
                ? 1
                : priority === "MEDIUM"
                ? 2
                : priority === "HIGH"
                ? 3
                : priority === "INSANE"
                ? 4
                : 0
            }
          />

          {/* Difficulty */}
          <Card.Description className={"cardDescriptionStyle"}>
            <div>
              Difficulty <b>{difficulty}</b>
            </div>
          </Card.Description>
          <Slider
            color="grey"
            settings={sliderSetting}
            value={
              difficulty === "LOW"
                ? 1
                : difficulty === "MEDIUM"
                ? 2
                : difficulty === "HIGH"
                ? 3
                : difficulty === "INSANE"
                ? 4
                : 0
            }
          />

          {/* Status */}
          <Card.Description className={"cardDescriptionStyle"}>
            <Icon
              name={
                WORKITEM_STATUS.find((s) => s.value === status) &&
                WORKITEM_STATUS.find((s) => s.value === status).icon
              }
              color={
                WORKITEM_STATUS.find((s) => s.value === status)
                  ? WORKITEM_STATUS.find((s) => s.value === status).color
                  : "black"
              }
              size="large"
            />
            <div>
              <b>
                {WORKITEM_STATUS.find((s) => s.value === status) &&
                  WORKITEM_STATUS.find((s) => s.value === status).title}
              </b>
            </div>
          </Card.Description>

          {/* Due Date */}
          <Card.Description className={"cardDescriptionStyle"}>
            <Icon size="large" name="calendar minus outline" />
            <div>{date_due}</div>
          </Card.Description>

          {/* More details */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Icon size="large" name="info circle" />
            <div>
              <img
                className="ui medium circular image"
                src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
                alt="img"
                {...css(styles.avatarStyle)}
              />
              <img
                className="ui medium circular image"
                src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
                alt="img"
                {...css(styles.avatarStyle)}
              />
            </div>
          </div>
        </Card.Content>

        {/* Right Side Buttons */}
        <div style={{ position: "absolute", top: "20px", right: "-17px" }}>
          <button
            className="ui icon button"
            style={{ backgroundColor: "pink", marginBottom: "5px" }}
            {...css(styles.actionBtnStyle)}
          >
            <i className="lock icon" style={{ color: "white" }}></i>
          </button>

          <button
            className="ui icon button"
            style={{ backgroundColor: "orange", marginBottom: "5px" }}
            {...css(styles.actionBtnStyle)}
          >
            <i className="question icon" style={{ color: "white" }}></i>
          </button>

          <button
            className="ui icon button"
            style={{ backgroundColor: "brown", marginBottom: "5px" }}
            {...css(styles.actionBtnStyle)}
          >
            <i className="quote right icon" style={{ color: "white" }}></i>
          </button>
        </div>
      </Card>
    );
  };

  const coachCard = () => {
    return (
      <Card {...css(styles.coachCardStyle)}>
        {/* Card Main Content */}
        <Card.Content>
          {/* Coach Icon */}
          <Card.Description className={"cardDescriptionStyle"}>
            <div {...css(styles.imageBackground)}>
              <Icon
                name="chat"
                size="big"
                style={{ padding: "0px", margin: "0px" }}
              />
            </div>
          </Card.Description>

          {/* Name */}
          <Card.Description
            className={"cardDescriptionStyle"}
            style={{ marginBottom: "70px" }}
          >
            <Icon name="group" size="large" style={{ color: "white" }} />
            <lable style={{ color: "white" }}>
              <b>TheCoach</b>
            </lable>
          </Card.Description>

          {/* Swarm/Workitem Field */}
          <Card.Description className={"cardDescriptionStyle"}>
            <div {...css(styles.coachDetailFieldStyle)}>
              <div style={{ color: "rgb(155,155,155)" }}>
                <b>SWARM NAME</b>
              </div>
              <div>
                <b>Work item name here....</b>
              </div>
              <div>
                <b>description here....</b>
              </div>
            </div>
          </Card.Description>
        </Card.Content>

        {/* Right Side Buttons */}
        <div style={{ position: "absolute", top: "20px", right: "-17px" }}>
          <button
            className="ui icon button"
            style={{ backgroundColor: "#8CBB76", marginBottom: "5px" }}
            {...css(styles.actionBtnStyle)}
          >
            <FontAwesomeIcon icon={faSignature} color="white"/>
          </button>

          <button
            className="ui icon button"
            style={{ backgroundColor: "#f09176", marginBottom: "5px" }}
            {...css(styles.actionBtnStyle)}
          >
            <FontAwesomeIcon icon={faVacuum} color="white"/>
          </button>
          {/* rgb(200,14,92) // quote */}
          <button
            className="ui icon button"
            style={{ backgroundColor: "#e7c842", marginBottom: "5px" }}
            {...css(styles.actionBtnStyle)}
          >
            <FontAwesomeIcon icon={faKeynote} color="white"/>
          </button>
          
          <button
            className="ui icon button"
            style={{ backgroundColor: "#edae6a", marginBottom: "5px" }}
            {...css(styles.actionBtnStyle)}
          >
            <FontAwesomeIcon icon={faHandshakeAlt} color="white"/>
          </button>

          <button
            className="ui icon button"
            style={{ backgroundColor: "#e27472", marginBottom: "5px" }}
            {...css(styles.actionBtnStyle)}
          >
            <FontAwesomeIcon icon={faQuestion} color="white"/>
          </button>
        </div>
      </Card>
    );
  };

  const peopleCard = () => {
    return (
      <Card {...css(styles.peopleCardStyle)}>
        {/* Card Main Content */}
        <Card.Content>
          {/* Coach Icon */}
          <Card.Description className={"cardDescriptionStyle"}>
              <img
                src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
                alt="img"
                {...css(styles.imageBackground)}
              />
          </Card.Description>

          {/* Name */}
          <Card.Description
            className={"cardDescriptionStyle"}
            style={{ marginBottom: "70px" }}
          >
            <Icon name="group" size="large" />
            <lable>Kris Levchenko</lable>
          </Card.Description>

          {/* Swarm/Workitem Field */}
          <Card.Description className={"cardDescriptionStyle"}>
            <div {...css(styles.peopleDetailFieldStyle)}>
              <div style={{ color: "rgb(155,155,155)" }}>
                <b>SWARM NAME</b>
              </div>
              <div>
                <b>Work item name here....</b>
              </div>
              <div>
                <b>description here....</b>
              </div>
            </div>
          </Card.Description>
        </Card.Content>

        {/* Right Side Buttons */}
        <div style={{ position: "absolute", top: "20px", right: "-17px" }}>
          <button
            className="ui icon button"
            style={{ backgroundColor: "#8CBB76", marginBottom: "5px" }}
            {...css(styles.actionBtnStyle)}
          >
            <FontAwesomeIcon icon={faSignature} color="white"/>
          </button>

          <button
            className="ui icon button"
            style={{ backgroundColor: "#f09176", marginBottom: "5px" }}
            {...css(styles.actionBtnStyle)}
          >
            <FontAwesomeIcon icon={faVacuum} color="white"/>
          </button>
          {/* rgb(200,14,92) // quote */}
          <button
            className="ui icon button"
            style={{ backgroundColor: "#e7c842", marginBottom: "5px" }}
            {...css(styles.actionBtnStyle)}
          >
            <FontAwesomeIcon icon={faKeynote} color="white"/>
          </button>
          
          <button
            className="ui icon button"
            style={{ backgroundColor: "#edae6a", marginBottom: "5px" }}
            {...css(styles.actionBtnStyle)}
          >
            <FontAwesomeIcon icon={faHandshakeAlt} color="white"/>
          </button>

          <button
            className="ui icon button"
            style={{ backgroundColor: "#e27472", marginBottom: "5px" }}
            {...css(styles.actionBtnStyle)}
          >
            <FontAwesomeIcon icon={faQuestion} color="white"/>
          </button>
        </div>
      </Card>
    );
  };
  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <button {...css(styles.btnSelected)}>PEOPLE</button>
        <button {...css(styles.btnNonSelected)}>SWARM OVERVIEW</button>
      </div>
      <div style={{ display: "flex", marginBottom: "20px" }}>
        {viewTypeBtn("WhoNeedsMyHelp", whoNeedsMyHelpSelected)}
        {viewTypeBtn("WhoNeedToHelpMe", whoNeedToHelpMeSelected)}
      </div>
      <Card.Group itemsPerRow={6}>
        {workItemCard()}
        {coachCard()}
        {peopleCard()}
      </Card.Group>
    </>
  );
};

export default CardItem;
