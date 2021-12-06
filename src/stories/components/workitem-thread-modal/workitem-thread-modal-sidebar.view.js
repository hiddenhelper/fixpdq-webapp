import React from "react"

import WorkItemThreadModalActionItem from './subcomponents/workitem-thread-modal-action-item'
import './workitem-thread-modal-sidebar.view.less'

export const WorkItemThreadModalSidebarView = (props) => {

    return (
        <div className="sideBarStyle">
            <div className="sideBarContainerStyle">
                <div className="marginBottom20">
                    <h3>Conversations</h3>
                </div>
                <div className="displayFlex marginBottom20">
                    <button className="sideBarBtnSelectedStyle marginRight20">
                        <h4>Conversations</h4>
                    </button>
                    <button className="sideBarActionCntBtn">3</button>
                    <button className="sideBarBtnNonSelectedStyle"><h4>History</h4></button>
                </div>
                <WorkItemThreadModalActionItem />
                <WorkItemThreadModalActionItem />
                <WorkItemThreadModalActionItem />
            </div>
            
        </div>
    );
}

export default WorkItemThreadModalSidebarView;