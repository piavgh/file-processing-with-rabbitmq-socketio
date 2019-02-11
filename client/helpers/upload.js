import axios from 'axios';
import io from 'socket.io-client';
import {BASE_URL, API_URL, SOCKET_END_POINT} from '../config/config';
import {
  serverNumberImageProcessing, 
  imageProcessing, 
  imageUrlReturned, 
  imgPreview, 
  message,
  imageUploading,
  imageProcessError
} from '../actions/uploadAction';


export function readFile(file, dispatch) {
  // this is to set preview image
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = (e) =>  {
      resolve(e.target.result);
    };
    reader.onerror = (error) =>  {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

export const uploadFileAndWaitReponse = async (file, dispatch) => {
    dispatch(imageUploading());
    let jobId = await uploadFile(file);
    dispatch(imageProcessing());
    let url = await registerSocketEvent(jobId, dispatch);
    return url;
}

export const uploadFile = async (file) => {
  const data = new FormData();
  data.append('image', file);
  data.append('fileName', file.name);
  try {
    let response = await axios.post(API_URL + 'image/upload', data);
    return response.data.data.jobId;
  } catch(e) {
    if(e.response.status == 413) {
      throw "Image size Too Large";
    } else {
      throw e.response.data.error;
    }
  }
}

export const getImageContent = async (url) => {
  let response = await axios.get(url, {responseType: 'blob'});
  return response.data;
}

function handleSocketConnect(
  socket, 
  jobId, 
  dispatchNumberImageProcessing, 
  resolveWithValue,
  rejectWithValue
) {
  let isClosed = false;
  socket.emit('receive_job_id', jobId);
  socket.on('image_job_finish', () => socket.emit('receive_job_id', jobId));
  socket.on('remaining_jobs', (remainingJobs) => {
    if(!isClosed) {
      dispatchNumberImageProcessing(remainingJobs); // include current job (so + 1)
    }
  });
  socket.on('image_processed', (path) => {
    isClosed = true;
    socket.close();
    resolveWithValue(path);
  });
  socket.on('job_retrying', () => dispatch(message('Retrying...')));
  socket.on('image_processed_error', (err) => {
    socket.close();
    rejectWithValue(err);
  });
}

export const registerSocketEvent = (jobId, dispatch) => {
  let socket = io(BASE_URL, {path: SOCKET_END_POINT});
  return new Promise((resolve, reject) => {
    socket.on('connect', () => handleSocketConnect(
      socket, 
      jobId, 
      dispatchNumberImageProcessing, 
      resolveWithValue(resolve),
      rejectWithValue(reject)
    ));
  });
}

function resolveWithValue(resolve) {
  return function(value) {
    resolve(value);
  }
}

function rejectWithValue(reject) {
  return function(value) {
    reject(value);
  }
}

function dispatchNumberImageProcessing(dispatch) {
  return function(remainingJobs) {
    dispatch(serverNumberImageProcessing(remainingJobs));
  }
}

export const convertBlobToFile = (blob, fileName) => {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  let blobType = blob.type;
  return new File([blob], fileName, {type: blobType});
}

export async function processImage(file, dispatch) {
  let url = await uploadFileAndWaitReponse(file, dispatch);
  dispatch(imageUrlReturned(url));  
}

export function checkAndDispatchError(err, dispatch) {
  if(typeof err === "object" && typeof err.message !== "undefined") {
    dispatch(imageProcessError(err.message));
  } else if(typeof err === "string") {
    dispatch(imageProcessError(err));
  } else {
    dispatch(imageProcessError("Unkown Error"));
  }
}