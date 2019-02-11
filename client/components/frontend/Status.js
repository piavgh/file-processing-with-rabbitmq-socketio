import React from 'react';
import * as constant from '../../constants/constant';
import { withStyles } from '@material-ui/core/styles';
import {styles} from './css/Status';

class Status extends React.Component {
  
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.text}>
        {this.props.serverNumberImageProcessing && 
          <div className={classes.messageInfo}>
            There's {this.props.serverNumberImageProcessing} number of images processing, 
            please wait about {this.props.serverNumberImageProcessing * constant.TIME_PROCESS_IMAGE_AVERAGE} seconds.
          </div>
        }
        {this.props.message && 
          <div className={classes.messageInfo}>{this.props.message}</div>
        }
        {this.props.error && 
          <div className={classes.messageError}>{this.props.error}</div>
        }
        {!this.props.serverNumberImageProcessing && !this.props.message && !this.props.error &&
          <div className={classes.messageInfo}>Our server is busy...<br/>Please wait...</div>
        }
      </div>
    );
  }
}
export default withStyles(styles)(Status);