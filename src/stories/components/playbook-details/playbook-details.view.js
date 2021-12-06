import React from "react";
import { Card, Button, Icon } from "semantic-ui-react";
import { css, style } from "glamor";
import { PlayBookDetailsCard } from "./playbook-details-card.view";
import { PlayBookDetailsFilterBar } from "./playbook-details-filter";
export const PlayBookDetails = ({ cardType, name, description }) => {
  return (
    <div>
      {/* Header */}
      <PlayBookDetailsHeader />
      {/* Card */}
      <PlayBookDetailsCard
        cardType={cardType}
        name={name}
        description={description}
      />
      {/* Filter Bar */}
      <PlayBookDetailsFilterBar />
    </div>
  );
};

const PlayBookDetailsHeader = () => {
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
          <h4>PlayBook name</h4>{" "}
        </button>
      </div>
      <Icon name="search" size="large" />
    </div>
  );
};
export default PlayBookDetails;
