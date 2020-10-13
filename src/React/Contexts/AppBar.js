import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const classes = makeStyles(theme => ({
  logo: {
    height: '50px',
    width: 'auto',
    marginTop: `${theme.spacing(0.5)}px`,
    marginLeft: `${theme.spacing(1)}px`
  }
}))

const AppBar = React.createContext({
  title: "",
  setTitle: () => null,
  onClickHelp: null,
  setOnClickHelp: () => null,
});

const AppBarProvider = ({children}) => {
  const [title, setTitle] = useState("");
  const [backButtonVisible, setBackButtonVisible] = useState(false);
  const [onClickHelp, setOnClickHelp] = useState(null);
  const [rightButtons, setRightButtons] = useState([])
  const reset = () => [
    setTitle(""),
    setOnClickHelp(null),
    setRightButtons([])
  ]


  return (
    <AppBar.Provider
      value={{
        title,
        setTitle,
        onClickHelp,
        setOnClickHelp,
        rightButtons,
        setRightButtons,
        reset,
        backButtonVisible,
        setBackButtonVisible
      }}
    >
      {children}
    </AppBar.Provider>
  );
}

const AppBarConsumer = AppBar.Consumer;

export { AppBarProvider, AppBarConsumer, AppBar as AppBarContext };