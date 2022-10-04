import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import { expandCommunityTimeline, expandDiverseSortedTimeline } from '../../actions/timelines';
import { addColumn, removeColumn, moveColumn } from '../../actions/columns';
import ColumnSettingsContainer from './containers/column_settings_container';
import { connectCommunityStream } from '../../actions/streaming';

const messages = defineMessages({
  title: { id: 'column.community', defaultMessage: 'Home timeline' },
});

const mapStateToProps = (state, { columnId }) => {
  const uuid = columnId;
  const columns = state.getIn(['settings', 'columns']);
  const selectedAlgorithm = state.getIn(['settings', 'algorithm']);
  const index = columns.findIndex(c => c.get('uuid') === uuid);
  const onlyMedia = (columnId && index >= 0) ? columns.get(index).getIn(['params', 'other', 'onlyMedia']) : state.getIn(['settings', 'community', 'other', 'onlyMedia']);
  const timelineState = state.getIn(['timelines', `community${onlyMedia ? ':media' : ''}`]);

  return {
    hasUnread: !!timelineState && timelineState.get('unread') > 0,
    onlyMedia,
    selectedAlgorithm,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class CommunityTimeline extends React.PureComponent {

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
    selectedAlgorithm: PropTypes.string,
  };

  handlePin = () => {
    const { columnId, dispatch, onlyMedia } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('COMMUNITY', { other: { onlyMedia } }));
    }
  }

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  }

  componentDidMount () {
    const { dispatch, onlyMedia } = this.props;

    dispatch(expandCommunityTimeline({ onlyMedia }));
    dispatch(expandDiverseSortedTimeline({ onlyMedia }));
    this.disconnect = dispatch(connectCommunityStream({ onlyMedia }));
  }

  componentDidUpdate (prevProps) {
    if (prevProps.onlyMedia !== this.props.onlyMedia) {
      const { dispatch, onlyMedia } = this.props;

      this.disconnect();
      dispatch(expandCommunityTimeline({ onlyMedia }));
      dispatch(expandDiverseSortedTimeline({ onlyMedia }));
      this.disconnect = dispatch(connectCommunityStream({ onlyMedia }));
    }
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  setRef = c => {
    this.column = c;
  }

  handleLoadMore = maxId => {
    const { dispatch, onlyMedia } = this.props;

    dispatch(expandCommunityTimeline({ maxId, onlyMedia }));
    dispatch(expandDiverseSortedTimeline({ maxId, onlyMedia }));
  }

  render () {
    const { intl, hasUnread, columnId, multiColumn, onlyMedia, selectedAlgorithm } = this.props;
    const pinned = !!columnId;

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='home'
          active={hasUnread}
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
        >
          <ColumnSettingsContainer columnId={columnId} />
        </ColumnHeader>
        { selectedAlgorithm === 'user' ?
          <StatusListContainer
            trackScroll={!pinned}
            scrollKey={`community_timeline-${columnId}`}
            timelineId={'community'}
            timelineMode={'personalized'}
            onLoadMore={this.handleLoadMore}
            emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The timeline is empty. Write something publicly to get the ball rolling!' />}
            bindToDocument={!multiColumn}
          /> : selectedAlgorithm === 'diversity' ?
            <StatusListContainer
              trackScroll={!pinned}
              scrollKey={`community_timeline-${columnId}`}
              timelineId={'diverse'}
              onLoadMore={this.handleLoadMore}
              emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The timeline is empty. Write something publicly to get the ball rolling!' />}
              bindToDocument={!multiColumn}
            /> : selectedAlgorithm ==='newness' ?
              <StatusListContainer
                timelineId={'community'}
                onLoadMore={this.handleLoadMore}
                trackScroll={!pinned}
                scrollKey={'community_timeline-3'}
                emptyMessage={<FormattedMessage id='empty_column.public' defaultMessage='There is nothing here! Write something publicly, or manually follow users from other servers to fill it up' />}
                bindToDocument={!multiColumn}
              /> :    <StatusListContainer
                trackScroll={!pinned}
                scrollKey={`community_timeline-${columnId}`}
                timelineId={`community${onlyMedia ? ':media' : ''}`}
                onLoadMore={this.handleLoadMore}
                emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The timeline is empty. Write something publicly to get the ball rolling!' />}
                bindToDocument={!multiColumn}
              />
        }
      </Column>
    );
  }

}
