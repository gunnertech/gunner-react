import React, { useState, useEffect, useMemo } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { Analytics as AmplifyAnalytics } from 'aws-amplify'
import { ApolloProvider } from '@apollo/client';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as Font from 'expo-font';
// import * as Sentry from 'sentry-expo';
import { Analytics, Event } from 'expo-analytics';


import { AppearanceProvider, useColorScheme, Appearance } from 'react-native-appearance';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useLinking,
} from '@react-navigation/native';

import { ThemeProvider } from 'react-native-elements';
import { StatusBar } from 'react-native';
import { CognitoUserProvider } from '../Contexts/CognitoUser';
import { CurrentUserProvider } from '../Contexts/CurrentUser';
import useAppSyncClient from '../Hooks/useAppSyncClient';
import useCurrentUser from '../Hooks/useCurrentUser';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

const AppearanceComponent = ({children}) => {
  const [scheme, setScheme] = useState(useColorScheme());

  StatusBar.setBarStyle(scheme === 'dark' ? 'light-content' : 'dark-content');
    
 

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      colorScheme !== scheme &&
      setScheme(colorScheme);
    });
    
    return () => subscription.remove()
  }, [])
  

  return children(scheme)
}


const InnerApp = ({
  scheme, 
  getElementsTheme, 
  children, 
  cognitoUser,
  useFindUser,
  useCreateUser,
  useUpdateUser,
  useNotificationPermissions,
}) => {
  const currentUser = useCurrentUser({cognitoUser, useNotificationPermissions, useFindUser, useCreateUser, useUpdateUser});
  
  // return useMemo(() => 
  return (
    <ActionSheetProvider>
      <CurrentUserProvider currentUser={currentUser}>
        <ThemeProvider theme={getElementsTheme({navTheme: scheme === 'dark' ? DarkTheme : DefaultTheme, scheme})}>
          {
            typeof(currentUser) === 'undefined' ? (
              <></>
            ) : (
              children
            )
          }
        </ThemeProvider>
      </CurrentUserProvider>
    </ActionSheetProvider>
  )
  // , [JSON.stringify(currentUser)])
}

const App = ({
  fonts, 
  initialState: passedInitialState, 
  getElementsTheme = args => args, 
  children, 
  sentryUrl, 
  amplifyConfig, 
  ga,
  useFindUser,
  useCreateUser,
  useUpdateUser,
  useNotificationPermissions,
}) => {
  const ref = React.useRef();
  const [cognitoUser, setCognitoUser] = useState(undefined);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const client = useAppSyncClient({cognitoUser, appSyncConfig: amplifyConfig});
  const analytics = useMemo(() => new Analytics(ga), [ga]);

  const { getInitialState } = useLinking(ref, passedInitialState);

  Amplify.configure(amplifyConfig);
  AmplifyAnalytics.configure({ disabled: true });

  !!sentryUrl && [
    Sentry.init({
      dsn: sentryUrl,
      enableInExpoDevelopment: false,
      debug: true
    }),
    Sentry.setRelease(Constants.manifest.revisionId)
  ]

  useEffect(() => {
    getInitialState()
      .catch(() => null)
      .then(state => [
        state !== undefined && setInitialState(state),
        setIsReady(true)
      ]);
  }, [getInitialState]);

  useEffect(() => {
    Font.loadAsync(fonts)
      .then(() => setFontLoaded(true))
  }, [])

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(cognitoUser => setCognitoUser(cognitoUser))
      .catch(err => console.log(err) || setCognitoUser(null))
  }, []);

  useEffect(() => {
    const onAuthEvent = capsule => {
      switch (capsule.payload.event) {
        case 'signOut':
          setCognitoUser(null);
          analytics
            .event(new Event('Authentication', 'signOut'))
            .catch(e => console.log(e.message))
          break;
        case 'signIn_failure':
          analytics
            .event(new Event('Authentication', 'signIn_failure'))
            .catch(e => console.log(e.message))
          break;
        case 'signUp_failure':
          analytics
            .event(new Event('Authentication', 'signUp_failure'))
            .catch(e => console.log(e.message))
          break;
        case 'signIn':
          setCognitoUser(capsule.payload.data);
          analytics
            .event(new Event('Authentication', 'signIn'))
            .catch(e => console.log(e.message))
          break;
        case 'signUp':
          analytics
            .event(new Event('Authentication', 'signUp'))
            .catch(e => console.log(e.message))
          break;
        default:
          break;
      }
    }

    Hub.listen('auth', onAuthEvent);

    // return () =>
    //   Hub.remove(('auth', onAuthEvent))
  }, []);


  return (
    !fontLoaded ? null :
    !client ? null :
    !isReady ? null :
    cognitoUser === undefined ? null :
    <CognitoUserProvider cognitoUser={cognitoUser}>
      <SafeAreaProvider>
        <AppearanceProvider>
          <AppearanceComponent>
            {scheme =>
              <NavigationContainer initialState={initialState} ref={ref} theme={getElementsTheme({navTheme: scheme === 'dark' ? DarkTheme : DefaultTheme, scheme})}>
                <ApolloProvider client={client}>
                  {/* <Rehydrated> */}
                    <InnerApp 
                      cognitoUser={cognitoUser} 
                      useFindUser={useFindUser}
                      useCreateUser={useCreateUser}
                      useUpdateUser={useUpdateUser}
                      useNotificationPermissions={useNotificationPermissions}
                      scheme={scheme} 
                      getElementsTheme={getElementsTheme}
                    >
                      {children}
                    </InnerApp>
                  {/* </Rehydrated> */}
                </ApolloProvider>
              </NavigationContainer>
            }
          </AppearanceComponent>
        </AppearanceProvider>
      </SafeAreaProvider>
    </CognitoUserProvider>
  );
}

export default App