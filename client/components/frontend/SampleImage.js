import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Slider from "react-slick";
import * as constant from '../../constants/constant';
import {getImageContent} from '../../helpers/upload';
import {styles} from './css/SampleImage';
import { BASE_URL } from '../../config/config';

class SampleImage extends React.Component {
  constructor(props) {
    super(props);
    this.sliderSettings = {
      dots: true,
      infinite: true,
      speed: 300,
      centerMode: true,
      variableWidth: true
    };
  }
  
  chooseSampleImage = (e) => {
    this.props.chooseSampleImage(e.target.src, e.target.alt);
  }
  
  render() {
    const { classes } = this.props;
    const list = constant.SAMPLE_IMAGES.map((image, index) => {
      return (
        <div key={index}>
          <img src={`${BASE_URL}/sample/${image}`} className={classes.sampleImage} onClick={this.chooseSampleImage}
            alt={image} />
        </div>
      )
    });
    return (
      <Grid className={classes.root} item xs={12} lg={8}>
        <div className={classes.text}>Or select one of the images below</div>
        <div className={classes.slider}>
          <Slider {...this.sliderSettings}>
            {list}
          </Slider>
        </div>
      </Grid>
    );
  }
}
export default withStyles(styles)(SampleImage);