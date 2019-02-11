// Import custom components
import {
  IMAGE_URL_RETURNED, 
  IMAGE_PROCESSING, 
  IMAGE_PROCESS_ERROR,
  SERVER_NUMBER_IMAGE_PROCESSING,
  IMG_PREVIEW,
  MESSAGE,
  NOTIFICATION_SHOWED,
  FILE_CHOSEN,
  IMAGE_UPLOADING,
  RESET_FILE_CHOSEN,
  SHOW_RESULT_PAGE,
  REDUX_LOCATION_CHANGE
} from '../constants/actionType';

const initialState = {
  processing: false,
  error: false,
  serverNumberImageProcessing: false,
  message: false,
  showResultPage: false,
  imageUrlReturned: false, 
  file:false,
  inputImage:false,
  imgPreview:false,
  uploading:false
};

/**
 * A reducer takes two arguments, the current state and an action.
 */
export default (state, action) => {
    state = state || initialState;

    switch (action.type) {
        case IMAGE_PROCESSING:
          return {...state, processing: true, error: false, showResultPage:true, uploading:false};
        case IMAGE_PROCESS_ERROR:
          return {...state, processing: false, error: action.payload.error, uploading:false};
        case IMAGE_URL_RETURNED:
          return {...state, imageUrlReturned: action.payload.url, processing: false, error:false};
        case SERVER_NUMBER_IMAGE_PROCESSING:
          return {...state, serverNumberImageProcessing: action.payload.numberImageProcessing};
        case IMG_PREVIEW:
          return {...state, imgPreview: action.payload.data};
        case MESSAGE:
          return {...state, message: action.payload.message};
        case NOTIFICATION_SHOWED:
          return {...state, error:false, serverNumberImageProcessing: false, message: false};
        case FILE_CHOSEN:
          return {...state, file: action.payload.file, inputImage: action.payload.inputImage};
        case RESET_FILE_CHOSEN:
          return {...state, file: false, inputImage: false};
        case SHOW_RESULT_PAGE:
          if(action.payload.showResultPage) {
            return {...state, showResultPage: true};
          } else {
            return {...state, ...initialState};
          }
        case IMAGE_UPLOADING:
          return {...state, uploading: true};
        case REDUX_LOCATION_CHANGE:
          if(action.payload.pathname == "/") {
            return {...state, ...initialState};
          } else {
            return state;
          }
        default:
            return state;
    }
}
