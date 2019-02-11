import SampleImage from '../../components/frontend/SampleImage';
import {connect} from 'react-redux';
import {downloadSampleImage} from '../../actions/uploadAction';

/**
 * Map the actions to props.
 */
const mapDispatchToProps = (dispatch, ownProps) => ({
  chooseSampleImage: (url, alt) => {  
    dispatch(downloadSampleImage(url, alt));
  }
});

export default connect(null, mapDispatchToProps)(SampleImage);