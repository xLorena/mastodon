import api from '../api';
import { debounce } from 'lodash';
import { showAlertForError } from './alerts';

export const SETTING_CHANGE = 'SETTING_CHANGE';
export const SETTING_SAVE   = 'SETTING_SAVE';
export const SETTING_BUBBLE_LIST_ADD = 'SETTING_BUBBLE_LIST_ADD';
export const SETTING_BUBBLE_LIST_REMOVE = 'SETTING_BUBBLE_LIST_REMOVE';
export const SETTING_NEWSFEED_COMPARE_ADD = 'SETTING_NEWSFEED_COMPARE_ADD';
export const SETTING_NEWSFEED_COMPARE_REMOVE = 'SETTING_NEWSFEED_COMPARE_REMOVE';

export function changeSetting(path, value) {
  return dispatch => {
    dispatch({
      type: SETTING_CHANGE,
      path,
      value,
    });

    dispatch(saveSettings());
  };
};

export function addToSettingBubbleList(path, value){
  return dispatch => {
    dispatch({
      type: SETTING_BUBBLE_LIST_ADD,
      path,
      value,
    });

    dispatch(saveSettings());
  };
}

export function removeFromSettingBubbleList(path, value){
  return dispatch => {
    dispatch({
      type: SETTING_BUBBLE_LIST_REMOVE,
      path,
      value,
    });

    dispatch(saveSettings());
  };
}

export function addToSettingNewsfeedCompare(value){
  return dispatch => {
    dispatch({
      type: SETTING_NEWSFEED_COMPARE_ADD,
      value,
    });

    dispatch(saveSettings());
  };
}

export function removeFromSettingNewsfeedCompare(value){
  return dispatch => {
    dispatch({
      type: SETTING_NEWSFEED_COMPARE_REMOVE,
      value,
    });

    dispatch(saveSettings());
  };
}

const debouncedSave = debounce((dispatch, getState) => {
  if (getState().getIn(['settings', 'saved'])) {
    return;
  }

  const data = getState().get('settings').filter((_, path) => path !== 'saved').toJS();

  api().put('/api/web/settings', { data })
    .then(() => dispatch({ type: SETTING_SAVE }))
    .catch(error => dispatch(showAlertForError(error)));
}, 5000, { trailing: true });

export function saveSettings() {
  return (dispatch, getState) => debouncedSave(dispatch, getState);
};
