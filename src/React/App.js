import React, { useState, useEffect } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { ApolloProvider } from '@apollo/client';
import * as Sentry from '@sentry/browser';
import ReactGA from 'react-ga';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


import useAppSyncClient from '../Hooks/useAppSyncClient';
import { CurrentUserProvider } from '../Contexts/CurrentUser';
import { AppBarProvider } from './Contexts/AppBar';
import useCurrentUser from '../Hooks/useCurrentUser';






const AppWithCognitoUser = ({
  cognitoUser, 
  children, 
  useFindUser,
  useCreateUser,
  useUpdateUser,
  useNotificationPermissions,
}) => {
  const currentUser = useCurrentUser({cognitoUser, useNotificationPermissions, useFindUser, useCreateUser, useUpdateUser});
  return (
    <CurrentUserProvider currentUser={currentUser}>
      {
        typeof(currentUser) === 'undefined' ? (
          null
        ) : (          
          <AppBarProvider>
            {children}
          </AppBarProvider>
        )
      }
    </CurrentUserProvider>
  )
}



export default ({
  children, 
  theme, 
  sentryUrl, 
  amplifyConfig, 
  ga,
  useFindUser,
  useCreateUser,
  useUpdateUser,
  useNotificationPermissions,
}) => {
  const [cognitoUser, setCognitoUser] = useState(undefined);
  const appsyncClient = useAppSyncClient({cognitoUser, appSyncConfig: amplifyConfig});
  
  

  useEffect(() => {
    Auth.currentAuthenticatedUser({bypassCache: true})
      .then(cognitoUser => setCognitoUser(cognitoUser))
      .catch(err => setCognitoUser(null))

    Amplify.configure(amplifyConfig);
    
    !!sentryUrl && Sentry.init({
      dsn: sentryUrl
    });

    !!ga && ReactGA.initialize(ga);
  }, []);

  useEffect(() => {
    const onAuthEvent = capsule => {
      switch (capsule.payload.event) {
        case 'signOut':
          setCognitoUser(null);
          ReactGA.event({
            category: 'Authentication',
            action: 'signOut'
          });
          break;
        case 'signIn_failure':
          ReactGA.event({
            category: 'Authentication',
            action: 'signIn_failure'
          });
          break;
        case 'signUp_failure':
          ReactGA.event({
            category: 'Authentication',
            action: 'signUp_failure'
          });
          break;
        case 'signIn':
          setCognitoUser(capsule.payload.data);
          ReactGA.event({
            category: 'Authentication',
            action: 'signIn'
          });
          break;
        case 'signUp':
          setCognitoUser(capsule.payload.data);
          ReactGA.event({
            category: 'Authentication',
            action: 'signUp'
          });
          break;
        default:
          break;
      }
    }

    Hub.listen('auth', onAuthEvent);

    return () =>
      Hub.remove(('auth', onAuthEvent))
  }, []);


  return ( !appsyncClient ? null :
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ApolloProvider client={appsyncClient}>
        {/* <Rehydrated> */}
          <MuiThemeProvider theme={theme}>
            <AppWithCognitoUser 
              appsyncClient={appsyncClient} 
              cognitoUser={cognitoUser} 
              useFindUser={useFindUser}
              useCreateUser={useCreateUser}
              useUpdateUser={useUpdateUser}
              useNotificationPermissions={useNotificationPermissions}
            >
              {children}
            </AppWithCognitoUser>
          </MuiThemeProvider>
        {/* </Rehydrated> */}
      </ApolloProvider>
    </MuiPickersUtilsProvider>
  );
}