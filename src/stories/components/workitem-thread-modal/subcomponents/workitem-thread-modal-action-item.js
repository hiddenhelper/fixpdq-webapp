import React from 'react'
import { css } from 'glamor';
import './workitem-thread-modal-action-item.less'

export const WorkItemThreadModalActionItem = () => {
    const styles = {
        actionBtnStyle: {
            width: "30px !important",
            height: "30px !important",
            display: "flex !important",
            alignItems: "center !important",
            justifyContent: "center !important",
            borderRadius: "5px !important"
        },
        avatarStyle: {
            minWidth: "25px !important",
            minHeight: "25px !important",
            maxWidth: "25px !important",
            maxHeight: "25px !important",
        },
    }
    return (
        <div className="actionItemStyle">
            {/* Type, Action Name, Status, Avatar */}
            <button 
                className="ui icon button" 
                style={{ backgroundColor:"pink", marginBottom: "5px",}} 
                { ...css(styles.actionBtnStyle )} 
            >
                <i className="lock icon" style={{ color:"white", }} />
            </button>

            <div className="fullWidth">
                <div className="displayFlex">
                    <div style={{marginRight: "10px", fontSize:"small"}}>
                        Action name
                    </div>                        
                </div>
                <div className="subTitleStyle">
                    OPEN
                </div>
            </div>
            <div>
                <img 
                    className="ui medium circular image" 
                    src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg" 
                    alt="img" 
                    {...css(styles.avatarStyle)}
                />
            </div>
        </div>
    )
}

export default WorkItemThreadModalActionItem;