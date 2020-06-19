import React from "react";
import { Helmet } from "react-helmet";
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

// import MainNavigation from '../MainNavigation';


export default ({
  data, 
  children, 
  showNav, 
  MainNavigation,
  Helmet,
  fixed,
  maxWidth,
  style={paddingLeft: 0, paddingRight: 0}
}) =>
  <>
    <CssBaseline />
    {
      !!Helmet && <Helmet />
    }
    <Container style={style} fixed={!!fixed} maxWidth={!!maxWidth}>
      {
        !showNav || !MainNavigation ? (
          <>
            {children}
          </>
        ) : (
          <MainNavigation data={ data }>
            {children}
          </MainNavigation>
        )
      }
    </Container>
  </>