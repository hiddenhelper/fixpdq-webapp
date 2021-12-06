import React from 'react'
import PropTypes from 'prop-types';
import  { Label as BaseLabel} from "semantic-ui-react";

export const Label = ({label, color}) => (
  <BaseLabel color={color} tag>{label}</BaseLabel>
)

Label.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
}
