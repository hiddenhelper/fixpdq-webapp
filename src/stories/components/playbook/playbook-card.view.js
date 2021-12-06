import { css } from "glamor";
import React from "react";
import { Button, Card, Icon } from "semantic-ui-react";
import { PlayBookCardType } from "./playbook-definitions";

export const PlayBookCard = ({cardType, cardName, cardDiscription}) => {
  const styles = {
    avatarStyle: {
      width: "20px !important",
      height: "20px !important",
    },
    displayFlex: {
      display: "flex !important",
      alignItems: "center !important",
    },
    cardHeaderStyle: {
      width: "100%",
      height: "60px",
      borderRadius: "10px",
      display: "flex !important",
      alignItems: "center !important",
      justifyContent: "center !important",
      color: "white",
      marginBottom: "10px",
      textShadow: "3px 3px 5px black",
    },
  };
  return (
    <Card>
      <Card.Content>
        {/* Header */}
        <Card.Description>
          <div
            style={{
              backgroundColor: `${PlayBookCardType[cardType].color}`,
            }}
            {...css(styles.cardHeaderStyle)}
          >
            {PlayBookCardType[cardType].title}
          </div>
        </Card.Description>
        {/* PlayBook Name */}
        <Card.Description className="marginBottom10 wordBreak">
          <h4>{cardName}</h4>
        </Card.Description>

        {/* PlayBook Description */}
        <Card.Description className="marginBottom10 wordBreak">
          {cardDiscription}
        </Card.Description>

        {/* Swarms */}
        <Card.Description>
          <Button className="swarmButtonStyle">Swarm 1</Button>
          <Button className="swarmButtonStyle">Swarm 2</Button>
          <Button className="swarmButtonStyle">Swarm 3</Button>
          <Button className="swarmButtonStyle">Swarm 4</Button>
          <Button className="swarmButtonStyle">Swarm 5</Button>
        </Card.Description>
      </Card.Content>

      {/* EX Button */}
      <Card.Content extra>
        <div
          className="displayFlex"
          style={{ justifyContent: "space-between" }}
        >
          <div>
            <img
              className="ui medium circular image"
              src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
              alt="img"
              {...css(styles.avatarStyle)}
            />
          </div>
          <div className="displayFlex">
            <Icon name="heart" />
            <div>679</div>
            <Icon name="cloud download" />
            <div>477</div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default PlayBookCard;
