import { css } from "glamor";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { CurrentSwarmContext, SwarmsContext } from "../../store/context";

export const LogOut = ({ signOut, isRequestOnFlight }) => {
  const { clearMyFirstSwarm } = useContext(SwarmsContext);
  const { clearCurrentSwarm } = useContext(CurrentSwarmContext);
  const styles = {
    link: {
      textDecoration: "none",
    },
  };
  const handleSignOut = () => {
    clearMyFirstSwarm();
    clearCurrentSwarm();
    signOut();
    window.location.reload();
  };

  return (
    <Button data-cy="profile-logout-button" disabled={isRequestOnFlight}>
      <Link to="/#" {...css(styles.link)} onClick={handleSignOut}>
        LOGOUT
      </Link>
    </Button>
  );
};
