import React from 'react'
import { Icon } from 'semantic-ui-react'
import { css } from 'glamor';
import "./member-item.less"

export const SwarmItem = ( props ) => {

    const styles = {
        avatarStyle: {
            minWidth: "25px !important",
            minHeight: "25px !important",
            maxWidth: "25px !important",
            maxHeight: "25px !important",
        },
    }

    return (
        <div className="blockStyle">
            {/* Swarm Avatar, title, content */}
            <div className="mainBlockStyle">
                <div className="avatarStyle">
                    <img className="ui medium circular image" src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg" alt="img" {...css(styles.avatarStyle)}/>
                </div>
                <div className="fullWidth">
                    <div className="displayFlex">
                        <div style={{marginRight: "10px", fontSize:"small"}}>
                            {props.data.swarm_name}
                        </div>
                    </div>
                    <div className="subTitleStyle">
                        { props.data.swarm_description}
                    </div>
                </div>
            </div>
            {/* Swarm Remove Button */}
            <div className="iconStyle">
                <Icon name="close" onClick={()=>{
                    props.removeSwarm( props.data )
                }}/>
            </div>
        </div>
    )
}

export default SwarmItem;