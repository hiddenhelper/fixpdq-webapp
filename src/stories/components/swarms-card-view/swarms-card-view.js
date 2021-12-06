import React from "react";
import { Card, Icon } from "semantic-ui-react";
import { Slider } from "react-semantic-ui-range";
import { css } from "glamor";
import { Scrumbot_button } from "../../../utils/static-images";
export const SwarmCardItem = ({
  name,
  description,
  creator,
  deadline,
  progress,
}) => {
  // Progess Sliderbar Setting
  const sliderSetting = {
    min: 0,
    max: 100,
    step: 10,
    // onChange: value => {
    //   setValue(value);
    // }
  };

  const styles = {
    cardStyle: {
      borderTop: "solid !important",
      borderWidth: "5px !important",
      maxWidth: "190px !important",
      minWidth: "190px !important",
      marginRight: "30px !important",
      marginBottom: "30px !important",
    },
    avatarStyle: {
      width: "25px !important",
      height: "25px !important",
    },
  };

  return (
    <Card {...css(styles.cardStyle)}>
      {/* Header */}
      <Card.Content className={"cardHeaderStyle"}>{name}</Card.Content>

      {/* Card Main Content */}
      <Card.Content>
        {/* Description */}
        <Card.Description className={"cardDescriptionStyle"}>
          <div>{description}</div>
        </Card.Description>

        {/* Creator */}
        <Card.Description className={"cardDescriptionStyle"}>
          <div>Creator | {creator}</div>
        </Card.Description>

        {/* Deadline */}
        <Card.Description className={"cardDescriptionStyle"}>
          <div>Deadline | {deadline}</div>
        </Card.Description>

        {/* Progess */}
        <Card.Description className={"cardDescriptionStyle"}>
          <div>Progress | {progress}%</div>
        </Card.Description>
        <Slider color="grey" settings={sliderSetting} value={progress} />

        {/* More details */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <img
            className="ui medium circular image"
            src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
            alt="img"
            {...css(styles.avatarStyle)}
          />
          <div>
            <Icon size="large" name="sort" />
            <Icon size="large" name="pencil square" />
            <img
              className="ui medium circular image"
              src={Scrumbot_button}
              alt="img"
              {...css(styles.avatarStyle)}
            />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default SwarmCardItem;
