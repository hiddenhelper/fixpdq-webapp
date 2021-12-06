import React from 'react';
import logo from '../../../assets/images/logo.svg';
import styles from './styles';
import { css } from "glamor";
import { Button } from "semantic-ui-react";

const ErrorFallback = ({error, resetErrorBoundary}) => {

  return (
    <div {...css(styles.container)}>

        <img src={logo} alt='logo' width="120px"/>
        <div {...css(styles.mainText)}>Uh oh there's been an error</div>
        {(!process.env.REACT_APP_ENV || 
            (process.env.REACT_APP_ENV && process.env.REACT_APP_ENV.trim() !== 'production')) &&
            <div {...css(styles.secondaryText)}>{error.message}</div>
        }

        <Button
            data-cy="profile-save-button"
            onClick={resetErrorBoundary}
            {...css(styles.button)}
            >
            Try again
        </Button>

    </div>
  );
};

export default ErrorFallback;