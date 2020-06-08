import React from 'react';

const CognitoUserContext = React.createContext();

const CognitoUserProvider = ({children, cognitoUser}) => 
  <CognitoUserContext.Provider value={cognitoUser}>      
    {children}
  </CognitoUserContext.Provider>

export { CognitoUserContext, CognitoUserProvider };

