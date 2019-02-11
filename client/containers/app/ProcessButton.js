import ProcessButton from '../../components/frontend/ProcessButton';
import {connect} from 'react-redux';
import { withRouter } from "react-router";


/**
 * Map the state to props.
 */
const mapStateToProps = state => ({
  file: state.upload.file,
  showResultPage: state.upload.showResultPage,
  uploading: state.upload.uploading,
  error: state.upload.error
});


export default withRouter(connect(mapStateToProps, null)(ProcessButton));