import { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify';

import { createAuthLink } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { AUTH_TYPE } from "aws-appsync";

import { ApolloClient, createHttpLink, InMemoryCache, ApolloLink } from '@apollo/client';


export default ({cognitoUser, appSyncConfig}) => {
  const url = appSyncConfig.aws_appsync_graphqlEndpoint;
  const region = appSyncConfig.aws_appsync_region;

  const iamAuth = {
    type: AUTH_TYPE.AWS_IAM, 
    credentials: () => Auth.currentCredentials()
  };

  const cognitoAuth = {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
    jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
  };

  const httpLink = createHttpLink({ uri: url });

  const iamLink = ApolloLink.from([
    createAuthLink({ url, region, auth: iamAuth }),
    createSubscriptionHandshakeLink({ url, region, auth: iamAuth })
  ]);

  const cache = new InMemoryCache();

  const cognitoLink = ApolloLink.from([
    createAuthLink({ url, region, auth: cognitoAuth }),
    createSubscriptionHandshakeLink({ url, region, auth: cognitoAuth }),
  ]);

  const iamClient = new ApolloClient({
    link: iamLink,
    cache
  })

  const cognitoClient = new ApolloClient({
    link: cognitoLink,
    cache
  })

  const [appSyncClient, setAppSyncClient] = useState(null);

  useEffect(() => {
    console.log(cognitoUser === undefined ? null : !!cognitoUser ? "cognitoClient" : "iamClient")
    console.log(cognitoUser === undefined ? null : !!cognitoUser ? cognitoClient : iamClient)
    setAppSyncClient(cognitoUser === undefined ? null : !!cognitoUser ? cognitoClient : iamClient)
    
    return () => setAppSyncClient(null)
  }, [JSON.stringify(cognitoUser)]);

  return appSyncClient;
}