/* eslint-disable */
import React, { useState, useEffect } from 'react';

import FormHelperText from '@material-ui/core/FormHelperText';

import MaskedInput from 'react-text-mask';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CheckIcon from 'mdi-material-ui/Check';
import CloseIcon from 'mdi-material-ui/Close';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { OutlinedInput } from '@material-ui/core';

const UsernameAttributes = {
  EMAIL: "email",
  PHONE_NUMBER: "phone_number",
  USERNAME: "username"
}

const UsernameLabels = {
  "email": "Email",
  "phone_number": "Phone Number",
  "username": "Username"
}

const Validations = {
  "email": {
    // eslint-disable-next-line
    "Valid Email Address": /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    "Between 4 and 254 characters": /^.{4,254}$/
  },
  "username": {
    "No Sepecial Characters or spaces": /^[a-z0-9]+$/,
    "Between 4 and 254 characters": /^.{4,254}$/
  },
  "phone_number": {
    "Valid phone number": /^\+\d[\d ][\d ]\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  },
  "password": {
    'Between 8 and 25 characters': /^.{8,25}$/,
    'At least one number': /\d/,
    'At least one capital letter': /[A-Z]/,
    'At least one lowercase letter': /[a-z]/,
    'At least one special character (i.e. !$%^)': /[!@#$%^&*(),.?":{}|<>]/,
  },
  "code": {
    "Exactly six digits": /^\d{6}$/
  }
}

const countCharacters = characters =>
  !characters ? (
    0
  ) : (
    characters.replace(/\D/g, "").length
  )

const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={rawValue => !countCharacters(rawValue) ? (
        []
      // ) : countCharacters(rawValue) <= 11 ? (
      //   ['+', /\d/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
      // ) : countCharacters(rawValue) === 12 ? (
      //   ['+', /\d/, /\d/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
      ) : (
        // ['+', /\d/, /\d/, /\d/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
        ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
      )
      }
      placeholderChar={'\u2000'}
      placeholder="+1 (555) 555-5555"
      showMask
      guide
    />
  );
}

const DateMaskCustom = (props) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={rawValue => !!rawValue ? [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] : []}
      placeholder="MM/DD/YYYY"
      showMask
      guide
    />
  );
}


const PhoneField = ({customField, value, onValueChange, error, isValid}) => {

  return (
    <FormControl
      disabled={!!customField.disabled}
      required={!!customField.required}
      margin="normal"
      fullWidth
      error={!!error || (!isValid && !!value)}
      variant="outlined"
    >
      <InputLabel shrink>{customField.label}</InputLabel>
      <OutlinedInput
        disabled={!!customField.disabled}
        value={!!value && !!value.replace(/^\+1/g, "").replace(/\D/g, "") ? (/^\+1/.test(value) ? value : `+1${value}`) : (customField.initialValue ?? "")}
        onChange={({target: {value}}) => onValueChange(value.toLowerCase())}
        inputComponent={TextMaskCustom}
      />
      {
        !!error &&
        <FormHelperText>{error}</FormHelperText>
      }
    </FormControl>
  )
}

const DateField = ({customField, value, onValueChange, error, isValid}) => {

  return (
    <FormControl
      disabled={!!customField.disabled}
      required={!!customField.required}
      margin="normal"
      fullWidth
      error={!!error || (!isValid && !!value)}
      variant="outlined"
    >
      <InputLabel shrink>{customField.label}</InputLabel>
      <OutlinedInput
        disabled={!!customField.disabled}
        value={value || customField.initialValue || ""}
        onChange={({target: {value}}) => onValueChange(value.toLowerCase())}
        inputComponent={DateMaskCustom}
      />
      {
        !!error &&
        <FormHelperText>{error}</FormHelperText>
      }
    </FormControl>
  )
}


const UsernameField = ({disabled = false, value, usernameField, onValueChange, onValidChange, error, showValidators = false}) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(
      Object.entries(Validations[usernameField]).every(([key, regex]) =>
        regex.test(value)
      )
    );
  }, [usernameField, value]);

  useEffect(() => {
    onValidChange(isValid);
  }, [isValid]);
  
  return (
    <>
      {
        usernameField === UsernameAttributes.PHONE_NUMBER ? (
          <PhoneField
            customField={{
              disabled,
              required: true,
              label: UsernameLabels[usernameField]
            }}
            value={value}
            onValueChange={onValueChange}
            error={error}
            showValidators={showValidators}
            isValid={isValid}
            autoComplete="new-password"
          />
        ) : (
          <TextField
            disabled={disabled}
            required
            type={usernameField === UsernameAttributes.EMAIL ? 'email' : 'text'}
            onChange={({target: {value}}) => onValueChange(value.toLowerCase())}
            label={UsernameLabels[usernameField]}
            InputLabelProps={{shrink: true}}
            value={value}
            margin="normal"
            fullWidth
            error={!!error || (!isValid && !!value)}
            helperText={(error || "").replace(/User is disabled/, "Account has been disabled").replace("Incorrect username or password", "Your password has expired. Please click the Reset Password link below")}
            variant="outlined"
          />
        )
      }
      {
        showValidators &&
        <List dense>
          {
            Object.entries(Validations[usernameField])
              .map(([key, regex], i) =>
                <ListItem key={i}>
                  <ListItemIcon>
                    {
                      regex.test(value) ? (
                        <CheckIcon style={{color: 'green'}} />
                      ) : (
                        <CloseIcon style={{color: 'red'}} />
                      )
                    }
                  </ListItemIcon>
                  <ListItemText primary={key} />
                </ListItem>    
              )
          }
        </List>
      }
      
    </>
  )
}

const PasswordField = ({label = "Password", value, onValueChange, onValidChange, error, helperText, showValidators = false}) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(
      Object.entries(Validations.password).every(([key, regex]) =>
        regex.test(value)
      )
    );
  }, [value]);

  useEffect(() => {
    onValidChange(isValid);
  }, [isValid]);
  
  return (
    <>
      <TextField
        required
        InputLabelProps={{shrink: true}}
        type={'password'}
        onChange={({target: {value}}) => onValueChange(value)}
        label={label}
        value={value}
        margin="normal"
        fullWidth
        error={!!error || (!isValid && !!value)}
        helperText={error || helperText || ""}
        variant="outlined"
        autoComplete="new-password"
      />
        
      {
        showValidators &&
        <List dense>
          {
            Object.entries(Validations.password)
              .map(([key, regex], i) =>
                <ListItem key={i}>
                  <ListItemIcon>
                    {
                      regex.test(value) ? (
                        <CheckIcon style={{color: 'green'}} />
                      ) : (
                        <CloseIcon style={{color: 'red'}} />
                      )
                    }
                  </ListItemIcon>
                  <ListItemText primary={key} />
                </ListItem>    
              )
          }
        </List>
      }
      
    </>
  )
}

const CodeField = ({value, onValueChange, onValidChange, error, helperText, showValidators = false}) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(
      Object.entries(Validations.code).every(([key, regex]) =>
        regex.test(value)
      )
    );
  }, [value]);

  useEffect(() => {
    onValidChange(isValid);
  }, [isValid]);
  
  return (
    <>
      <TextField
        required
        InputLabelProps={{shrink: true}}
        type={'text'}
        onChange={({target: {value}}) => onValueChange(value)}
        label={'Code'}
        value={value}
        margin="normal"
        fullWidth
        error={!!error || (!isValid && !!value)}
        helperText={error || helperText || ""}
        variant="outlined"
      />
        
      {
        showValidators &&
        <List dense>
          {
            Object.entries(Validations.code)
              .map(([key, regex], i) =>
                <ListItem key={i}>
                  <ListItemIcon>
                    {
                      regex.test(value) ? (
                        <CheckIcon style={{color: 'green'}} />
                      ) : (
                        <CloseIcon style={{color: 'red'}} />
                      )
                    }
                  </ListItemIcon>
                  <ListItemText primary={key} />
                </ListItem>    
              )
          }
        </List>
      }
      
    </>
  )
}

const CustomField = ({customField, value, onValueChange, onValidChange, error, showValidators = false}) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    !!customField.required ? (
      setIsValid(
        !!value && 
        Object.entries(customField.validations || []).every(([key, regex]) =>
          regex.test(value)
        )
      ) 
    ) : (
      setIsValid(
        !value ||
        !(value||"").replace(/\D/g, "") ||
        Object.entries(customField.validations || []).every(([key, regex]) =>
          regex.test(value)
        )
      )
    )
  }, [value]);

  useEffect(() => {
    onValidChange(isValid);
  }, [isValid]);
  
  return (
    <>
      {
        customField.type === 'phone' ? (
          <PhoneField
            customField={customField}
            value={value}
            onValueChange={onValueChange}
            error={error}
            showValidators={showValidators}
            isValid={isValid}
          />
        ) : customField.type === 'date' ? (
          <DateField
            customField={customField}
            value={value}
            onValueChange={onValueChange}
            error={error}
            showValidators={showValidators}
            isValid={isValid}
          />
        ) : (
          <TextField
            InputLabelProps={{shrink: true, style: {visibility: customField.type === 'hidden' ? 'hidden' : 'visible'}}}
            required={!!customField.required}
            type={customField.type || 'text'}
            onChange={({target: {value}}) => onValueChange(value)}
            label={customField.label}
            value={value || customField.initialValue || ""}
            margin="normal"
            fullWidth
            error={!!error || (!isValid && !!value)}
            helperText={error || ""}
            select={!!customField.options}
            autoComplete="new-password"
            variant="outlined"
          >
            {
              (customField.options||[]).map(({label, value}) =>
                <MenuItem key={value} value={value}>{label}</MenuItem>
              )
            }
          </TextField>
        )
      }  
      {
        showValidators &&
        <List dense>
          {
            Object.entries(customField.validations || [])
              .map(([key, regex], i) =>
                <ListItem key={i}>
                  <ListItemIcon>
                    {
                      regex.test(value) ? (
                        <CheckIcon style={{color: 'green'}} />
                      ) : (
                        <CloseIcon style={{color: 'red'}} />
                      )
                    }
                  </ListItemIcon>
                  <ListItemText primary={key} />
                </ListItem>    
              )
          }
        </List>
      }
      
    </>
  )
}


export { PasswordField, UsernameField, CustomField, CodeField };