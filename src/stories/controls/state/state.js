import React from 'react'
import PropTypes from 'prop-types';

import { Container, Button, Icon } from 'semantic-ui-react'

export const ButtonState = ({label, color, icon}) => (
  <Container textAlign={"center"}>
    <Button icon><Icon name={icon} color={color}/></Button>
    <Button className={color} content={label} />
  </Container>
);

ButtonState.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
}
