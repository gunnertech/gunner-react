import React from 'react'
import ReactDOMServer from 'react-dom/server';

import ReactGA from 'react-ga'

import ModalView from './ModalView';
import useStyles from "./ModalStyles"


///require("../../assets/css/logo-alt.png")



export default ({
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
}) => {
  const classes = useStyles();

  !!opened && (
    typeof title === 'string' ? (
      ReactGA.modalview(`/${(title??"").toString().toLowerCase().replace(/[^\-A-Za-z0-9]/g, '-')}`)
    ) : (
      ReactGA.modalview(`/${(ReactDOMServer.renderToString(title)??"").toString().toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\-A-Za-z0-9]/g, '-')}`)
    )
  )
    

  return (
    <ModalView 
      classes={classes}
      logoUrl={logoUrl}
      preTitle={preTitle}
      title={title}
      subTitle={subTitle}
      body={body}
      onClose={onClose}
      submitting={submitting}
      fullScreen={fullScreen}
      opened={opened}
      saveButton={saveButton}
      secondaryButton={secondaryButton}
    />
  )
}