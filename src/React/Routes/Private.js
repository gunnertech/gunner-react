import React, { useContext } from 'react';
import { Route } from "react-router-dom";


// import AuthScreen from "../Components/Auth"
import { CurrentUserContext } from '../../Contexts/CurrentUser';

import DefaultAuthComponent from "../Components/Auth"

export default ({ 
  component: Component, 
  authComponent: AuthComponent = DefaultAuthComponent, 
  ...rest 
}) => {
  const currentUser = useContext(CurrentUserContext);
  
  return (
    <Route {...rest} render={props => {
      return (
        !!currentUser ? (
          <Component {...props} />
        ) : (
          <AuthComponent {...props} />
        )
      )
    }} />
  )
}