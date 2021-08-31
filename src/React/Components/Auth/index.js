/* eslint-disable */

import React, { useState, useEffect } from 'react';
import SignUp from "./SignUp"
import SignIn from "./SignIn"
import ForgotPassword from "./ForgotPassword"
import ConfirmSignUp from "./ConfirmSignUp"
import Snackbar from "./Components/Snackbar"

//import queryString from 'query-string'
import RequireNewPassword from './RequireNewPassword';



const Complete = ({onComplete}) => {
  useEffect(() => {
    onComplete && onComplete()
  }, []);

  return null
}

const Auth = ({
  onComplete,
  newAuthState,
  history,
  location: {search = ""} = {},
  initialAuthState = "signin", 
  usernameField = "email",
  initialUsernameValue = "",
  initialPasswordValue = "",
  signUpOrder = ['username', 'name', 'password'],
  customFields = {
    "phone_number": {
      label: "Mobile Phone",
      required: false,
      type: 'phone',
      initialValue: "",
      validations: {
        "Valid phone number": /^\+\d\d?\d? \(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      }
    },
    "name": {
      label: "Name",
      required: true,
      type: 'text',
      initialValue: "",
      validations: {
        "Can't be blank": /^.+$/
      }
    },
    // "given_name": {
    //   label: "First Name",
    //   required: true,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {
    //     "Can't be blank": /^.+$/
    //   }
    // },
    // "address": {
    //   label: "Address",
    //   required: true,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {
    //     "Can't be blank": /^.+$/
    //   }
    // },
    // "birthdate": {
    //   label: "Birthdate",
    //   required: true,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {
    //     "Can't be blank": /^.+$/
    //   }
    // },
    // "custom:address2": {
    //   label: "Address 2",
    //   required: false,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {}
    // },
    // "custom:city": {
    //   label: "City",
    //   required: true,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {
    //     "Can't be blank": /^.+$/
    //   }
    // },
    // "custom:zip": {
    //   label: "Zip",
    //   required: true,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {
    //     "Must be a valid zip code": /^\d{5}$|^\d{5}-\d{4}$/
    //   }
    // },
    // "custom:state": {
    //   label: "State",
    //   required: true,
    //   type: 'text',
    //   initialValue: "",
    //   validations: {},
    //   options: STATES.map(([label, value]) => ({label, value}))
    // },
      
  }
}) => {
  const routeAuthState = !!location ? (location.pathname||"").replace(/\W/g, "") : "";
  const [authState, setAuthState] = useState(
    !!(new URL(window.location.href)).searchParams.get("resetCode") ? (
      "forgotpassword"
    ) : ['signin','signup'].includes(routeAuthState) ? (
      routeAuthState
   ) : (
     initialAuthState
  ))//useState(queryString.parse(location.search).authState || initialAuthState);
  const [message, setMessage] = useState({});
  const [authData, setAuthData] = useState({});
  const [values, setValues] = useState({
    username: initialUsernameValue,
    password: initialPasswordValue,
    ...Object.entries(customFields).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value.initialValue || ""
    }), {})
  });
  
  const getValues = () => values

  useEffect(() => {
    !!newAuthState &&
    setAuthState(newAuthState)
  }, [newAuthState])

  return (
    <>
      {
        !!message &&
        !!message.message &&
        <Snackbar 
          message={message.message} 
          type={message.type || 'info'} 
          forceOpen={!!message.message} 
        />
      }
      {
        authState === "signup" ? (
          <SignUp
            onValueChange={(field, value) => setValues({
              ...values,
              [field]: value
            })}
            initialUsernameValue={values.username}
            initialPasswordValue={values.password} 
            usernameField={usernameField}
            order={signUpOrder}
            customFields={customFields}
            onAuthStateChange={(authState, message) => [setAuthState(authState), setMessage(message)]}
            getValues={getValues}
          />
        ) : authState === "signin" ? (
          <SignIn
            onValueChange={(field, value) => setValues({
              ...values,
              [field]: value
            })}
            initialUsernameValue={values.username}
            initialPasswordValue={values.password}  
            usernameField={usernameField}
            order={['username','password']}
            onAuthStateChange={(authState, message, authData) => [setAuthState(authState), setMessage(message), setAuthData(authData)]}
          />
        ) : authState === "forgotpassword" ? (
          <ForgotPassword
            onValueChange={(field, value) => setValues({
              ...values,
              [field]: value
            })}
            usernameField={usernameField}
            order={['username', 'code', 'password']}
            onAuthStateChange={(authState, message) => [setAuthState(authState), setMessage(message)]}
          />
        ) : authState === "confirmsignup" ? (
          <ConfirmSignUp
            initialUsernameValue={values.username}
            usernameField={usernameField}
            onValueChange={(field, value) => setValues({
              ...values,
              [field]: value
            })}
            onAuthStateChange={(authState, message) => [setAuthState(authState), setMessage(message)]}
          />
        ) : authState === "requirenewpassword" ? (
          <RequireNewPassword
            initialUsernameValue={values.username}
            onValueChange={(field, value) => setValues({
              ...values,
              [field]: value
            })}
            onAuthStateChange={(authState, message) => [setAuthState(authState), setMessage(message)]}
            usernameField={usernameField}
            order={['username', 'password']}
            customFields={customFields}
            authData={authData}
          />
        ) : (
          <Complete onComplete={onComplete} />
        )
      }
    </>
  )
}

export default Auth