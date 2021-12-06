import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'semantic-ui-react';

export const MyButton = ({primary, label, ...props}) => {
    const mode = primary ? 'primary' : 'secondary';
    console.log(props, primary, label, mode);
    return (
        <Button
            className={mode}
            {...props}
        >
            {label}
        </Button>
    )
};

MyButton.propTypes = {
    primary: PropTypes.bool,
    label: PropTypes.string.isRequired
}

MyButton.defaultProps = {
    primary: false
};
