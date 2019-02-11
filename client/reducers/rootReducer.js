import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

// Import custom components
import uploadReducer from './uploadReducer';

const rootReducer = combineReducers({
    upload: uploadReducer,
    form: formReducer  // ← redux-form
});

export default rootReducer;
