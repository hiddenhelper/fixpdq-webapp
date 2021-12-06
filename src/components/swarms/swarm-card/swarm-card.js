import React from "react";
import { Card } from "semantic-ui-react";
import SwarmCardView from "./swarm-card-view";

export const SwarmCard = ({
  swarmsList,
  allUsers,
  onSwarmEditButtonClicked,
}) => {
  return (
    <Card.Group itemsPerRow={6}>
      {swarmsList &&
        swarmsList.map((swarm, index) => {
          return (
            <SwarmCardView
              swarm={swarm}
              allUsers={allUsers}
              key={index}
              onSwarmEditButtonClicked={onSwarmEditButtonClicked}
            />
          );
        })}
    </Card.Group>
  );
};

export default SwarmCard;
