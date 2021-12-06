import React from 'react';
import { Card, Button, Icon } from 'semantic-ui-react';
import { css, style } from 'glamor';
import './team-card-view.less'


export const MyTeamsItem = ( props ) => {
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
            maxWidth: "175px !important",
        },
    }
    return (
        <Card {...css( styles.cardStyle )}>
            <Card.Content>
                {/* Avatars */}
                <Card.Description className="cardAvatarStyle">
                    {
                        props.members && props.members.map((item, index)=>{
                            return (
                                <img className="ui medium circular image" style={{zIndex:999-index,}} src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg" alt="img" {...css(styles.avatarStyle)} key={ index }/>
                            )
                        })
                    }
                </Card.Description>
                {/* Team Name */}
                <Card.Description className="marginBottom10 wordBreak">
                    <h3>{ props.team_name }</h3>
                </Card.Description>

                {/* Team Purpose/Description */}
                <Card.Description className="marginBottom10 wordBreak">
                    { props.purpose }
                </Card.Description>

                {/* Swarms */}
                <Card.Description>
                    {
                        props.swarms && props.swarms.map((item, index)=>{
                            return (
                                <Button className="swarmButtonStyle" key={ index }> {item.swarm_name}</Button>
                            )
                            
                        })
                    }
                </Card.Description>   
            </Card.Content>

            {/* Edit Button */}
            <Card.Content extra {...css(styles.editIconStyle)}> 
                <Icon name="pencil"/>
            </Card.Content>
        </Card>
    );
}

export default MyTeamsItem;