import Header from '../../components/frontend/Header';
import {connect} from 'react-redux';
import {notificationShowed} from '../../actions/uploadAction';


/**
 * Map the state to props.
 */
const mapStateToProps = state => ({
  processing: state.upload.processing,
  error: state.upload.error,
  serverNumberImageProcessing: state.upload.serverNumberImageProcessing,
  message: state.upload.message
});

/**
 * Map the actions to props.
 */
const mapDispatchToProps = (dispatch, ownProps) => ({
  notificationShowed: () => {
    dispatch(notificationShowed());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);