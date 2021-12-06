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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faBookmark } from "@fortawesome/pro-solid-svg-icons";

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
    <div className="PlayBookFilterBar fix_background_grey_shadow">
      <div
        className="displayFlex marginLR10"
        style={{ justifyContent: "space-between" }}
      >
        <div className="displayFlex">
          <div className="marginLR10" className="fix_menu_12">
            FILTER BY
          </div>
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
          <div className="marginLR10 fix_menu_12">SORT BY</div>
          <div className="marginLR10">
            <FontAwesomeIcon
              icon={faHeart}
              className="fix_icon_lmenu_grey3_14"
            />
          </div>
          <div className="marginLR10">
            <FontAwesomeIcon
              icon={faBookmark}
              className="fix_icon_lmenu_grey3_14"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayBookFilterBar;
