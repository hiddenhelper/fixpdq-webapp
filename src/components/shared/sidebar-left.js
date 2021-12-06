/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "glamor";
import React, { memo, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon, Image, Menu, Segment, Sidebar } from "semantic-ui-react";
import { useInterval } from "../../hooks";
import {
  CurrentPlaybookContext,
  CurrentSwarmContext,
  TwilioContext,
  UsersContext,
  WorkitemsContext,
  WorkitemsFilterContext,
  WorkitemsNodesContext,
} from "../../store/context";
import { default_avatar } from "../../utils/static-images";
import { truncateString } from "../../utils/truncate-string";
import { getUser, pickProperty } from "../../utils/user";
import SwarmSelector from "../swarms/swarm-selector";
import UserContext from "../user/context";
import { REFRESH_WORKITEM_INTERVAL } from "../workitems/workitems-definitions";

const CustomSidebar = memo(({ children }) => {
  const { nodesActions } = useContext(WorkitemsNodesContext);
  const { filterActions } = useContext(WorkitemsFilterContext);
  const { refreshWorkitems } = useContext(WorkitemsContext);
  const { currentSwarm } = useContext(CurrentSwarmContext);
  const { currentPlaybookId, getCurrentPlaybook } = useContext(
    CurrentPlaybookContext
  );
  const {
    users,
    loading: usersLoading,
    success: usersLoadingSuccess,
    fetchUsersList,
  } = useContext(UsersContext);
  const location = useLocation();
  const context = useContext(UserContext);

  const [userProfile, setUserProfile] = useState({
    avatarURL: "",
    identity: "",
  });
  const {
    initTwilioConverations,
    success: conversationsSuccess,
    loading: conversationsLoading,
  } = useContext(TwilioContext);

  useInterval(() => {
    const refresh = async () => {
      if (currentSwarm) {
        await refreshWorkitems({
          swarms: currentSwarm.chosenSwarms,
          playbookid: currentPlaybookId,
        });
      }

      if (!conversationsSuccess && !conversationsLoading) {
        getTwilioConversations();
      }
    };
    refresh();
    // First execution in REFRESH_WORKITEM_INTERVAL seconds,
    // Next executions - every 2*REFRESH_WORKITEM_INTERVAL seconds
  }, REFRESH_WORKITEM_INTERVAL);

  const getUsers = async () => {
    await fetchUsersList();
  };

  const getTwilioConversations = async () => {
    await initTwilioConverations();
  };

  useEffect(() => {
    getUsers();
    getTwilioConversations();
    if (!currentPlaybookId) {
      getCurrentPlaybook();
    }
    nodesActions.dispatchGetNodesState();
    filterActions.dispatchGetState();
  }, []);

  useEffect(() => {
    if (usersLoadingSuccess) {
      const user = users.find((s) => s.Username === context.user.username);
      if (user) {
        setUserProfile({
          avatarURL: pickProperty(user, "picture"),
          identity: getUser({
            userid: user.Username,
            allUsers: users,
          }).getUserIdentity(),
        });
      }
    }
  }, [users, usersLoading]);

  return (
    <Sidebar.Pushable as={Segment}>
      <Sidebar
        visible={true}
        as={Menu}
        width="thin"
        icon="labeled"
        vertical
        {...css(styles.leftSidebar)}
      >
        <div {...css(styles.container)} className="fix_sidebar_left_bg">
          <div>
            <img
              style={styles.logoStyle}
              alt="fixpdq logo"
              src={require("../../assets/images/logo.svg")}
            />
          </div>
          <div {...css(styles.menuBox)}>
            <div {...css(styles.marginBottom30)}>
              <p className="fix_menu_12">WORK</p>
              <div {...css(styles.marginBottom5)}>
                <div data-cy="swarm-selector-nav" style={{ minHeight: "30px" }}>
                  <SwarmSelector isMenuMode={true} />
                </div>
              </div>

              <div
                {...css(styles.menuItem)}
                className={
                  location.pathname === "/home"
                    ? "fix_background_black"
                    : "fix_sidebar_btn_hover fix_hover_white"
                }
              >
                <Link
                  to="/home"
                  data-cy="card-view-nav"
                  {...css(styles.displayFlex)}
                >
                  <Icon
                    name="sticky note outline"
                    className={
                      location.pathname === "/home"
                        ? "fix_icon_lmenu_white_14"
                        : "fix_icon_lmenu_grey3_14"
                    }
                  />
                  <span
                    className={
                      location.pathname === "/home"
                        ? "fix_title_white_12"
                        : "fix_title_grey3_12"
                    }
                  >
                    Home
                  </span>
                </Link>
              </div>

              <div
                {...css(styles.menuItem)}
                className={
                  location.pathname === "/workitems"
                    ? "fix_background_black"
                    : "fix_sidebar_btn_hover fix_hover_white"
                }
              >
                <Link
                  to="/workitems"
                  data-cy="list-view-nav"
                  {...css(styles.displayFlex)}
                >
                  <Icon
                    name="code branch"
                    className={
                      location.pathname === "/workitems"
                        ? "fix_icon_lmenu_white_14"
                        : "fix_icon_lmenu_grey3_14"
                    }
                  />
                  <span
                    className={
                      location.pathname === "/workitems"
                        ? "fix_title_white_12"
                        : "fix_title_grey3_12"
                    }
                  >
                    Workspace
                  </span>
                </Link>
              </div>
            </div>

            <div>
              <p className="fix_menu_12">SETTINGS</p>

              <div
                {...css(styles.menuItem)}
                className={
                  location.pathname === "/swarms/swarm-management"
                    ? "fix_background_black"
                    : "fix_sidebar_btn_hover fix_hover_white"
                }
              >
                <Link
                  to="/swarms/swarm-management"
                  data-cy="swarm-nav"
                  {...css(styles.displayFlex)}
                >
                  <Icon
                    name="list ul"
                    className={
                      location.pathname === "/swarms/swarm-management" ||
                      location.pathname === "/createnewteam"
                        ? "fix_icon_lmenu_white_14"
                        : "fix_icon_lmenu_grey3_14"
                    }
                  />
                  <span
                    className={
                      location.pathname === "/swarms/swarm-management" ||
                      location.pathname === "/createnewteam"
                        ? "fix_title_white_12"
                        : "fix_title_grey3_12"
                    }
                  >
                    Swarm List
                  </span>
                </Link>
              </div>

              <div
                {...css(styles.menuItem)}
                className={
                  location.pathname === "/myteams"
                    ? "fix_background_black"
                    : "fix_sidebar_btn_hover fix_hover_white"
                }
              >
                <Link
                  to="/myteams"
                  data-cy="myteams-nav"
                  {...css(styles.displayFlex)}
                >
                  <Icon
                    name="at"
                    className={
                      location.pathname === "/myteams" ||
                      location.pathname === "/createnewteam"
                        ? "fix_icon_lmenu_white_14"
                        : "fix_icon_lmenu_grey3_14"
                    }
                  />
                  <span
                    className={
                      location.pathname === "/myteams" ||
                      location.pathname === "/createnewteam"
                        ? "fix_title_white_12"
                        : "fix_title_grey3_12"
                    }
                  >
                    Teams
                  </span>
                </Link>
              </div>

              <div
                {...css(styles.menuItem)}
                className={
                  location.pathname === "/playbooks"
                    ? "fix_background_black"
                    : "fix_sidebar_btn_hover fix_hover_white"
                }
              >
                <Link
                  to="/playbooks"
                  data-cy="playbooks-nav"
                  {...css(styles.displayFlex)}
                >
                  <Icon
                    name="bolt"
                    className={
                      location.pathname === "/playbooks"
                        ? "fix_icon_lmenu_white_14"
                        : "fix_icon_lmenu_grey3_14"
                    }
                  />
                  <span
                    className={
                      location.pathname === "/playbooks"
                        ? "fix_title_white_12"
                        : "fix_title_grey3_12"
                    }
                  >
                    PlayBook
                  </span>
                </Link>
              </div>

              <div
                data-cy="profile-nav-div-temp"
                {...css(styles.menuItem)}
                className={
                  location.pathname === "/user/profile"
                    ? "fix_background_black"
                    : "fix_sidebar_btn_hover fix_hover_white"
                }
              >
                <Link
                  to={"/user/profile"}
                  data-cy="profile-nav-link-temp"
                  className="displayFlex"
                >
                  <Image
                    src={
                      userProfile.avatarURL
                        ? userProfile.avatarURL
                        : default_avatar
                    }
                    avatar
                  />
                  <span
                    className={
                      location.pathname === "/user/profile"
                        ? "fix_title_white_12"
                        : "fix_title_grey3_12"
                    }
                  >
                    {truncateString(userProfile.identity, 10)}
                  </span>
                  <Icon
                    name="caret right"
                    className={
                      location.pathname === "/user/profile"
                        ? "fix_icon_lmenu_white_14"
                        : "fix_icon_lmenu_grey3_14"
                    }
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
      <Sidebar.Pusher>
        <Segment
          basic
          padded
          {...css(styles.workarea)}
          textAlign="left"
          floated="left"
        >
          {children}
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
});

const styles = {
  leftSidebar: {
    display: "table !important",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "99vh",
    padding: "50px 25px 20px 25px",
    width: "200px !important",
  },
  workarea: {
    height: "100vh",
    width: "calc(100% - 150px)",
    overflowY: "scroll",
    overflowX: "hidden",
    paddingLeft: "70px !important",
    paddingRight: "70px !important",
  },
  logoStyle: {
    height: "87px",
    width: "64px",
  },
  menuBox: {
    width: "100%",
    paddingTop: "80px",
    textAlign: "left",
  },
  menuItem: {
    marginTop: "10px",
    marginBottom: "10px",
    padding: "10px 5px",
    borderRadius: "8px",
    width: "100%",
  },
  mySwarmsBtnStyle: {
    display: "inherit",
    marginBottom: "20px",
    fontSize: "1.5rem",
    color: "black",
  },
  marginBottom30: {
    marginBottom: "30px !important",
  },
  displayFlex: {
    display: "flex",
  },
};

export default CustomSidebar;
