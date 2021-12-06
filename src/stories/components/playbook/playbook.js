import React from "react";
import { Card, Button, Icon } from "semantic-ui-react";
import { css, style } from "glamor";
import "./playbook.less";
import PlayBookFilterBar from "./playbook-filter";
import {
  PlayBookFilterListForCreator,
  PlayBookFilterListForUsage,
  PlayBookFilterListForSwarm,
  PlayBookFilterListForTag,
} from "./playbook-definitions";
import PlayBookCard from "./playbook-card.view";

export const PlayBook = ({ cardType, name, discription }) => {
  let playBookCards = [];
  const playBookCardCount = 12;
  for (let index = 0; index < playBookCardCount; index++) {
    playBookCards.push(
      <PlayBookCard
        cardType={index}
        cardName={name}
        cardDiscription={discription}
      />
    );
  }
  return (
    <div className="PlayBookStyle">
      {/* Header */}
      <PlayBookHeader />
      {/* Filter Bar*/}
      <PlayBookFilterBar
        PlayBookFilterListForCreator={PlayBookFilterListForCreator}
        PlayBookFilterListForUsage={PlayBookFilterListForUsage}
        PlayBookFilterListForSwarm={PlayBookFilterListForSwarm}
        PlayBookFilterListForTag={PlayBookFilterListForTag}
      />
      {/* PlayBook Cards */}
      <Card.Group itemsPerRow={6}>{playBookCards}</Card.Group>

      {/* New PlayBook Button */}
      <div className="playBookAddButtonDiv">
        <Button size="huge" className="playBookAddButton" icon="plus"></Button>

        <div>New PlayBook</div>
      </div>

      {/* Scrum Button */}
      <div className="playBookScrumButtonDiv">
        <Button
          size="huge"
          className="playBookScrumButton"
          icon="rocketchat"
        ></Button>

        <div>Scrumbot</div>
      </div>
    </div>
  );
};

const PlayBookHeader = () => {
  return (
    <div
      className="displayFlex marginBottom20"
      style={{ justifyContent: "space-between" }}
    >
      <div>
        <button className="PlayBookHeaderBtnSelectedStyle">
          {" "}
          <h4>My PlayBook</h4>{" "}
        </button>
        <button className="PlayBookHeaderBtnNonSelectedStyle">
          {" "}
          <h4>PlayBook stock</h4>{" "}
        </button>
      </div>
      <Icon name="search" size="large" />
    </div>
  );
};
export default PlayBook;
