import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from './rootReducer';
import { fetchSettings } from './Settings/reducer';

const Store = createStore(rootReducer, applyMiddleware(thunk));

Store.dispatch(fetchSettings());

export default Store;