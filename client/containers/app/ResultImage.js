import ResultImage from '../../components/frontend/ResultImage';
import {connect} from 'react-redux';
import {showResultPage} from '../../actions/uploadAction';
import { withRouter } from "react-router";


/**
 * Map the state to props.
 */
const mapStateToProps = state => ({
  imageUrlReturned: state.upload.imageUrlReturned,
  message: state.upload.message,
  error: state.upload.error,
  showResultPage: state.upload.showResultPage,
  inputImage: state.upload.inputImage,
  serverNumberImageProcessing: state.upload.serverNumberImageProcessing
});

/**
 * Map the actions to props.
 */
const mapDispatchToProps = (dispatch, ownProps) => ({
  goToFirstPage: () => {  
    dispatch(showResultPage(false));
  }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResultImage));