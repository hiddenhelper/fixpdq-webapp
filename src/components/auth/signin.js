import { Auth } from "aws-amplify";
import { css } from "glamor";
import React, { useContext, useState } from "react";
import { Loader } from "semantic-ui-react";
import { createFirstSwarm } from "../../services/swarms";
import {
  AuthContext,
  CurrentSwarmContext,
  SwarmsContext,
} from "../../store/context";
import { storeItem } from "../../utils/local-storage";
import UserContext from "../user/context";
import clearLocalStorage from '../../functions/clear-local-storage';

const AUTH_RECORD = "auth-user";

const SignIn = ({ updateErrorMessage, history }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [signinState, setSigninState] = useState({
    email: "",
    password: "",
    showConfirmation: false,
    user: {},
    authCode: "",
  });

  const context = useContext(UserContext);
  const { fetchSwarmsList, clearMyFirstSwarm } = useContext(SwarmsContext);
  const { clearCurrentSwarm } = useContext(CurrentSwarmContext);
  const { getUserName } = useContext(AuthContext);
  const onChange = (key, value) => {
    updateErrorMessage(null);
    setSigninState({
      ...signinState,
      [key]: value,
    });
  };

  const clearContext = () => {
    clearCurrentSwarm();
    clearMyFirstSwarm();
  };

  const signIn = async () => {
    const { updateCurrentUser } = context;
    try {
      setIsLoading(true);
      const user = await Auth.signIn(signinState.email, signinState.password);
      if (!user.signInUserSession) {
        setSigninState(...signinState, ...{ user, showConfirmation: true });
      } else {
        updateCurrentUser(user);
        storeItem(AUTH_RECORD, user.username);
        getUserName();
        history.push("/home");
      }
      setIsLoading(false);
    } catch (err) {
      console.log("[signIn] error signing in...: ", err);
      if (err.code && err.code === "UserNotConfirmedException") {
        // TBA - show confirmation
      } else {
        updateErrorMessage(err.message);
      }
      setIsLoading(false);
    }
    const { success } = await createFirstSwarm();
    clearContext();
    if (success) {
      await fetchSwarmsList();
    }
  };
  const confirmSignIn = async () => {
    try {
      setIsLoading(true);
      await Auth.confirmSignIn(
        signinState.user,
        signinState.authCode,
        signinState.user.challengeName
      );
      clearLocalStorage();
      history.push("/");
      setIsLoading(false);
    } catch (err) {
      console.log("error confirming signing in...: ", err);
      setIsLoading(false);
    }
  };
  return (
    <div {...css(styles.container)}>
      {!signinState.showConfirmation && (
        <div {...css(styles.formContainer)}>
          <div {...css(styles.signInHeader)} className="fix_menu_12">Email</div>
          <input
            onChange={(evt) => onChange("email", evt.target.value)}
            {...css(styles.input)}
            placeholder="example@mail.com"
            data-cy="email-form"
            required
            className="fix_background_grey1 fix_paragraph_body_12"
          />

          <div {...css(styles.signInHeader)} className="fix_menu_12">Password</div>
          <input
            type="password"
            onChange={(evt) => onChange("password", evt.target.value)}
            {...css(styles.input)}
            placeholder="At least 8 characters"
            data-cy="password-form"
            required
            className="fix_background_grey1 fix_paragraph_body_12"
          />
          <div {...css(styles.buttonPrimary)} className="fix_background_yellow_shadow" onClick={signIn}>
            <div className="fix_menu_12" data-cy="login-button">
              Login
            </div>
          </div>
        </div>
      )}
      {signinState.showConfirmation && (
        <div {...css(styles.formContainer)}>
          <input
            data-cy="signin-input-7948"
            onChange={(evt) => onChange("authCode", evt.target.value)}
            {...css(styles.input)}
            placeholder="Confirmation Code"
            className="fix_background_grey1 fix_paragraph_body_12"
          />
          <div
            {...css(styles.buttonPrimary)}
            onClick={confirmSignIn.bind(this)}
            className="fix_background_yellow_shadow"
          >
            <div className="fix_menu_12">Confirm Sign In</div>
          </div>
        </div>
      )}
      <div {...css(styles.loader)}>
        <Loader active={isLoading} />
      </div>
    </div>
  );
};

const styles = {
  signInHeader: {
    textAlign: "left",
    margin: "0px 0px 5px",
  },
  buttonPrimary: {
    padding: "10px 60px",
    marginTop: 10,
    marginBottom: 10,
    cursor: "pointer",
    borderRadius: "8px",
  },
  button: {
    padding: "10px 60px",
    backgroundColor: "#ffb102",
    marginTop: 10,
    marginBottom: 10,
    cursor: "pointer",
    borderRadius: "30px",
    ":hover": {
      backgroundColor: "#ffbb22",
    },
  },
  input: {
    height: 40,
    marginBottom: "10px",
    border: "1px solid #c9c9c9",
    borderRadius: "6px",
  },
  container: {
    flex: 1,
    paddingTop: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formContainer: {
    padding: 20,
    width: 400,
    display: "flex",
    flexDirection: "column",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
};

export default SignIn;
