import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  modal: {
    '& .indicator': {
      paddingTop: theme.spacing(1), 
      paddingBottom: theme.spacing(1), 
      display: 'flex', 
      flex: 1, 
      justifyContent: "center"
    },
    '& .logoWrapper': {
      textAlign: 'center',
      padding: theme.spacing(2, 6),
      marginBottom: theme.spacing(-7),
      '& img': {
        maxWidth: '100%',
        height: 'auto'
      },
      '&:after': {
        content: '""',
        height: 2,
        display: 'block',
        backgroundColor: theme.palette.background.default,
        margin: theme.spacing(3, -6)
      }
    },
    '& .closeWrapper': {
      position: "absolute",
      right: 0
    },
    '& .titleWrapper': {
      margin: theme.spacing(0, -3, 0, -3),
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
      '& .alt': {
        color: theme.palette.secondary.main
      }
    }
  }
}));