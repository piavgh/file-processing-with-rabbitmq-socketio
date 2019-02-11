import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {styles} from './css/Logo';

class Logo extends React.Component {

  render() {
    const { classes } = this.props;
    
    return (
      <Grid item xs={12} className={classes.logo}>
        METRON<b>MIND</b>
      </Grid>
    );
  }
}
export default withStyles(styles)(Logo);