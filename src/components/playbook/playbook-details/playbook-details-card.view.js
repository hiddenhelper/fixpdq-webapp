import { css } from "glamor";
import React from "react";
import { Button, Card, Grid, Icon, Image } from "semantic-ui-react";
import { PlayBookCardType } from "../playbook-definitions";
import { truncateString } from "../../../utils/truncate-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faBookmark } from "@fortawesome/pro-light-svg-icons";

export const PlayBookDetailsCard = ({ index, name, description }) => {
  const styles = {
    avatarStyle: {
      width: "20px !important",
      height: "20px !important",
      borderRadius: "50%",
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
                  backgroundColor: `${PlayBookCardType[index].color}`,
                }}
                {...css(styles.cardHeaderStyle)}
              >
                {PlayBookCardType[index].title}
              </div>
            </Card.Description>
          </Grid.Column>

          <Grid.Column width={5}>
            {/* PlayBook Name */}
            <Card.Description className="marginBottom10 wordBreak">
              <div className="fix_menu_12">
                {truncateString(name, 20)}
              </div>
            </Card.Description>

            {/* PlayBook Description */}
            <Card.Description className="wordBreak">
              <div className="fix_body2_grey3_10">
                {truncateString(description, 200)}
              </div>
            </Card.Description>
          </Grid.Column>

          <Grid.Column width={4}>
            <Card.Description className="wordBreak">
              <div className="fix_body2_grey3_10">
                This PlayBook was used as
              </div>
            </Card.Description>
            {/* Swarms */}
            <Card.Description>
              <Button
                data-cy="playbook-details-card-view-button-89910"
                className="swarmButtonStyle"
              >
                Swarm 1
              </Button>
              <Button
                data-cy="playbook-details-card-view-button-7951"
                className="swarmButtonStyle"
              >
                Swarm 2
              </Button>
              <Button
                data-cy="playbook-details-card-view-button-49448"
                className="swarmButtonStyle"
              >
                Swarm 3
              </Button>
              <Button
                data-cy="playbook-details-card-view-button-558"
                className="swarmButtonStyle"
              >
                Swarm 4
              </Button>
            </Card.Description>
          </Grid.Column>

          <Grid.Column width={4} {...css(styles.extraBtnStyle)}>
            {/* EX Button */}
            <Card.Description {...css(styles.cardStyle)}>
              <div
                className="displayFlex"
                style={{ justifyContent: "space-around" }}
              >
                <div className="displayFlex">
                  <div className="fix_body3_grey3_8" style={{ marginRight: "5px" }}>Nina Heiss</div>
                  <Image
                    src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
                    alt="img"
                    {...css(styles.avatarStyle)}
                  />
                </div>
                <div className="displayFlex">
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={{ marginRight: "5px" }}
                  />
                  <div className="fix_body3_grey3_8">679</div>
                </div>
                <div className="displayFlex">
                  <FontAwesomeIcon
                    icon={faBookmark}
                    style={{ marginRight: "5px" }}
                  />
                  <div className="fix_body3_grey3_8">477</div>
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
