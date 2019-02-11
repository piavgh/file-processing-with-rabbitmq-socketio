import Upload from '../../components/frontend/Upload';
import {connect} from 'react-redux';
import {showPreviewImage} from '../../actions/uploadAction';

/**
 * Map the state to props.
 */
const mapStateToProps = state => ({
  imageUrl: state.upload.imageUrlReturned,
  imgPreview: state.upload.imgPreview
});

/**
 * Map the actions to props.
 */
const mapDispatchToProps = (dispatch, ownProps) => ({
  processFileUpload:  (file) => {
    dispatch(showPreviewImage(file));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);