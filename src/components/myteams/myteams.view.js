import React from "react";
import { Card, Icon } from "semantic-ui-react";
import { css } from "glamor";
import "./myteams.less";

export const MyTeamsItem = (props) => {
  const styles = {
    avatarStyle: {
      width: "30px !important",
      height: "30px !important",
      marginRight: "-10px !important",
    },
    displayFlex: {
      display: "flex !important",
      alignItems: "center !important",
    },
    containerStyle: {
      marginBottom: "20px !important",
    },
    editIconStyle: {
      display: "flex",
      justifyContent: "center",
    },
    cardStyle: {
        maxWidth: "200px !important",
        minWidth: "200px !important",
        minHeight: "300px !important",
        marginRight: "30px !important",
        marginBottom: "30px !important",
    },
  };
  return (
    <Card {...css(styles.cardStyle)}>
      <Card.Content>
        {/* Avatars */}
        <Card.Description className="cardAvatarStyle">
          <img
            className="ui medium circular image"
            style={{ zIndex: 999 }}
            src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
            alt="img"
            {...css(styles.avatarStyle)}
          />

          <img
            className="ui medium circular image"
            style={{ zIndex: 998 }}
            src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
            alt="img"
            {...css(styles.avatarStyle)}
          />

          {props.myteamItem.users &&
            props.myteamItem.users.map((item, index) => {
              return (
                <img
                  className="ui medium circular image"
                  style={{ zIndex: 997 - index }}
                  src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg"
                  alt="img"
                  {...css(styles.avatarStyle)}
                  key={index}
                />
              );
            })}
        </Card.Description>
        {/* Team Name */}
        <Card.Description className="marginBottom10 wordBreak">
          <h3>{props.myteamItem.team_name}</h3>
        </Card.Description>

        {/* Team Purpose/Description */}
        <Card.Description className="marginBottom10 wordBreak">
          {props.myteamItem.team_purpose}
        </Card.Description>

        {/* Swarms */}
        <Card.Description>
          {/* {
                        props.myteamItem.Swarms && props.myteamItem.Swarms.map((item, index)=>{
                            return (
                                <Button data-cy="myteams-view-button-78870"  className="swarmButtonStyle" key={ index }> {item.swarm_name}</Button>
                            )
                            
                        })
                    } */}
        </Card.Description>
      </Card.Content>

      {/* Edit Button */}
      <Card.Content extra {...css(styles.editIconStyle)}>
        <Icon
          name="pencil"
          onClick={() => {
            props.editExistingTeamComponent(props.myteamItem);
          }}
        />
      </Card.Content>
    </Card>
  );
};

export default MyTeamsItem;
