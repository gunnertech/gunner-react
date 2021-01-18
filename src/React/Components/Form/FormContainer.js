import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import NumberFormat from 'react-number-format';
import MaskedInput from 'react-text-mask';
import { DateTimePicker } from '@material-ui/pickers';
 
import PhotoUpload from '../PhotoUpload'
import { Box } from '@material-ui/core';

const countCharacters = characters =>
  !characters ? (
    0
  ) : (
    characters.replace(/\D/g, "").length
  )

const PhoneFormatCustom = props => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={rawValue => !countCharacters(rawValue) ? (
        []
      ) : countCharacters(rawValue) <= 11 ? (
        ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
      ) : countCharacters(rawValue) === 12 ? (
        ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
      ) : (
        ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
      )
      }
      placeholderChar={'\u2000'}
      placeholder="(555) 555-5555"
      showMask
      guide
      autoComplete="new-password"
    />
  );
}

const NumberFormatCustom = ({ inputRef, onChange, ...other }) =>
  <NumberFormat
    {...other}
    fixedDecimalScale 
    decimalScale={2}
    getInputRef={inputRef}
    onValueChange={values => {
      onChange({
        target: {
          value: values.value,
        },
      });
    }}
    thousandSeparator
    prefix="$"
  />

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
  },
  root: {
    minWidth: "332px",
  },
  buttonsContainer: {
    marginTop: theme.spacing(4),
  }
}));

export default ({
  data = {},
  onChange = data => null,
  onSubmit = data => null,
  buttonLabel = "Submit",
  fields = {},
  submitting = false,
  primaryButtonProps = {},
  errorMessage,
  onValidChange = () => null,
  excludeButton = false,
  extraIsValid = true,
  NestedForm = null,
  isNested = false,
}) => {
  const classes = useStyles();
  const [isValid, setIsValid] = useState(false);
  const [dirties, setDirties] = useState([]);
  
  const handleChange = (field, {target: {value, checked}}, obj) => [
    obj?.type === "percentage" ? onChange(field, value / 100.0) : onChange(field, value),
    setDirties([
      ...dirties,
      field
    ])
  ]


  useEffect(() => {
    // console.log("Let's see", !!extraIsValid, Object.entries(fields).every(([key, value]) => 
    // !!value.customValidator ? (
    //    !!value.customValidator(data[key])
    // ) : !!value.required ? (
    //   !!data[key] && value.regex.test(data[key]) 
    // ) : (
    //   !data[key] ? true : value.regex.test(data[key]))
    // ))
    setIsValid(
      !!extraIsValid &&
      Object.entries(fields).every(([key, value]) => 
        !!value.customValidator ? (
           !!value.customValidator(data[key])
        ) : !!value.required ? (
          !!data[key] && value.regex.test(data[key]) 
        ) : (
          !data[key] ? true : value.regex.test(data[key]))
        )
    )
  }, [Object.values(data).join(""), Object.values(fields).length, extraIsValid])

  useEffect(() => {
    onValidChange(isValid);
  }, [isValid])


  return (
    <Box component={!!isNested ? 'div' : "form"} className={classes.container} noValidate autoComplete="off">
      {
        Object.entries(fields).map(([key, value], i) =>
          console.log(value.overrides) ||
          <Box key={i} hidden={value.type === 'hidden'}>
            {
              value.type === 'datetime' ? (
                <DateTimePicker 
                  disabled={value.disabled}
                  clearable
                  disablePast
                  className="formControl"
                  fullWidth
                  label={value.label}
                  onChange={value => handleChange(key, {target: {value: value.toDate()}})}
                  value={!!value.value ? value.value(data[key] || "") : (data[key] === null || data[key] === undefined ? "" : data[key])}
                  InputLabelProps={{
                    shrink: true
                  }}
                  variant="dialog"
                  inputVariant="outlined"
                  helperText={
                    (!data[key] && !value.required ? (
                      false
                    ) : !dirties.includes(key) ? (
                      false
                    ) : !!value.customValidator ? (
                      !value.customValidator(data[key])
                    ) : (
                      !fields[key].regex.test(data[key])
                    )) ? (value.errorMessage || "") : (value.helperText || "")
                  }
                />
              ) : value.type === 'media' ? (
                <FormControl key={i} fullWidth>
                  <PhotoUpload 
                    onUpload={photoUrl => handleChange(key, {target: {value: photoUrl}})}
                    photoUrl={!!value.value ? value.value(data[key] || "") : (data[key] || "")}
                    buttonText={value.label}
                  />
                  <FormHelperText component={'div'}>{dirties.includes(key) && !fields[key].regex.test(data[key]) ? (value.errorMessage || "") : (value.helperText || "")}</FormHelperText>
                </FormControl>
              ) : value.type === 'checkbox' ? (
                <FormControl variant="outlined" key={i} fullWidth>
                  <InputLabel variant="outlined" htmlFor="my-input">{value.label}</InputLabel>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={!!value.value ? !!value.value(data[key] || "") : !!(data[key] === null || data[key] === undefined ? "" : data[key])}
                        onChange={(({target: {checked, value}}) => handleChange(key, {target: {value: (checked ? value : null)}}))}
                        value={(new Date()).toISOString()} 
                      />
                    }
                    label={<Typography variant={`caption`}>{value.checkboxLabel}</Typography>}
                  />
                  <FormHelperText component={'div'}>{dirties.includes(key) && !fields[key].regex.test(data[key]) ? (value.errorMessage || "") : (value.helperText || "")}</FormHelperText>
                </FormControl>
              ) : (
                <TextField
                  autoComplete={value.type === 'password' ? "new-password" : "true"}
                  variant="outlined"
                  autoFocus={!!value.autoFocus}
                  multiline={!!fields[key].rows}
                  rows={fields[key].rows}
                  key={i}
                  error={
                    !data[key] && !value.required ? (
                      false
                    ) : !dirties.includes(key) ? (
                      false
                    ) : !!value.customValidator ? (
                      !value.customValidator(data[key])
                    ) : (
                      !fields[key].regex.test(data[key])
                    )
                  }
                  required={value.required}
                  disabled={value.disabled}
                  helperText={
                    (!data[key] && !value.required ? (
                      false
                    ) : !dirties.includes(key) ? (
                      false
                    ) : !!value.customValidator ? (
                      !value.customValidator(data[key])
                    ) : (
                      !fields[key].regex.test(data[key])
                    )) ? (value.errorMessage || "") : (value.helperText || "")
                  }
                  onChange={evt => handleChange(key, evt, value)}
                  label={value.label}
                  value={!!value.value ? value.value(data[key] || "") : (data[key] === null || data[key] === undefined ? "" : data[key])}
                  placeholder={value.placeholder || ""}
                  type={value.type === "money" ? 'text' : (value.type || "text")}
                  margin="normal"
                  fullWidth
                  select={!!value.options}
                  InputLabelProps={{
                    shrink: true
                  }}
                  InputProps={value.type === 'money' ? (
                    {
                      inputComponent: NumberFormatCustom,
                    }
                  ) : value.type === 'percentage' ? (
                    {
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }
                  ) : value.type === 'phone' ? (
                    {
                      inputComponent: PhoneFormatCustom,
                    }
                  ) : (
                    {
                      
                    }
                  )
                  } 
                  {...(value.overrides ?? {})}
                >
                  {
                    (value.options||[]).map((option, i) => 
                      <MenuItem key={i} value={option.value}>{option.label}</MenuItem>
                    )
                  }
                </TextField>
              )
            }
          </Box>
        )
      }
      {
        !!NestedForm && NestedForm
      }
      {
        !excludeButton &&
        <Box mt={4}>
          <Button 
            disabled={!isValid || !!submitting || !!errorMessage} 
            onClick={onSubmit} 
            variant="contained" 
            color="secondary"
            {...primaryButtonProps}
          >
            {buttonLabel}
          </Button>
          {
            !!errorMessage &&
            <Typography color="error">{errorMessage}</Typography>
          }
        </Box>
      }
    </Box>
  )
}