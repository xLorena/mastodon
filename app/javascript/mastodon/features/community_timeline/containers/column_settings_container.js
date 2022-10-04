import { connect } from 'react-redux';
import ColumnSettings from '../components/column_settings';
import { changeSetting } from '../../../actions/settings';
import { changeColumnParams } from '../../../actions/columns';
import { openModal } from 'mastodon/actions/modal';

const mapStateToProps = (state, { columnId }) => {
  const uuid = columnId;
  const columns = state.getIn(['settings', 'columns']);
  const index = columns.findIndex(c => c.get('uuid') === uuid);

  return {
    settings: (uuid && index >= 0) ? columns.get(index).get('params') : state.getIn(['settings', 'community']),
    selectedAlgorithm: state.getIn(['settings', 'algorithm']),
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
    onAlgorithmChange(value) {
      dispatch(changeSetting(['algorithm'], value));
    },
    onItemClick () {
      dispatch(openModal('CONFIRM', {
        message: 'Benutzerdefinierte Personalisierung',
        showBubbleComponent: true,
        confirm: 'Speichern',
        onConfirm: () => console.log('hallo'),
      }));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ColumnSettings);
