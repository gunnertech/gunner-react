import { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify';

import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { AUTH_TYPE } from "aws-appsync";

import { ApolloClient, from, gql, HttpLink, InMemoryCache, split } from "@apollo/client";
// import AWSAppSyncClient from "aws-appsync";



export default ({cognitoUser, appSyncConfig}) => {
  const [appSyncClient, setAppSyncClient] = useState(null);
  const isSignedIn = cognitoUser === undefined ? undefined : !!cognitoUser

  // const client = new AWSAppSyncClient({
  //   url: url,
  //   region: region,
  //   auth: !!cognitoUser ? cognitoAuth : iamAuth,
  //   disableOffline: true
  // });

  useEffect(() => {
    const url = appSyncConfig.aws_appsync_graphqlEndpoint;
    const region = appSyncConfig.aws_appsync_region;
    const httpLink = new HttpLink({
      uri: url,
    });

    const iamAuth = {
      type: AUTH_TYPE.AWS_IAM, 
      credentials: () => Auth.currentCredentials()
    };

    const cognitoAuth = {
      type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
    };

    // const iamLink = ApolloLink.from([
    //   createAuthLink({ url, region, auth: iamAuth }),
    //   createSubscriptionHandshakeLink({ url, region, auth: iamAuth })
    // ]);

    // const cache = new InMemoryCache();

    // const cognitoLink = ApolloLink.from([
    //   createAuthLink({ url, region, auth: cognitoAuth }),
    //   createSubscriptionHandshakeLink({ url, region, auth: cognitoAuth }),
    // ]);

    // const iamClient = new ApolloClient({
    //   link: iamLink,
    //   cache
    // })

    // const cognitoClient = new ApolloClient({
    //   link: cognitoLink,
    //   cache
    // })

    const auth = !!cognitoUser ? cognitoAuth : iamAuth;
    
    const client = isSignedIn === undefined ? null : new ApolloClient({
      cache: new InMemoryCache(),
      link: from([
        createAuthLink({
          url,
          auth,
          region,
        }),
        split(op => {
          const {operation} = op.query.definitions[0];
    
          if(operation === 'subscription') {
            return false;
          }
    
          return true;
        }, httpLink, createSubscriptionHandshakeLink(
          {
            auth,
            region,
            url,
          },
          httpLink
        ))
      ]),
    });

    setAppSyncClient(client)
    
    return () => setAppSyncClient(null)
  }, [isSignedIn]);

  return appSyncClient;
}