import React from 'react';

export const UserContext = React.createContext('user');

export const withUserContext = Element => {
  return React.forwardRef((props, ref) => {
    return (
      <UserContext.Consumer>
        {context => <Element authUser={context} {...props} ref={ref} />}
      </UserContext.Consumer>
    );
  });
};

export default UserContext;
