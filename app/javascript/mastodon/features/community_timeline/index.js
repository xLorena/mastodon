import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import { expandCommunityTimeline, expandDiverseSortedTimeline, expandPersonalizedTimeline, expandNewnessTimeline } from '../../actions/timelines';
import { addColumn, removeColumn, moveColumn } from '../../actions/columns';
import ColumnSettingsContainer from './containers/column_settings_container';
import { connectCommunityStream } from '../../actions/streaming';
import { fetchFavouritedStatuses } from '../../actions/favourites';

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
  const favourites = state.getIn(['status_lists', 'favourites', 'items']);
  const insideBubble = state.getIn(['settings', 'personalization', 'insideBubble']);
  const outsideBubble = state.getIn(['settings', 'personalization', 'outsideBubble']);
  const statuses = state.get('statuses');


  return {
    hasUnread: !!timelineState && timelineState.get('unread') > 0,
    onlyMedia,
    selectedAlgorithm,
    favourites,
    insideBubble,
    outsideBubble,
    statuses,
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
    statuses: PropTypes.object,
    favourites: PropTypes.object,
    insideBubble: PropTypes.object,
    outsideBubble: PropTypes.object,
  };

  UNSAFE_componentWillMount() {
    this.props.dispatch(fetchFavouritedStatuses());
  }

  handlePin = () => {
    const { columnId, dispatch, onlyMedia } = this.props;

    if (columnId) {
      console.log('handlePin', columnId);
      dispatch(removeColumn(columnId));
    } else {
      console.log('handlePin: COMMUNITY');
      dispatch(addColumn('COMMUNITY', { other: { onlyMedia } }));
    }
  }

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    console.log('handleMove', columnId);
    dispatch(moveColumn(columnId, dir));
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  }

  componentDidMount () {
    const { dispatch, onlyMedia, selectedAlgorithm } = this.props;
    const topicArray = this.topicArray();
    const bubbleArray = this.bubbleArray();
    console.log('componentDidMount');
    if(selectedAlgorithm === 'default') dispatch(expandCommunityTimeline({ onlyMedia }));
    if(selectedAlgorithm === 'newness') dispatch(expandNewnessTimeline({ onlyMedia, topicArray }));
    if(selectedAlgorithm === 'diversity') dispatch(expandDiverseSortedTimeline({ onlyMedia }));
    if(selectedAlgorithm === 'user') dispatch(expandPersonalizedTimeline({ onlyMedia, bubbleArray }));
    // this.disconnect = dispatch(connectCommunityStream({ onlyMedia }));
  }

  componentDidUpdate (prevProps) {
    if (prevProps.selectedAlgorithm !== this.props.selectedAlgorithm
      || prevProps.insideBubble !== this.props.insideBubble
      || prevProps.outsideBubble !== this.props.outsideBubble) {
      const { dispatch, onlyMedia, selectedAlgorithm } = this.props;
      const topicArray = this.topicArray();
      const bubbleArray = this.bubbleArray();
      //   this.disconnect();
      console.log('componentDidUpdate');
      if(selectedAlgorithm === 'default') dispatch(expandCommunityTimeline({ onlyMedia }));
      if(selectedAlgorithm === 'newness') dispatch(expandNewnessTimeline({ onlyMedia, topicArray }));
      if(selectedAlgorithm === 'diversity') dispatch(expandDiverseSortedTimeline({ onlyMedia }));
      if(selectedAlgorithm === 'user') dispatch(expandPersonalizedTimeline({ onlyMedia, bubbleArray }));
    //  this.disconnect = dispatch(connectCommunityStream({ onlyMedia }));
    }
  }

  componentWillUnmount () {
    // if (this.disconnect) {
    //   this.disconnect();
    //   this.disconnect = null;
    // }
  }

  setRef = c => {
    this.column = c;
  }

  topicArray = () => {
    const { favourites, statuses } = this.props;
    const topicArray = [];
    var sentimentScore;
    favourites.forEach(statusId => {
      sentimentScore = statuses.getIn([statusId, 'sentiment_score']);
      if(!topicArray.includes(sentimentScore)){
        topicArray.push(sentimentScore);
      }
    });
    return topicArray;
  }

  bubbleArray = () => {
    const { insideBubble, outsideBubble } = this.props;
    const bubbleArray = this.topicArray();

    //add sentiment classes from insideBubble
    insideBubble.forEach(sentimentScore => {
      bubbleArray.push(sentimentScore);
    });
    //remove sentiment classes from outsideBubble
    outsideBubble.forEach(sentimentScore => {
      bubbleArray.splice(bubbleArray.indexOf(sentimentScore), 1);
    });
    console.log(bubbleArray);
    return bubbleArray;
  }


  handleLoadMore = maxId => {
    const { dispatch, onlyMedia, selectedAlgorithm } = this.props;
    const topicArray = this.topicArray();
    const bubbleArray = this.bubbleArray();

    console.log('handleLoadMore');
    if(selectedAlgorithm === 'default') dispatch(expandCommunityTimeline({ maxId, onlyMedia }));
    if(selectedAlgorithm === 'newness') dispatch(expandNewnessTimeline({ maxId, onlyMedia, topicArray }));
    if(selectedAlgorithm === 'diversity') dispatch(expandDiverseSortedTimeline({ maxId, onlyMedia }));
    if(selectedAlgorithm === 'user') dispatch(expandPersonalizedTimeline({ maxId, onlyMedia, bubbleArray }));
  }

  render () {
    const { intl, hasUnread, columnId, multiColumn, onlyMedia, selectedAlgorithm } = this.props;
    const pinned = !!columnId;
    const renderAlgorithmString = {
      'default': 'chronologisch', 'diversity': 'divers', 'newness': 'neuheitsbasiert', 'user': 'benutzerdefiniert',
    };

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='home'
          active={hasUnread}
          title={intl.formatMessage(messages.title) + ' - ' + renderAlgorithmString[selectedAlgorithm]}
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
            scrollKey={`timeline-${columnId}`}
            timelineId={'personalized'}
            timelineMode={'personalized'}
            //onLoadMore={this.handleLoadMore}
            emptyMessage={<FormattedMessage id='empty_column.personalized' defaultMessage='The personalized timeline is empty. You have to favourite posts to see something here.' />}
            bindToDocument={!multiColumn}
          /> : selectedAlgorithm === 'diversity' ?
            <StatusListContainer
              trackScroll={!pinned}
              scrollKey={`timeline-${columnId}`}
              timelineId={'diverse'}
              //onLoadMore={this.handleLoadMore}
              emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The local timeline is empty. Write something publicly to get the ball rolling!' />}
              bindToDocument={!multiColumn}
            /> : selectedAlgorithm ==='newness' ?
              <StatusListContainer
                timelineId={'newness'}
                //onLoadMore={this.handleLoadMore}
                trackScroll={!pinned}
                scrollKey={`timeline-${columnId}`}
                emptyMessage={<FormattedMessage id='empty_column.public' defaultMessage='There is nothing here! Write something publicly, or manually follow users from other servers to fill it up' />}
                bindToDocument={!multiColumn}
              /> :  <StatusListContainer
                trackScroll={!pinned}
                scrollKey={`timeline-${columnId}`}
                timelineId={`community${onlyMedia ? ':media' : ''}`}
                onLoadMore={this.handleLoadMore}
                emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The local timeline is empty. Write something publicly to get the ball rolling!' />}
                bindToDocument={!multiColumn}
              />
        }
      </Column>
    );
  }

}
