import { getRequest } from "../../services/apis/requests";

// Action Types
const FETCH_SETTINGS_REQUEST = "FETCH_SETTINGS_REQUEST";
const FETCH_SETTINGS_SUCCESS = "FETCH_SETTINGS_SUCCESS";
const FETCH_SETTINGS_FAILURE = "FETCH_SETTINGS_FAILURE";




// Action Creators
export const fetchSettingsRequest = () => ({ type: FETCH_SETTINGS_REQUEST });
export const fetchSettingsSuccess = (settings) => ({
  type: FETCH_SETTINGS_SUCCESS,
  payload: settings,
});
export const fetchSettingsFailure = (error) => ({
  type: FETCH_SETTINGS_FAILURE,
  payload: error,
});

// ✅ Thunk to Fetch API Automatically
export const fetchSettings = () => {
  return async (dispatch) => {
    dispatch(fetchSettingsRequest());
    try {
      const response = await getRequest('settings/');
      const { lastUpdated } = response.data;
      dispatch(fetchSettingsSuccess({ lastUpdated }));
    } catch (error) {
      dispatch(fetchSettingsFailure(error.message));
    }
  };
};


const initialState = {
  lastUpdated:null
};

// Reducer
export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SETTINGS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        lastUpdated: action.payload.lastUpdated,
      };
    case FETCH_SETTINGS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
