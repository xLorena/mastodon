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
  title: { id: 'column.community', defaultMessage: 'Local timeline' },
});

const mapStateToProps = (state, { columnId }) => {
  const uuid = columnId;
  const columns = state.getIn(['settings', 'columns']);
  const index = columns.findIndex(c => c.get('uuid') === uuid);
  const onlyMedia = (columnId && index >= 0) ? columns.get(index).getIn(['params', 'other', 'onlyMedia']) : state.getIn(['settings', 'community', 'other', 'onlyMedia']);
  const timelineState = state.getIn(['timelines', `community${onlyMedia ? ':media' : ''}`]);
  const selectedNewsfeedCompare = state.getIn(['settings', 'newsfeedCompare']);
  const favourites = state.getIn(['status_lists', 'favourites', 'items']);
  const insideBubble = state.getIn(['settings', 'personalization', 'insideBubble']);
  const outsideBubble = state.getIn(['settings', 'personalization', 'outsideBubble']);
  const statuses = state.get('statuses');
  const timelines = state.get('timelines');

  return {
    hasUnread: !!timelineState && timelineState.get('unread') > 0,
    onlyMedia,
    selectedNewsfeedCompare,
    favourites,
    insideBubble,
    outsideBubble,
    statuses,
    timelines,
  };
};

export default @connect(mapStateToProps)
@injectIntl
class NewsfeedCompare extends React.PureComponent {

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
    selectedNewsfeedCompare: PropTypes.object,
    statuses: PropTypes.object,
    favourites: PropTypes.object,
    insideBubble: PropTypes.object,
    outsideBubble: PropTypes.object,
    timelines: PropTypes.object,
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
  }

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  }

  componentDidMount () {
    const { dispatch, onlyMedia, selectedNewsfeedCompare } = this.props;
    const topicArray = this.topicArray();
    const bubbleArray = this.bubbleArray();
    if(selectedNewsfeedCompare.includes('default')) dispatch(expandCommunityTimeline({ onlyMedia }));
    if(selectedNewsfeedCompare.includes('newness')) dispatch(expandNewnessTimeline({ onlyMedia, topicArray }));
    if(selectedNewsfeedCompare.includes('diversity')) dispatch(expandDiverseSortedTimeline({ onlyMedia }));
    if(selectedNewsfeedCompare.includes('user')) dispatch(expandPersonalizedTimeline({ onlyMedia, bubbleArray }));
    //this.disconnect = dispatch(connectCommunityStream({ onlyMedia }));
  }

  componentDidUpdate (prevProps) {
    const { dispatch, onlyMedia, selectedNewsfeedCompare } = this.props;
    const topicArray = this.topicArray();
    const bubbleArray = this.bubbleArray();
    if (prevProps.selectedNewsfeedCompare !== this.props.selectedNewsfeedCompare) {
      if(selectedNewsfeedCompare.includes('default') && !prevProps.selectedNewsfeedCompare.includes('default')) dispatch(expandCommunityTimeline({ onlyMedia }));
      if(selectedNewsfeedCompare.includes('newness') && !prevProps.selectedNewsfeedCompare.includes('newness')) dispatch(expandNewnessTimeline({ onlyMedia, topicArray }));
      if(selectedNewsfeedCompare.includes('diversity') && !prevProps.selectedNewsfeedCompare.includes('diversity')) dispatch(expandDiverseSortedTimeline({ onlyMedia }));
      if(selectedNewsfeedCompare.includes('user') && !prevProps.selectedNewsfeedCompare.includes('user')) dispatch(expandPersonalizedTimeline({ onlyMedia, bubbleArray }));
    }
    if(this.props.timelines.get('newness') && this.props.timelines.getIn(['newness', 'items']).size === 0 && this.props.timelines.getIn(['newness', 'hasMore'])) dispatch(expandNewnessTimeline({ onlyMedia, topicArray }));
    if(this.props.timelines.get('diverse') && this.props.timelines.getIn(['diverse', 'items']).size === 0 && this.props.timelines.getIn(['diverse', 'hasMore'])) dispatch(expandDiverseSortedTimeline({ onlyMedia }));
    if(this.props.timelines.get('personalized') && this.props.timelines.getIn(['personalized', 'items']).size === 0 && this.props.timelines.getIn(['personalized', 'hasMore'])) dispatch(expandPersonalizedTimeline({ onlyMedia, bubbleArray }));
  }

  // componentWillUnmount () {
  //   if (this.disconnect) {
  //     this.disconnect();
  //     this.disconnect = null;
  //   }
  // }

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
    const { dispatch, onlyMedia } = this.props;
    // const topicArray = this.topicArray();
    // const bubbleArray = this.bubbleArray();

    dispatch(expandCommunityTimeline({ maxId, onlyMedia }));
    // dispatch(expandNewnessTimeline({ maxId, onlyMedia, topicArray }));
    // dispatch(expandDiverseSortedTimeline({ maxId, onlyMedia }));
    // dispatch(expandPersonalizedTimeline({ maxId, onlyMedia, bubbleArray }));
  }

  // handleLoadMoreDiverse = maxId => {
  //   const { dispatch, onlyMedia } = this.props;
  //   // const topicArray = this.topicArray();
  //   // const bubbleArray = this.bubbleArray();

  //   // dispatch(expandCommunityTimeline({ onlyMedia }));
  //   // dispatch(expandNewnessTimeline({ onlyMedia, topicArray }));
  //   dispatch(expandDiverseSortedTimeline({ onlyMedia }));
  //   // dispatch(expandPersonalizedTimeline({ onlyMedia, bubbleArray }));
  // }

  render () {
    const { intl, hasUnread, columnId, multiColumn, onlyMedia, selectedNewsfeedCompare } = this.props;
    const pinned = !!columnId;

    const renderDefaultStatusList = () => {
      return (
        <div className='newsfeed-compare__row--first'>
          <div className='newsfeed-compare__caption'>
            <FormattedMessage id='newsfeed_compare.default' defaultMessage='Chronologisch' />
          </div>
          <StatusListContainer
            trackScroll={!pinned}
            scrollKey={`community_timeline-${columnId}`}
            timelineId={`community${onlyMedia ? ':media' : ''}`}
            onLoadMore={this.handleLoadMore}
            emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The local timeline is empty. Write something publicly to get the ball rolling!' />}
            bindToDocument={!multiColumn}
          />
        </div>);
    };

    const renderDiverseStatusList = () => {
      return (
        <div className='newsfeed-compare__row--second'>
          <div className='newsfeed-compare__caption'>
            <FormattedMessage id='newsfeed_compare.diverse' defaultMessage='Divers' />
          </div>
          <StatusListContainer
            trackScroll={!pinned}
            scrollKey={'community_timeline-2'}
            timelineId={'diverse'}
            //onLoadMore={this.handleLoadMore}
            emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The local timeline is empty. Write something publicly to get the ball rolling!' />}
            bindToDocument={!multiColumn}
          />
        </div>);
    };

    const renderNewnessStatusList = () => {
      return (
        <div className='newsfeed-compare__row--third'>
          <div className='newsfeed-compare__caption'>
            <FormattedMessage id='newsfeed_compare.newness' defaultMessage='Neuheitsbasiert' />
          </div>
          <StatusListContainer
            timelineId={'newness'}
            //onLoadMore={this.handleLoadMore}
            trackScroll={!pinned}
            scrollKey={`timeline-${columnId}`}
            emptyMessage={<FormattedMessage id='empty_column.public' defaultMessage='There is nothing here! Write something publicly, or manually follow users from other servers to fill it up' />}
            bindToDocument={!multiColumn}
          />
        </div>);
    };

    const renderPersonalizedStatusList = () => {
      return (
        <div className='newsfeed-compare__row--fourth'>
          <div className='newsfeed-compare__caption'>
            <FormattedMessage id='newsfeed_compare.personalized' defaultMessage='Benutzerdefiniert' />
          </div>
          <StatusListContainer
            trackScroll={!pinned}
            scrollKey={'timeline-personalized'}
            timelineId={'personalized'}
            timelineMode={'personalized'}
            //onLoadMore={this.handleLoadMore}
            emptyMessage={<FormattedMessage id='empty_column.personalized' defaultMessage='The personalized timeline is empty. You have to favourite posts to see something here.' />}
            bindToDocument={!multiColumn}
          />
        </div>
      );
    };

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='columns'
          title={'Newsfeed Vergleich'}
          active={hasUnread}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
        >
          <ColumnSettingsContainer columnId={columnId} />
        </ColumnHeader>
        <div className='newsfeed-compare'>
          {selectedNewsfeedCompare.includes('default') ? renderDefaultStatusList() : null}
          {selectedNewsfeedCompare.includes('diversity') ? renderDiverseStatusList() : null}
          {selectedNewsfeedCompare.includes('newness') ? renderNewnessStatusList() : null}
          {selectedNewsfeedCompare.includes('user') ? renderPersonalizedStatusList() : null}
        </div>
      </Column>
    );
  }

}