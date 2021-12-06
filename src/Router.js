import React from "react";
import {
  withRouter,
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import UserContext from "./components/user/context";
import WorkitemsHeader from "./components/shared/header-workitems";

import Authenticator from "./components/auth/authenticator";
import Home from "./components/home/home";
import Profile from "./components/user/profile";

import AppLayout from "./components/layouts/layout-main";
import WorkItemComponent from "./components/workitems";
import CustomSidebar from "./components/shared/sidebar-left";
import SwarmManagement from "./components/swarms/swarm-management";
import MyTeamsComponent from "./components/myteams";
import { PlayBook, PlayBookDetails } from "./components/playbook";

class PrivateRoute extends React.Component {
  state = {
    loaded: false,
    isAuthenticated: false,
  };
  static contextType = UserContext;
  componentDidMount() {
    this.unlisten = this.props.history.listen(() => {
      this.context.updateCurrentUser(this.context.user);
    });
  }
  componentWillUnmount() {
    this.unlisten();
  }
  render() {
    const { component: Component, ...rest } = this.props;
    const isAuthenticated =
      this.context.user && this.context.user.username ? true : false;
    const isLoaded = this.context.isLoaded;
    if (!isLoaded) return null;

    return (
      <Route
        {...rest}
        render={(props) => {
          return isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/auth",
              }}
            />
          );
        }}
      />
    );
  }
}

const NoMatch = ({ location }) => (
  <div>
    <h3>
      404 <code>{location.pathname}</code>
    </h3>
  </div>
);

PrivateRoute = withRouter(PrivateRoute);

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Authenticator} />
      <Route path="/auth" exact component={Authenticator} />
      <CustomSidebar>
        <Switch>
          <Route path="/workitems">
            <AppLayout>
              <WorkitemsHeader />
              <Switch>
                <PrivateRoute path="/workitems" component={WorkItemComponent} />
              </Switch>
            </AppLayout>
          </Route>
          <Route path="/home">
            <AppLayout>
              <Switch>
                <PrivateRoute path="/home" exact component={Home} />
              </Switch>
            </AppLayout>
          </Route>
          <PrivateRoute
            path="/myteams"
            exact
            component={() => <MyTeamsComponent isMyTeams={true} />}
          />
          <PrivateRoute
            path="/createnewteam"
            exact
            component={() => <MyTeamsComponent isMyTeams={false} />}
          />
          <PrivateRoute path="/user/profile" component={Profile} />
          <PrivateRoute
            path="/swarms/swarm-management"
            exact
            component={() => <SwarmManagement isCreateModal={false} />}
          />
          <PrivateRoute
            path="/swarms/createnewswarm"
            exact
            component={() => <SwarmManagement isCreateModal={true} />}
          />
          <PrivateRoute path="/playbooks" exact component={PlayBook} />
          <PrivateRoute
            path="/playbooks-details"
            exact
            component={PlayBookDetails}
          />
          <Route component={NoMatch} />
        </Switch>
      </CustomSidebar>
    </Switch>
  </Router>
);

export default Routes;
