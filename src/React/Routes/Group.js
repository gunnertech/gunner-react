import React, { useContext } from 'react';
import { Route, Redirect } from "react-router-dom";
import { CurrentUserContext } from '../../Contexts/CurrentUser';




export default ({ 
  component: Component, 
  redirectTo = "/",
  group = "Admins",
  ...rest 
}) => {
  const currentUser = useContext(CurrentUserContext);

  return (
    <Route {...rest} render={props => 
      !!currentUser && 
      currentUser.groups.includes(group) ? (
        <Component {...props} />
      ) : (
        <Redirect to={redirectTo} />
      )
    } />
  )
}
