import React, { useState } from "react";
import "./workitem-thread-modal-sidebar.view.less";
import { css } from "glamor";
import WorkItemScrumbotbotModalDateItem from "./subcomponents/workitem-scrumbot-modal-date-item";
import { Image } from "semantic-ui-react";
import { FIX_THECOACH_WHITE2_20 } from "../../../utils/static-images";
import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const WorkItemScrumbotModalSidebarView = ({
  date,
  sortByTime,
  setSortByTime,
}) => {
  const styles = {
    sideBarBtn: {
      width: "49%",
      borderRadius: "8px",
      padding: "6px 15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      border: "none",
    },
    sideBarBtnSelectedStyle: {
      backgroundColor: "white",
    },

    sideBarBtnNonSelectedStyle: {
      backgroundColor: "transparent",
    },
    marginLeft5: {
      marginLeft: "5px",
    },
    toggleSwitchBar: {
      borderRadius: "8px",
      width: "100%",
      padding: "2px",
      justifyContent: "space-between",
    },
    avatarStyle: {
      minWidth: "25px !important",
      minHeight: "25px !important",
      maxWidth: "25px !important",
      maxHeight: "25px !important",
      borderRadius: "8px",
    },
  };

  const [sidebarSwitch, setSidebarSwitch] = useState("open");

  const toggleSidebarSwitch = (name) => {
    setSidebarSwitch(name);
  };

  return (
    <div className="sideBarStyle fix_background_grey1">
      <div
        className="marginBottom20 displayFlex"
        style={{ justifyContent: "space-between" }}
      >
        <div className="displayFlex">
          <Image
            src={FIX_THECOACH_WHITE2_20}
            alt="img"
            {...css(styles.avatarStyle)}
          />
          <span className="fix_menu_12" {...css(styles.marginLeft5)}>
            THECOACH THREADS
          </span>
        </div>

        <div>
          <FontAwesomeIcon icon={faTimes} className="fix_icon_hero_24" />
        </div>
      </div>

      <div style={{ cursor: "pointer" }}>
        <span
          className="fix_submenu_8"
          onClick={() => {
            setSortByTime(!sortByTime);
          }}
        >
          {sortByTime ? "SORT BY TIME" : "SORT BY WORK ITEM"}
        </span>
      </div>

      <div
        className="displayFlex marginBottom20 fix_background_grey2"
        {...css(styles.toggleSwitchBar)}
      >
        <button
          onClick={() => {
            toggleSidebarSwitch("open");
          }}
          {...css(
            styles.sideBarBtn,
            sidebarSwitch === "open"
              ? styles.sideBarBtnSelectedStyle
              : styles.sideBarBtnNonSelectedStyle
          )}
        >
          <label className="fix_menu_12">OPEN</label>
          <label className="fix_font_color_black_12">{1}</label>
        </button>
        <button
          onClick={() => {
            toggleSidebarSwitch("archive");
          }}
          {...css(
            styles.sideBarBtn,
            sidebarSwitch === "archive"
              ? styles.sideBarBtnSelectedStyle
              : styles.sideBarBtnNonSelectedStyle
          )}
        >
          <label className="fix_menu_12">ARCHIVE</label>
          <label className="fix_font_color_black_12">{0}</label>
        </button>
      </div>
      <div className="sideBarContainerStyle">
        <div>
          <WorkItemScrumbotbotModalDateItem date={date} />
        </div>
      </div>
    </div>
  );
};

export default WorkItemScrumbotModalSidebarView;
