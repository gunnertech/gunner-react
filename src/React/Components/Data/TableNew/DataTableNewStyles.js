import { makeStyles } from "@material-ui/core";

export default makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    // minWidth: 650,
  },
  tableCellNoWrap: {
    whiteSpace: 'nowrap',
  },
}));