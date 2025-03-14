import { combineReducers } from 'redux';
import authReducer from './Authentication/reducer';
import CARTModalReducer from './cartMoodal/reducer';
import { fetchSettings, settingsReducer } from './Settings/reducer';
// Combine all reducers here
const rootReducer = combineReducers({

    auth:authReducer,

    cartModal:CARTModalReducer,

    settings:settingsReducer

});



export default rootReducer;
