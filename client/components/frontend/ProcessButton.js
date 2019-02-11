import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {styles} from './css/ProcessButton';

class ProcessButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {disabled:true};    
  }
  
  processImage = () => {
    this.props.processImage(this.props.file);
  }
  
  componentWillReceiveProps = (props) => {
    if(props.showResultPage) {
      props.history.push('/result');
    }
    
    if(props.file && !props.uploading && !props.error) {    
      this.setState({disabled:false});
    } else {
      this.setState({disabled:true});
    }
  }
  
  render() {
    const { classes } = this.props;
    return (    
      <div></div>
    );
  }
}
export default withStyles(styles)(ProcessButton);