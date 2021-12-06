import React from 'react'
import { Dropdown, Icon } from 'semantic-ui-react'
import { css } from 'glamor';
import "./member-item.less"

export const MemberItem = ( props ) => {
    const roleType= [
        { key: 1, text: 'Owner', value: 'Owner' },
        { key: 2, text: 'Admin', value: 'Admin' },
        { key: 3, text: 'Member', value: 'Member' },
        { key: 4, text: 'Invited', value: 'Invited' },
    ]

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
            {/* Member Avatar, Name, Role, Position */}
            <div className="mainBlockStyle">
                <div className="avatarStyle">
                    <img className="ui medium circular image" src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg" alt="img" {...css(styles.avatarStyle)}/>
                </div>

                <div className="fullWidth">
                    <div className="displayFlex">
                        <div style={{marginRight: "10px", fontSize:"small"}}>
                            { props.data.member_name }
                        </div>
                        <div>
                            <Dropdown options={roleType} selection className="memberItemClass" onChange={(event, data)=>{
                                props.changeMemberRole( props.data, data.value )
                            }} value={props.data.member_role}/> 
                        </div>
                    </div>
                    <div className="subTitleStyle">
                        {props.data.member_position}
                    </div>
                </div>
            </div>

            {/* Member Remove Button */}
            <div className="iconStyle">
                <Icon name="close" onClick={()=>{
                    props.removeMember( props.data )
                }}/>
            </div>
        </div>
    )
}

export default MemberItem;