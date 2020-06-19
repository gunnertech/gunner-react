import React from "react";
import { useLocation } from 'react-router-dom'

import useStyles from "./LayoutStyles";
import LayoutView from "./LayoutView"


export default ({
  children, 
  showNav, 
  MainNavigation,
  Helmet,
  fixed,
  maxWidth,
  style
}) => {
  const classes = useStyles();
  const location = useLocation();
  return (
    <LayoutView 
      MainNavigation={MainNavigation} 
      showNav={showNav} 
      classes={classes} 
      location={location}
      Helmet={Helmet}
      fixed={fixed}
      style={style}
      maxWidth={maxWidth}
    >
      {children}
    </LayoutView>
  )
}