// Import actionType constants
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
    SHOW_RESULT_PAGE
} from '../constants/actionType';
import axios from 'axios';
import {
  readFile, 
  uploadFileAndWaitReponse, 
  getImageContent, 
  convertBlobToFile, 
  processImage,
  checkAndDispatchError
} from '../helpers/upload';
import * as constant from '../constants/constant';

export function imageUrlReturned(url) {
  return {
      type: IMAGE_URL_RETURNED,
      payload: {url}
  }
}

export function showPreviewImage(file) {
  return async function (dispatch) {
    try {
      dispatch(resetFileChosen());
      if(file.size > constant.MAX_FILE_UPLOAD_SIZE * constant.MB_TO_BYTE) {
        throw new Error(`File size should not exceed ${constant.MAX_FILE_UPLOAD_SIZE}Mb`);
      }
      let inputImage = await readFile(file, dispatch);
      dispatch(imgPreview(inputImage));
      dispatch(fileChosen(file, inputImage));
      await processImage(file, dispatch);
    } catch(err) {
      console.log(err);
      checkAndDispatchError(err, dispatch);
    }
  }
}

export function downloadSampleImage(url, alt) {
  return async function (dispatch) {
    try {
      dispatch(message('Loading image...'));
      dispatch(resetFileChosen());
      let blob = await getImageContent(url);
      blob.name = alt;
//      let file = convertBlobToFile(blob, alt);
      let inputImage = await readFile(blob, dispatch);
      dispatch(imgPreview(inputImage));
      dispatch(fileChosen(blob, inputImage));
      await processImage(blob, dispatch);
    } catch(err) {
      checkAndDispatchError(err, dispatch);
    }
  }

}

export function imageProcessing() {
  return {
      type: IMAGE_PROCESSING
  }
}

export function imageProcessError(error) {
  return {
      type: IMAGE_PROCESS_ERROR,
      payload: {error}
  }
}

export function serverNumberImageProcessing(numberImageProcessing) {
  return {
      type: SERVER_NUMBER_IMAGE_PROCESSING,
      payload: {numberImageProcessing}
  }
}

export function imgPreview(data) {
  return {
      type: IMG_PREVIEW,
      payload: {data}
  }
}

export function message(message) {
  return {
      type: MESSAGE,
      payload: {message}
  }
}

export function notificationShowed() {
  return {
    type: NOTIFICATION_SHOWED
  }
}

export function fileChosen(file, inputImage) {
  return {
      type: FILE_CHOSEN,
      payload: {file, inputImage}
  }
}

export function showResultPage(showResultPage) {
  return {
    type: SHOW_RESULT_PAGE,
    payload: {showResultPage}
  }
}

export function imageUploading() {
  return {
    type: IMAGE_UPLOADING
  }
}

export function resetFileChosen() {
  return {
    type: RESET_FILE_CHOSEN
  }
}