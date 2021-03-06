/* eslint-disable */

import React, { useState, useEffect } from 'react';

import Auth from '@aws-amplify/auth';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withoutBlanks from "../../../Util/withoutBlanks"

import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@material-ui/core';

import { Link } from 'react-router-dom'


import { PasswordField, CustomField, UsernameField } from "./Fields"


  

const SignUp = ({
  initialUsernameValue = "", 
  initialPasswordValue = "", 
  usernameField = "email", 
  customFields = {}, 
  order=['username', 'password'],
  onValueChange,
  onAuthStateChange,
  getValues
}) => {
  const [loading, setLoading] = useState(false);
  const [usernameValue, setUsernameValue] = useState(initialUsernameValue);
  const [usernameValid, setUsernameValid] = useState(false);
  const [passwordValue, setPasswordValue] = useState(initialPasswordValue);
  const [passwordValid, setPasswordValid] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [customsValue, setCustomsValue] = useState(Object.entries(customFields).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value.initialValue || ""
  }), {}));

  const [customsValid, setCustomsValid] = useState(Object.entries(customFields).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: !!value.required ? false : true
  }), {}));

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    onValueChange('username', usernameValue)
  }, [usernameValue])

  useEffect(() => {
    onValueChange('password', passwordValue)
  }, [passwordValue])

  useEffect(() => {
    Object.entries(customsValue).forEach(([key, value]) => 
      onValueChange(key, value)
    )
  }, [JSON.stringify(customsValue)])

  useEffect(() => {
    setIsValid(
      usernameValid && 
      passwordValid &&
      agreedToTerms &&
      Object.values(customsValid).every(value => !!value)
    );
  }, [usernameValid, passwordValid, agreedToTerms, JSON.stringify(customsValid)]);

  useEffect(() => {
    !!loading && 
    Auth.signUp({
      username: usernameValue,
      password: passwordValue,
      attributes: withoutBlanks({
        ...customsValue,
        ...(
          !!(customsValue.phone_number||"").replace(/\D+/g,"") ? ({
            phone_number: `+${customsValue.phone_number.replace(/\D+/g,"")}`,
          }) : ({})
        ),
        ...(
          !!customsValue['custom:mobile'] ? ({
            'custom:mobile': `+${customsValue['custom:mobile'].replace(/\D+/g,"")}`,
          }) : ({})
        )
      })
    })
      .then(data => [
        console.log(data),
        setLoading(false),
        onAuthStateChange('confirmsignup', {type: 'info', message: "Enter the confirmation code sent to your email address to confirm your account"})
      ])
      .catch(err => [
        console.log(err),
        setLoading(false),
        window.alert(/failed with error/.test(err.message) ? err.message.split("failed with error")[1] : err.message)
      ])
  }, [loading])

  return (
    <form noValidate autoComplete="off">
      {
        order.map(slug => 
          slug === 'username' ? (
            <UsernameField 
              key={slug}
              value={usernameValue} 
              usernameField={usernameField} 
              onValueChange={setUsernameValue}
              onValidChange={setUsernameValid}
              showValidators={true}
            />
          ) : slug === 'password' ? (
            <PasswordField
              key={slug}
              value={passwordValue} 
              onValueChange={setPasswordValue}
              onValidChange={setPasswordValid}
              showValidators={true}
            />
          ) : (
            <CustomField
              key={slug}
              value={customsValue[slug]} 
              onValueChange={value => setCustomsValue({
                ...customsValue,
                [slug]: value
              })}
              onValidChange={valid => setCustomsValid({
                ...customsValid,
                [slug]: valid
              })}
              showValidators={true}
              customField={customFields[slug]}
            />
          )
        )
      }
      
      <Button 
        variant="contained" 
        color="secondary" 
        fullWidth 
        disabled={!isValid || !!loading} 
        size="large"
        onClick={() => setLoading(true) }
      >
        Sign Up
      </Button>
      <FormControl style={{display: "flex"}}>
        <FormGroup value={!!agreedToTerms} onChange={({target: {checked}}) => setAgreedToTerms(!!checked)} row>
          <FormControlLabel
            control={<Checkbox checked={!!agreedToTerms} color="primary" />}
            label={<>I have read and agree to the <Link target="_blank" to="/pages/terms">Terms and Conditions</Link></>}
            labelPlacement="end"
          />
        </FormGroup>
      </FormControl>
      <Typography paragraph align="left" variant="overline">
        Have an account?
        &nbsp;
        <Typography onClick={() => onAuthStateChange("signin")} color="secondary" component={"a"} variant="overline">Sign In</Typography>
      </Typography>
      <Typography paragraph align="left" variant="overline">
        Have a code?
        &nbsp;
        <Typography onClick={() => onAuthStateChange("confirmsignup")} color="secondary" component={"a"} variant="overline">Confirm Account</Typography>
      </Typography>
    </form>
  )
}


export default SignUp;