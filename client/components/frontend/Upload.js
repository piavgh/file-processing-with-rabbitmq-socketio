import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import * as constant from '../../constants/constant';
import {uploadFile} from '../../helpers/upload';
import Dropzone from 'react-dropzone';
import {styles} from './css/Upload';

import { BASE_URL } from '../../config/config';

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {imgPreview:`${BASE_URL}/img/file.png`, previewError:false};    
  }
  
  componentWillReceiveProps = (props) => {
    if(props.imgPreview !== this.state.imgPreview) {
      this.setState({imgPreview: props.imgPreview, previewError:false});
    }
  }
  
  onDrop = (acceptedFiles) => {
    if(acceptedFiles.length) {
      this.props.processFileUpload(acceptedFiles[0]);
    }
  }
  
  previewError = () => {
    this.setState({previewError:true});
  }
  
  render() {
    const { classes } = this.props;
    return (
      <Grid className={classes.root} item xs={12} lg={8}>
        <Grid container>
          <Grid item xs={6} sm={4} md={3}>
            <Dropzone onDrop={this.onDrop} className={classes.dropZone} multiple={false}>
              <div className={classes.uploadText}>Dropping file here, or click to upload image button to upload</div>
              <img src={`${BASE_URL}/img/upload.png`} className={classes.uploadIcon} />
              <Button variant="contained" size="large" className={classes.button}>
                Upload Your Image
              </Button>
            </Dropzone>
          </Grid>
          <Grid item xs={6} sm={8} md={9}>
            <Grid container className={classes.uploadImageDivContainer}>
              {
                this.state.previewError ?
                  (<div className={classes.previewImageError}>
                    <p>
                      Sorry, we can't preview this image, please click process image button at the end of page to continue
                    </p>
                  </div>) :
                  <div className={classes.uploadImageDiv}>
                    {this.state.imgPreview == `${BASE_URL}/img/file.png` ?
                      <img src={this.state.imgPreview} className={classes.previewImagePlaceHolder}/>:
                      <img src={this.state.imgPreview} className={classes.previewImage} onError={this.previewError}/>
                    }
                  </div>
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(Upload);