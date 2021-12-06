import { css } from 'glamor';
import React, { useState } from 'react'
import { Icon } from 'semantic-ui-react';

const WorkItemThreadModalTopicContent = ( props ) => {

    const [isMouseHover, setIsMouseHover] = useState(false);
    const [mousePos, setMousePos] = useState({x: "0", y: "0"});
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
        replyBlockPos: {
            left: mousePos.x,
            top: mousePos.y, 
        }
    }
    return (
        <div style={{marginBottom: "20px"}}>
            {/* Starter Avatar, Name */}
            <div 
            className="displayFlex" 
            style={{justifyContent:"space-between", marginBottom: "15px"}}
            >
                <div className="ThreadModalTopicMemberStyle">
                    <div className="displayFlex">
                        <div className="avatarStyle">
                            <img className="ui medium circular image" src="https://bain.design/wp-content/uploads/2013/03/People-Avatar-Set-Rectangular-18.jpg" alt="img" {...css(styles.avatarStyle)}/>
                        </div>

                        <div>
                            <div style={{marginRight: "10px", fontSize:"small"}}>
                                Edward Parker
                            </div>
                            <div className="subTitleStyle">
                                Project Manager
                            </div>
                        </div>
                    </div>
                    <div>
                        10:19 AM
                    </div>
                </div>
            </div>

            {/* Content */}
            <div 
                className="ThreadModalTopicContentStyle"
                onClick={(event)=>{
                    if ( props.contentType === "starter" && !isMouseHover ) {
                        setIsMouseHover( true );
                        setMousePos({x: event.nativeEvent.offsetX - 15, y: event.nativeEvent.offsetY - 30});                
                    }
                }}
                onMouseLeave={(event)=>{
                    if ( props.contentType === "starter") {
                        setIsMouseHover( false );
                        setMousePos({x: "0", y: "0"});
                    }
                }}
            >
                <label>
                    Hi guys, can we please get this project prioritised and get it done because bla bla...
                </label>
                {/* Reply Buttons */}
                {
                    isMouseHover ?
                    <div 
                        className="displayFlex ThreadModalTopicReplyBlock"
                        {...css(styles.replyBlockPos)}
                    >
                        <Icon name="reply icon" size="large" style={{color: "white"}}/>
                        <Icon name="comment alternate icon" size="large" style={{color: "white"}}/>
                    </div>
                    :
                    <></>
                }
                {/* Action Icon */}
                {
                    props.contentType === "starter" ?  
                    <button 
                        className="ui icon button" 
                        style={{ 
                            backgroundColor:"pink", 
                            position:"absolute", 
                            top: "-10px",
                            right: "10px",
                        }} 
                        { ...css(styles.actionBtnStyle )} 
                    >
                        <i className="lock icon" style={{ color:"white", }} />
                    </button>
                    :
                    <></>
                }
            </div>
        </div>
    );
}

export default WorkItemThreadModalTopicContent;