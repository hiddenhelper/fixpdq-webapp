import { faSearch } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "glamor";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  Image,
  Input,
  Segment,
  Sidebar,
} from "semantic-ui-react";
import { getPlaybooksBySwarmsList } from "../../services/playbook";
import {
  CoachModalContext,
  CurrentPlaybookContext,
  CurrentSwarmContext,
} from "../../store/context";
import { FIX_THECOACH_BLACK2_20 } from "../../utils/static-images";
import WorkItemThreadModal from "../workitems/workitem-thread-modal/workitem-thread-modal";
import PlayBookCard from "./playbook-card.view";
import {
  PlayBookFilterListForCreator,
  PlayBookFilterListForSwarm,
  PlayBookFilterListForTag,
  PlayBookFilterListForUsage,
} from "./playbook-definitions";
import PlayBookFilterBar from "./playbook-filter";
import "./playbook.less";

export const PlayBook = () => {
  const { currentSwarm } = useContext(CurrentSwarmContext);
  const { upadateCurrentPlaybook } = useContext(CurrentPlaybookContext);
  let history = useHistory();
  const [playbooksList, setPlaybooksList] = useState([]);
  const [cardType, setCardType] = useState("MyPlaybook");
  const [threadVisible, setThreadVisible] = useState("init");
  const { openCoachModal, setOpenCoachModal } = useContext(CoachModalContext);

  useEffect(() => {
    const fetchPlaybooks = async () => {
      try {
        const result = await getPlaybooksBySwarmsList(
          "all_swarms",
          currentSwarm.chosenSwarms
        );
        setPlaybooksList(result);
      } catch (error) {
        console.log("There is a error with getPlaybooksBySwarm", error);
      }
    };
    if (currentSwarm) {
      fetchPlaybooks();
    }
  }, [currentSwarm]);

  useEffect(() => {
    if (openCoachModal) {
      setThreadVisible("open");
    }
  }, [openCoachModal]);

  const onPlayBookCardClicked = (index) => {
    upadateCurrentPlaybook(playbooksList[index]);
    history.push({
      pathname: "./playbooks-details",
      state: { params: { playbook: playbooksList[index], index: index } },
    });
  };

  const closeConversationModal = () => {
    setThreadVisible("closed");
    setOpenCoachModal(false);
  };

  return (
    <div className="PlayBookStyle">
      {/* Header */}
      <PlayBookHeader
        cardType={cardType}
        setCardType={setCardType}
        setOpenCoachModal={setOpenCoachModal}
      />
      {/* Filter Bar*/}
      <Sidebar.Pushable {...css(styles.sidebarPushableSize)}>
        <Sidebar
          animation="overlay"
          icon="labeled"
          direction="right"
          inverted
          vertical
          visible={threadVisible === "open"}
          onHide={() => closeConversationModal()}
          {...css(styles.sidebarSize)}
        >
          {/* conversation modal */}
          <WorkItemThreadModal
            closeConversationModal={closeConversationModal}
          />
        </Sidebar>
        <Sidebar.Pusher {...css(styles.sidebarPusherSize)}>
          <Segment basic>
            <PlayBookFilterBar
              PlayBookFilterListForCreator={PlayBookFilterListForCreator}
              PlayBookFilterListForUsage={PlayBookFilterListForUsage}
              PlayBookFilterListForSwarm={PlayBookFilterListForSwarm}
              PlayBookFilterListForTag={PlayBookFilterListForTag}
            />
            {/* PlayBook Cards */}
            <Card.Group itemsPerRow={6}>
              {playbooksList &&
                playbooksList.map((playbook, index) => {
                  return (
                    <PlayBookCard
                      index={index}
                      cardType={index}
                      playbook={playbook}
                      onPlayBookCardClicked={onPlayBookCardClicked}
                    />
                  );
                })}
            </Card.Group>

            {/* New PlayBook Button */}
            <div className="playBookAddButtonDiv">
              <Button
                data-cy="playbook-button-7287"
                size="huge"
                className="playBookAddButton"
                icon="plus"
              />
              <div>New PlayBook</div>
            </div>

            {/* Scrum Button */}
            <div className="playBookScrumButtonDiv">
              <Button
                data-cy="playbook-button-27913"
                size="huge"
                className="playBookScrumButton"
                icon="rocketchat"
              />
              <div>Scrumbot</div>
            </div>
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
};

const PlayBookHeader = ({ cardType, setCardType, setOpenCoachModal }) => {
  return (
    <div
      className="displayFlex marginBottom20"
      style={{ justifyContent: "space-between" }}
    >
      <div {...css(styles.buttonGroup)}>
        <div
          {...css(styles.cardViewTypeBtn)}
          className={
            cardType === "MyPlaybook"
              ? "fix_menu_12 fix_background_yellow_shadow fix_hover_white"
              : "fix_menu_12 fix_hover_yellow"
          }
          onClick={() => {
            setCardType("MyPlaybook");
          }}
          ata-cy="playbook-button-13882"
        >
          <span>My PlayBook</span>
        </div>
        <div
          {...css(styles.cardViewTypeBtn)}
          className={
            cardType === "PlaybookStock"
              ? "fix_menu_12 fix_background_yellow_shadow fix_hover_white"
              : "fix_menu_12 fix_hover_yellow"
          }
          onClick={() => {
            setCardType("PlaybookStock");
          }}
          data-cy="playbook-button-97804"
        >
          <span>PlayBook stock</span>
        </div>
      </div>

      {/* More */}
      <div className="displayFlex">
        <Input
          icon={
            <FontAwesomeIcon
              icon={faSearch}
              className="fix_icon_button_solid_20"
              {...css(styles.searchBar)}
            />
          }
          iconPosition="left"
          placeholder="SEARCH"
          className="fix_menu_grey2_12"
        />
        <Image
          src={FIX_THECOACH_BLACK2_20}
          alt="img"
          width="32px"
          height="32px"
          style={{ marginLeft: "10px" }}
          onClick={() => {
            setOpenCoachModal(true);
          }}
        />
      </div>
    </div>
  );
};

const styles = {
  cardViewTypeBtn: {
    borderRadius: "8px",
    padding: "10px 20px",
    margin: "0px 5px 0px 0px",
    cursor: "pointer",
  },
  buttonGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    position: "absolute",
    left: "10px",
    top: "calc(50% - 10px)",
  },
  sidebarPushableSize: {
    width: "100% !important",
    height: "calc(100vh - 102px) !important",
  },
  sidebarSize: {
    width: "90% !important",
  },
  sidebarPusherSize: {
    height: "100% !important",
    overflowY: "auto !important",
  },
};
