import React from "react";
import { css } from "glamor";

import SignIn from "./signin";
import SignUp from "./signup";
import ForgotPassword from "./forgot-password";
import AuthHeader from "./auth-header";

import backgroundImage from "../../assets/images/auth-background.jpg";

class Authenticator extends React.Component {
  state = {
    errorMessage: null,
    currentState: "showSignIn",
  };
  switchState = (currentState) => {
    this.setState({
      currentState,
    });
  };
  updateErrorMessage = (errorMessage) => {
    this.setState({ errorMessage });
  };
  render() {
    const { currentState } = this.state;
    return (
      <div style={styles.layout}>
        <div style={styles.authLayoutContainer}>
          <div style={styles.authLayoutFormContainer}>
            <AuthHeader />
            {currentState === "showSignIn" && (
              <SignIn
                {...this.props}
                updateErrorMessage={this.updateErrorMessage}
              />
            )}
            {currentState === "showSignUp" && (
              <SignUp
                updateErrorMessage={this.updateErrorMessage}
                switchState={this.switchState}
              />
            )}
            {currentState === "showForgotPassword" && (
              <ForgotPassword
                switchState={this.switchState}
                updateErrorMessage={this.updateErrorMessage}
              />
            )}
            <div {...css(styles.buttonContainer)}>
              {currentState === "showSignIn" ? (
                <div {...css(styles.linkContainer, styles.stateTextStyle)}>
                  <div
                    onClick={() => {
                      this.updateErrorMessage("");
                      this.switchState("showSignUp");
                    }}
                    {...css(styles.toggle)}
                    data-cy="sign-up-button"
                    className="fix_paragraph_body_12 fix_color_magenta"
                  >
                    Need an account? Sign Up
                  </div>
                  <p
                    onClick={() => {
                      this.updateErrorMessage("");
                      this.switchState("showForgotPassword");
                    }}
                    {...css(styles.toggle)}
                    className="fix_paragraph_body_12 fix_color_magenta"
                  >
                    Forgot your password?
                  </p>
                </div>
              ) : (
                <div {...css(styles.linkContainer, styles.stateTextStyle)}>
                  <div
                    {...css(styles.toggle)}
                    onClick={() => {
                      this.updateErrorMessage("");
                      this.switchState("showSignIn");
                    }}
                    className="fix_paragraph_body_12 fix_color_magenta"
                  >
                    Already have an account? Sign In
                  </div>
                </div>
              )}
            </div>
            <div style={{minHeight: "40px", maxHeight: "40px", fontSize: "12px"}}>
              {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Authenticator;

const styles = {
  linkContainer: {
    marginTop: 10,
  },
  layout: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 0,
    flexBasis: "calc(100% - 280px)",
    backgroundColor: "#ffffff",
    flexWrap: "wrap",
    minHeight: "100vh",
    flexGrow: 1,
    background: `url(${backgroundImage}) center no-repeat`,
    backgroundSize: "cover",
  },
  authLayoutContainer: {
    // width: '100%',
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    // marginTop: 50,
    // border: '1px solid red',
    // background: `url(${backgroundImage})`,
    // backgroundSize: 'cover'
  },
  authLayoutFormContainer: {
    width: "100%",
    maxWidth: "422px",
    padding: "30px 38px 20px 38px",
    backgroundColor: "white",
    borderRadius: "16px",
  },
  buttonContainer: {
    // border: '1px solid green',
    display: "flex",
    justifyContent: "center",
  },
  toggle: {
    paddingBottom: "10px",
    cursor: "pointer",
    marginTop: 10,
    marginBottom: 0,
    // marginBottom: 0,
    borderBottom: "2px solid transparent",
    ":hover": {
      opacity: 0.6,
    },
  },
  stateTextStyle: {
    color: "#ff2b74",
  },
};
