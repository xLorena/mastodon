import { connect } from 'react-redux';
import ColumnSettings from '../components/column_settings';
import { addToSettingNewsfeedCompare, changeSetting, removeFromSettingNewsfeedCompare } from '../../../actions/settings';
import { changeColumnParams } from '../../../actions/columns';

const mapStateToProps = (state, { columnId }) => {
  const uuid = columnId;
  const columns = state.getIn(['settings', 'columns']);
  const index = columns.findIndex(c => c.get('uuid') === uuid);

  return {
    settings: (uuid && index >= 0) ? columns.get(index).get('params') : state.getIn(['settings', 'community']),
    selectedNewsfeedCompare: state.getIn(['settings', 'newsfeedCompare']),
  };
};

const mapDispatchToProps = (dispatch, { columnId }) => {
  return {
    onChange (key, checked) {
      if (columnId) {
        dispatch(changeColumnParams(columnId, key, checked));
      } else {
        dispatch(changeSetting(['community', ...key], checked));
      }
    },
    onNewsfeedCompareChange (key, checked){
      console.log(key, checked);
      // if(!checked) dispatch(removeFromSettingNewsfeedCompare(key));
      // else dispatch(addToSettingNewsfeedCompare(key));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ColumnSettings);
