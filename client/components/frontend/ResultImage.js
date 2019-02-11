import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {Redirect} from 'react-router'
import {styles} from './css/ResultImage';
import Status from './Status';
import Hidden from '@material-ui/core/Hidden';

class ResultImage extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {disableProcessButton:true, previewError:false};    
  }
  
  componentWillReceiveProps = (props) => {
    if(props.imageUrlReturned || props.error) {
      this.setState({disableProcessButton:false});
    } else {
      this.setState({disableProcessButton:true});
    }
  }
  
  processNewImage = () => {
    this.props.history.push('/');
  }
  
  previewError = () => {
    this.setState({previewError:true});
  }
  
  render() {
    const { classes } = this.props;
    
    if(!this.props.showResultPage) {
      return <Redirect to="/" />;
    }
    
    return (
      <div className={classes.root}>
        <Grid container>
          <Hidden smDown>
            <Grid item md={6} className={classes.imageSectionTitle}><p>Input Image</p></Grid>
            <Grid item md={6} className={classes.imageSectionTitle}><p>Output Image</p></Grid>
          </Hidden>
        </Grid>
        <Grid container className={classes.imageSection}>
          <Grid item xs={12} md={6} className={classes.image}>
            <Hidden mdUp><p className={classes.imageSectionTitle}>Input Image</p></Hidden>
            <div>
              {!this.state.previewError ? (
                <img src={this.props.inputImage} onError={this.previewError}/>
              ) : (
                <Status error="Sorry, we can't preview this image"/>
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={6} className={classes.image}>
            <Hidden mdUp><p className={classes.imageSectionTitle}>Output Image</p></Hidden>
            <div>
              {this.props.imageUrlReturned ? (
                <img src={this.props.imageUrlReturned}/>
              ) : (
                <Status serverNumberImageProcessing={this.props.serverNumberImageProcessing} 
                  message={this.props.message} error={this.props.error}/>
              )}

            </div>
          </Grid>
        </Grid>
        <Grid container>          
          <div className={classes.processButton}>
            <Button variant="contained" onClick={this.processNewImage} disabled={this.state.disableProcessButton}>
              Process A New Image
            </Button>
          </div>         
        </Grid>
      </div>
    );
  }
}
export default withStyles(styles)(ResultImage);