import { css } from "glamor";
import React from "react";
import { Card, Icon, Image } from "semantic-ui-react";
import { PlayBookCardType } from "./playbook-definitions";
import { truncateString } from "../../utils/truncate-string";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faBookmark } from "@fortawesome/pro-light-svg-icons";

export const PlayBookCard = ({
  index,
  cardType,
  playbook,
  onPlayBookCardClicked,
}) => {
  const styles = {
    avatarStyle: {
      width: "25px !important",
      height: "25px !important",
      borderRadius: "8px",
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
      marginBottom: "20px",
      textShadow: "3px 3px 5px black",
    },
    cardStyle: {
      maxWidth: "180px !important",
      minWidth: "180px !important",
      minHeight: "280px !important",
    },
    descriptionBox: {
      borderRadius: "8px",
      padding: "5px",
      height: "40px",
      display: "flex",
      alignItems: "center",
    },
  };
  return (
    <Card
      onClick={() => {
        onPlayBookCardClicked(index);
      }}
      {...css(styles.cardStyle)}
    >
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
        <Card.Description className="marginBottom10">
          <div
            {...css(styles.descriptionBox)}
            className="fix_background_grey_shadow wordBreak fix_body1_10"
          >
            {truncateString(playbook.playbookname, 50)}
          </div>
        </Card.Description>

        {/* PlayBook Description */}
        <Card.Description className="marginBottom10">
          <div className="fix_body2_10 wordBreak" style={{ height: "70px" }}>
            {truncateString(playbook.playbookdescription, 200)}
          </div>
        </Card.Description>

        {/* Swarms */}
        <Card.Description>
          <div className="displayFlex marginBottom10">
            <div className="fix_body1_10" style={{ marginRight: "5px" }}>
              Swarm 1
            </div>
            <div className="fix_body1_10" style={{ marginRight: "5px" }}>
              Swarm 2
            </div>
            <div className="fix_body1_10" style={{ marginRight: "5px" }}>
              Swarm 3
            </div>
          </div>
        </Card.Description>

        {/* EX Button */}
        <Card.Description>
          <div
            className="displayFlex"
            style={{ justifyContent: "space-between" }}
          >
            <div>
              <Image
                src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
                alt="img"
                {...css(styles.avatarStyle)}
              />
            </div>
            <div className="displayFlex">
              <div style={{ marginRight: "10px" }}>
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{ marginRight: "5px" }}
                />
                679
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faBookmark}
                  style={{ marginRight: "5px" }}
                />
                477
              </div>
            </div>
          </div>
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

export default PlayBookCard;
