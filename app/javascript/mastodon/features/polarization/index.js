import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
//import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import {
  expandCommunityTimeline,
  expandDiverseSortedTimeline,
} from '../../actions/timelines';
import { addColumn, removeColumn, moveColumn } from '../../actions/columns';
//import ColumnSettingsContainer from './containers/column_settings_container';
import { connectCommunityStream } from '../../actions/streaming';
import { fetchFavouritedStatuses } from '../../actions/favourites';
import BubbleList from './bubble-list';

const messages = defineMessages({
  title: { id: 'column.community', defaultMessage: 'Local timeline' },
});

const mapStateToProps = (state, { columnId }) => {
  const uuid = columnId;
  const columns = state.getIn(['settings', 'columns']);
  const index = columns.findIndex((c) => c.get('uuid') === uuid);
  const onlyMedia =
    columnId && index >= 0
      ? columns.get(index).getIn(['params', 'other', 'onlyMedia'])
      : state.getIn(['settings', 'community', 'other', 'onlyMedia']);
  const timelineState = state.getIn([
    'timelines',
    `community${onlyMedia ? ':media' : ''}`,
  ]);
  const statuses = state.get('statuses');
  const favorites = state.getIn(['status_lists', 'favourites', 'items']);

  return {
    hasUnread: !!timelineState && timelineState.get('unread') > 0,
    onlyMedia,
    statuses,
    favorites,
  };
};

export default
@connect(mapStateToProps)
@injectIntl
class Polarization extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static defaultProps = {
    onlyMedia: false,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    columnId: PropTypes.string,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    multiColumn: PropTypes.bool,
    onlyMedia: PropTypes.bool,
    statuses: PropTypes.object,
    favorites: PropTypes.object,
  };

  UNSAFE_componentWillMount() {
    this.props.dispatch(fetchFavouritedStatuses());
  }

  handlePin = () => {
    const { columnId, dispatch, onlyMedia } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('COMMUNITY', { other: { onlyMedia } }));
    }
  };

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  };

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  componentDidMount() {
    const { dispatch, onlyMedia } = this.props;

    dispatch(expandCommunityTimeline({ onlyMedia }));
    dispatch(expandDiverseSortedTimeline({ onlyMedia }));
    this.disconnect = dispatch(connectCommunityStream({ onlyMedia }));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.onlyMedia !== this.props.onlyMedia) {
      const { dispatch, onlyMedia } = this.props;

      this.disconnect();
      dispatch(expandCommunityTimeline({ onlyMedia }));
      dispatch(expandDiverseSortedTimeline({ onlyMedia }));
      this.disconnect = dispatch(connectCommunityStream({ onlyMedia }));
    }
  }

  componentWillUnmount() {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  setRef = (c) => {
    this.column = c;
  };

  handleLoadMore = (maxId) => {
    const { dispatch, onlyMedia } = this.props;

    dispatch(expandCommunityTimeline({ maxId, onlyMedia }));
    dispatch(expandDiverseSortedTimeline({ maxId, onlyMedia }));
  };

  render() {
    const {
      intl,
      columnId,
      multiColumn,
    } = this.props;
    const pinned = !!columnId;

    return (
      <Column
        bindToDocument={!multiColumn}
        ref={this.setRef}
        label={intl.formatMessage(messages.title)}
      >
        <ColumnHeader
          icon='star'
          title={'Filterblase erkunden'}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
          showBackButton
        />
        <div className='polarization'>
          <BubbleList />
        </div>
      </Column>
    );
  }

}
