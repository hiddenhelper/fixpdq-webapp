import { Auth } from "aws-amplify";
import { css } from "glamor";
import React, { useState } from "react";
import { Loader } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";

const SignUp = ({ updateErrorMessage, switchState }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [signupState, setSignupState] = useState({
    username: "",
    password: "",
    email: "",
    authCode: "",
    showConfirmation: false,
    confirmationErrorCount: 0,
    attemptsExhausted: false,
  });

  const [codedUsername] = useState(uuidv4());

  const onChange = (key, value) => {
    updateErrorMessage(null);
    setSignupState({ ...signupState, [key]: value });
  };

  const signUp = async () => {
    const { password, email } = signupState;
    try {
      setIsLoading(true);
      await Auth.signUp({
        password,
        username: codedUsername,
        attributes: {
          email: email.toLowerCase(),
          // 'custom:xxx': 'value'
          // pass custom user attributes here
        },
      });
      setSignupState({
        ...signupState,
        showConfirmation: true,
        username: codedUsername,
      });
      setIsLoading(false);
    } catch (err) {
      console.log("error signing up: ", err);
      updateErrorMessage(err.message);
      setIsLoading(false);
    }
  };
  const confirmSignUp = async () => {
    try {
      setIsLoading(true);
      await Auth.confirmSignUp(codedUsername, signupState.authCode);
      switchState("showSignIn");
      setIsLoading(false);
    } catch (err) {
      console.log("[confirmSignUp]: ", err);
      let errorCount = signupState.confirmationErrorCount + 1;

      if (errorCount > 2) {
        setSignupState({ ...signupState, attemptsExhausted: true });
      }

      updateErrorMessage(err.message + " Attempt number " + errorCount + " ");
      setSignupState({ ...signupState, confirmationErrorCount: 0 });
      setIsLoading(false);
    }
  };
  const { showConfirmation } = signupState;
  return (
    <div {...css(styles.container)}>
      {!showConfirmation && (
        <div {...css(styles.formContainer)}>
          <div {...css(styles.signUpHeader)} className="fix_menu_12">Email</div>
          <input
            {...css(styles.input)}
            placeholder="example@mail.com"
            onChange={(evt) => onChange("email", evt.target.value)}
            data-cy="register-email-input"
            className="fix_background_grey1 fix_paragraph_body_12"
          />

          <div {...css(styles.signUpHeader)} className="fix_menu_12">Password</div>
          <input
            {...css(styles.input)}
            placeholder="At least 8 charactors"
            type="password"
            onChange={(evt) => onChange("password", evt.target.value)}
            data-cy="register-password-input"
            className="fix_background_grey1 fix_paragraph_body_12"
          />
          <div {...css(styles.passwordPolicy)} className="fix_paragraph_body_12">
            <p>*Minimum length: 12</p>
            <p>*Require numbers</p>
            <p>*Require special character</p>
            <p>*Require uppercase letters</p>
            <p>*Require lowercase letters</p>
          </div>
          <div {...css(styles.buttonPrimary)} onClick={signUp} className="fix_background_yellow_shadow">
            <div data-cy="register-button" className="fix_menu_12">
              Register
            </div>
          </div>
        </div>
      )}
      {showConfirmation && (
        <div {...css(styles.formContainer)}>
          <input
            data-cy="signup-input-90200"
            onChange={(evt) => onChange("authCode", evt.target.value)}
            {...css(styles.input)}
            placeholder="Confirmation Code"
            className="fix_background_grey1 fix_paragraph_body_12"
          />
          <div {...css(styles.buttonPrimary)} onClick={confirmSignUp} className="fix_background_yellow_shadow">
            <div className="fix_menu_12">Confirm Code</div>
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
  signUpHeader: {
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
    cursor: "pointer",
    borderRadius: "30px",
    marginTop: 10,
    marginBottom: 10,
    ":hover": {
      backgroundColor: "#ffbb22",
    },
  },
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    paddingTop: "15px",
  },
  formContainer: {
    padding: 20,
    width: 400,
    display: "flex",
    flexDirection: "column",
  },
  input: {
    height: 40,
    marginBottom: "10px",
    border: "1px solid #c9c9c9",
    borderRadius: "8px",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  passwordPolicy: {
    textAlign: "left",
    paddingLeft: "10px",
  },
};

export default SignUp;
