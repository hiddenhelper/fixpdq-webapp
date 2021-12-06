import { css } from "glamor";
import React from "react";
import { Button, Card, Grid, Icon } from "semantic-ui-react";
import { PlayBookCardType } from "../playbook/playbook-definitions";

export const PlayBookDetailsCard = () => {
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
      textShadow: "3px 3px 5px black",
    },
    cardStyle: {
      width: "100% !important",
    },
    extraBtnStyle: {
      display: "flex !important",
      alignItems: "center !important",
      justifyContent: "space-between !important",
    },
  };
  return (
    <Card {...css(styles.cardStyle)}>
      <Card.Content>
        <Grid width={16}>
          <Grid.Column width={3}>
            {/* Header */}
            <Card.Description>
              <div
                style={{
                  backgroundColor: `${PlayBookCardType[0].color}`,
                }}
                {...css(styles.cardHeaderStyle)}
              >
                {PlayBookCardType[0].title}
              </div>
            </Card.Description>
          </Grid.Column>

          <Grid.Column width={6}>
            {/* PlayBook Name */}
            <Card.Description className="marginBottom10 wordBreak">
              <h4>PlayBook name here...</h4>
            </Card.Description>

            {/* PlayBook Description */}
            <Card.Description className="wordBreak">
              purpose here
            </Card.Description>
          </Grid.Column>

          <Grid.Column width={3}>
            <Card.Description className="wordBreak">
              <div style={{fontSize: "10px",}}>This PlayBook was used as</div>
            </Card.Description>
            {/* Swarms */}
            <Card.Description>
              <Button className="swarmButtonStyle">Swarm 1</Button>
              <Button className="swarmButtonStyle">Swarm 2</Button>
              <Button className="swarmButtonStyle">Swarm 3</Button>
              <Button className="swarmButtonStyle">Swarm 4</Button>
              <Button className="swarmButtonStyle">Swarm 5</Button>
            </Card.Description>
          </Grid.Column>
          
          <Grid.Column width={4} {...css(styles.extraBtnStyle)}>
            {/* EX Button */}
            <Card.Description {...css(styles.cardStyle)}>
              <div className="displayFlex">
                <div className="displayFlex">
                  <img
                    className="ui medium circular image"
                    src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
                    alt="img"
                    {...css(styles.avatarStyle)}
                  />
                  <div>Nina Heiss</div>
                </div>
                <div className="displayFlex">
                  <Icon name="heart" />
                  <div>679</div>
                </div>
                <div className="displayFlex">
                  <Icon name="cloud download" />
                  <div>477</div>
                </div>
              </div>
            </Card.Description>
          </Grid.Column>
        </Grid>
      </Card.Content>
    </Card>
  );
};

export default PlayBookDetailsCard;
