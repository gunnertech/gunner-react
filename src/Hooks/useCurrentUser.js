/* eslint-disable */

import { useState, useEffect, useMemo } from "react";



const useFindUser = ({cognitoUser}) => ({})
  
const useUpdateUser = ({cognitoUser}) => [() => Promise.resolve(null)]
  
const useCreateUser = ({cognitoUser}) => [() => Promise.resolve(null)]
  
const useNotificationPermissions = currentUser => ({})

export default ({
  cognitoUser,
  useFindUser = ({cognitoUser}) => ({user: cognitoUser}),
  useCreateUser = ({cognitoUser}) => [() => Promise.resolve(null)],
  useUpdateUser = ({cognitoUser}) => [() => Promise.resolve(null)],
  useNotificationPermissions = currentUser => ({})
}) => {
  const [currentUser, setCurrentUser] = useState(undefined);
 
  const { loading, error, user } = useFindUser({cognitoUser})
  // const user = !!users && Array.isArray(users) ? users[0] : users;
  
  const [_createUser] = useCreateUser({cognitoUser})

  const [_updateUser] = useUpdateUser({cognitoUser})

  const memoizedCurrentUser = useMemo(() => !!currentUser?.id ? {...currentUser} : currentUser, [
    JSON.stringify(currentUser),
  ])

  useNotificationPermissions(currentUser);

  !!error && console.log("ERROR", error);

  useEffect(() => {
    !!user &&
    !!cognitoUser &&
    setCurrentUser({...user, ...cognitoUser, groups: (cognitoUser.signInUserSession.accessToken.payload['cognito:groups'] || [])})
  }, [JSON.stringify(user), !!cognitoUser])


  useEffect(() => {
    
    !cognitoUser || !cognitoUser.attributes ? (
      setCurrentUser(null)
    ) : !loading && !user ? (
      _createUser()
        .then(result => !result && setCurrentUser(null))
    ) : !loading && !!user ? (
      _updateUser()
    ) : (
      console.log(null)
    )
  }, [cognitoUser, !!user, loading]);

  return memoizedCurrentUser;
}