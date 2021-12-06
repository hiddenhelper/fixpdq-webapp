import React from "react"
import WorkItemThreadModalTopicContent from "./workitem-thread-modal-topic-content"
import './workitem-thread-modal-topic.view.less'

export const WorkItemThreadModalTopic = ( props ) => {
    return (
        <div style={{marginBottom: "15px"}}>
            <div >TOPIC#1 Action name</div>
            <div className = "ThreadModalTopicStyle">
                {/* Starter */}
                <WorkItemThreadModalTopicContent contentType="starter"/>
                {/* Child */}
                <div style={{marginLeft: "35px"}}>
                    <WorkItemThreadModalTopicContent contentType="child"/>
                    <WorkItemThreadModalTopicContent contentType="child"/>
                </div>
            </div>
        </div>
    );
}

export default WorkItemThreadModalTopic;