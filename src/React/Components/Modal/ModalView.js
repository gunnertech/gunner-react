import React from 'react'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import withMobileDialog from '@material-ui/core/withMobileDialog';
import CloseIcon from '@material-ui/icons/Close';

import { IconButton } from '@material-ui/core';


///require("../../assets/css/logo-alt.png")



const Modal = ({
  classes,
  logoUrl,
  preTitle,
  title,
  subTitle,
  body,
  onClose,
  submitting = false,
  fullScreen,
  opened = false,
  saveButton = {
    text: "Save",
    onClick: console.log,
    ButtonProps: {}
  },
  secondaryButton = null,
}) =>
  <Dialog
    className={classes.modal}
    fullScreen={fullScreen}
    open={opened}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    {
      !!logoUrl &&
      <div className="logoWrapper">
        <img src={logoUrl} alt="logo" />
      </div>
    }
    <div className="closeWrapper">
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </div>
    {
      (!!title || !!subTitle) &&
      <DialogTitle disableTypography>
        {
          !!preTitle &&
          preTitle
        }
        {
          !!title && 
          <div className="titleWrapper">
            <Typography variant="h4">{title}</Typography>
          </div>
        }
        {
            !!subTitle && 
            <div className="subTitleWrapper">
              <Typography variant="caption" component="h4">{subTitle}</Typography>
            </div>
          }
      </DialogTitle>
    }
    <DialogContent>
      {
        typeof body === 'string' ? (
          <DialogContentText>
            {body}
          </DialogContentText>
        ) : (
          body
        )
      }
    </DialogContent>
    <DialogActions>
      {
        submitting ? (
          <div className="indicator">
            <CircularProgress className={classes.progress} color="secondary" />
          </div>
        ) : (
          <>
            {
              !!saveButton &&
              <Button 
                disabled={saveButton.disabled} 
                variant={(saveButton.ButtonProps||{}).variant || 'contained'}
                color={(saveButton.ButtonProps||{}).color || 'secondary'}
                size={(saveButton.ButtonProps||{}).size || 'large'}
                onClick={evt => [evt.stopPropagation(), evt.preventDefault(), saveButton.onClick()]}
                {...saveButton.ButtonProps||{}}
              >
                {saveButton.text}
              </Button>
            }
            {
              !!secondaryButton &&
              <Button 
                disabled={secondaryButton.disabled} 
                variant={(secondaryButton.ButtonProps||{}).variant || 'text'}
                color={(secondaryButton.ButtonProps||{}).color || 'default'}
                size={(secondaryButton.ButtonProps||{}).size || 'large'}
                onClick={evt => [evt.stopPropagation(), evt.preventDefault(), secondaryButton.onClick()]}
                {...secondaryButton.ButtonProps||{}}
              >
                {secondaryButton.text}
              </Button>
            }
          </>
        )
      }
    </DialogActions>
  </Dialog>

export default withMobileDialog()(Modal);