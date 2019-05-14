// react library imports
import { combineReducers } from 'redux';
import authReducer from './Auth.reducer';

const rootReducer = combineReducers({
  //entryPointForGulpStart
  //entryPointForGulpEnd
  authReducer
});

export default rootReducer;