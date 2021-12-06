import React, { useState } from "react";
import { css } from "glamor";
import { Button, Image, Popup } from "semantic-ui-react";
import { MAX_PARTICIPANTS_AVATAR_COUNT } from "../../workitems-definitions";
import { default_avatar } from "../../../../utils/static-images";
import { getUser } from "../../../../utils/user";

export const ParticipantPlus = ({ participants, allUsers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const styles = {
    avatarStyle: {
      width: "30px !important",
      height: "30px !important",
      border: "none",
      borderRadius: "8px",
    },
    paddingZero: {
      padding: "0px !important",
    },
    marginBottom5: {
      marginBottom: "5px",
    },
  };

  return (
    <Popup
      hoverable
      position="right center"
      trigger={
        <Button
          style={{
            backgroundColor: "#99a6b1",
            color: "#ffffff",
          }}
          {...css(styles.avatarStyle, styles.paddingZero)}
        >
          {participants.length - MAX_PARTICIPANTS_AVATAR_COUNT}+
        </Button>
      }
      open={isOpen}
      onOpen={() => {
        setIsOpen(true);
      }}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      {participants.map((user, index) => {
        if (index < MAX_PARTICIPANTS_AVATAR_COUNT) {
          return <></>;
        }
        const avatar =
          getUser({ userid: user.userid, allUsers }).getPropertyValue(
            "picture"
          ) || default_avatar;

        return (
          <Image
            src={avatar}
            alt="img"
            {...css(styles.avatarStyle, styles.marginBottom5)}
          />
        );
      })}
    </Popup>
  );
};

export default ParticipantPlus;
