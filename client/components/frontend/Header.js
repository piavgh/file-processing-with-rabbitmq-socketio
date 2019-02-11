import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import { GridLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import * as constant from '../../constants/constant';
import {styles} from './css/Header';

class Header extends React.Component {
  
  componentWillReceiveProps(props) {
    let hasNotification = false;
    if(props.message != this.props.message && props.message) {
      toast.info(props.message);
      hasNotification = true;
    }
    
    if(props.error) {
      toast.error(props.error, {autoClose: 10000});
      hasNotification = true;
    }
    
    if(props.serverNumberImageProcessing) {
      let message = `There's ${props.serverNumberImageProcessing} number of images processing, 
        please wait about ${props.serverNumberImageProcessing * constant.TIME_PROCESS_IMAGE_AVERAGE} seconds.`;
      toast.info(message);
      hasNotification = true;
    }
    
    if(hasNotification) {
      this.props.notificationShowed();
    }
  }
  
  render() {
    const { classes } = this.props;
    
    return (
      <Grid item xs={12} lg={8} className={classes.root}>
        <div className={classes.headerTitle}>WEBSITE HEADLINE</div>
        <Grid item xs={12} lg={10} className={classes.headerDesc}>
          Saadaval on mitmeid erinevaid. Contrary to popular belief.<br/>
          Note: Image size should be {constant.MINIMUM_FILE_RESOLUTION} minimum 
          and {constant.MAXIMUM_FILE_RESOLUTION} maximum. Maximum file size is {constant.MAX_FILE_UPLOAD_SIZE}Mb
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(Header);