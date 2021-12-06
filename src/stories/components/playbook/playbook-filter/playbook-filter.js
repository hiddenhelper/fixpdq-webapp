import { css } from "glamor";
import React from "react";
import { Icon } from "semantic-ui-react";
import "./playbook-filter.less";
import {
  PlayBookFilterByCreator,
  PlayBookFilterByUsage,
  PlayBookFilterBySwarm,
  PlayBookFilterByTag,
} from "./sub-filters";

export const PlayBookFilterBar = (props) => {
  const {
    PlayBookFilterListForCreator,
    PlayBookFilterListForUsage,
    PlayBookFilterListForSwarm,
    PlayBookFilterListForTag,
  } = props;
  const styles = {
    splitDiv: {
      width: "2px",
      height: "35px",
      backgroundColor: "rgb(109,109,109)",
    },
  };
  return (
    <div className="PlayBookFilterBar marginBottom20">
      <div
        className="displayFlex marginLR10"
        style={{ justifyContent: "space-between" }}
      >
        <div className="displayFlex">
          <div className="marginLR10">FILTER BY</div>
          <div className="marginLR10">
            <PlayBookFilterByCreator
              PlayBookFilterListForCreator={PlayBookFilterListForCreator}
            />
          </div>
          <div className="marginLR10">
            <PlayBookFilterByUsage
              PlayBookFilterListForUsage={PlayBookFilterListForUsage}
            />
          </div>
          <div className="marginLR10">
            <PlayBookFilterBySwarm
              PlayBookFilterListForSwarm={PlayBookFilterListForSwarm}
            />
          </div>
          <div className="marginLR10">
            <PlayBookFilterByTag
              PlayBookFilterListForTag={PlayBookFilterListForTag}
            />
          </div>
        </div>
        <div className="displayFlex">
          <div {...css(styles.splitDiv)} className="marginLR10" />
          <div className="marginLR10">SORT BY</div>
          <div className="marginLR10">
            <Icon name="heart" size="large" />
          </div>
          <div className="marginLR10">
            <Icon name="cloud download" size="large" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayBookFilterBar;
