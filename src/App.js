import { Auth, Hub } from "aws-amplify";
import React, { Component } from "react";
import { SemanticToastContainer } from "react-semantic-toasts";
import "./App.css";
import UserContext from "./components/user/context";
import Router from "./Router";
import Store from "./store";
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "./components/shared/error-fallback";

const registerServiceWorker = async () => {
  const registration = await navigator.serviceWorker.register(
    "/fix-service-worker.js",
    {
      scope: "/"
    });
  await navigator.serviceWorker.ready;
}

class App extends Component {
  state = {
    currentUser: {},
    isLoaded: false,
  };
  componentDidMount() {
    this.updateCurrentUser();
    registerServiceWorker().then(() => {
      console.log('Fix Service Worker registered')
    });
    Hub.listen("auth", this);
  }
  onHubCapsule(capsule) {
    const { channel, payload } = capsule;
    if (channel === "auth" && payload.event !== "signIn") {
      this.updateCurrentUser();
    }
  }
  updateCurrentUser = async (user) => {
    if (user) {
      this.setState({ currentUser: user });
      return;
    }
    try {
      const user = await Auth.currentAuthenticatedUser();
      this.setState({ currentUser: user, isLoaded: true });
    } catch (err) {
      this.setState({ currentUser: null, isLoaded: true });
    }
  };
  render() {
    return (
      <UserContext.Provider
        value={{
          user: this.state.currentUser,
          updateCurrentUser: this.updateCurrentUser,
          isLoaded: this.state.isLoaded,
        }}
      >
        <Store>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              console.log('Resetting');
            }}
            // onError={(err, info) => {
            //   logHandler(err, info);
            // }}
          >
            <div className="App">
              <Router />
            </div>
          </ErrorBoundary>
        </Store>
        <SemanticToastContainer position="top-right" />
      </UserContext.Provider>
    );
  }
}

export default App;
