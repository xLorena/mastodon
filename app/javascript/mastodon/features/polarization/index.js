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

  componentWillMount() {
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
      hasUnread,
      columnId,
      multiColumn,
      onlyMedia,
      statuses,
      favorites,
    } = this.props;
    const pinned = !!columnId;

    // var sentimentObj = { '0.0': 0, '1.0': 0, '2.0':0, '3.0': 0, '4.0': 0, '5.0':0, '6.0': 0, '7.0': 0, '8.0':0, '9.0': 0, '10.0': 0, 'not classified':0 };
    var sentimentObj = [
      { key: '0.0', value: 0 },
      { key: '1.0', value: 0 },
      { key: '2.0', value: 0 },
      { key: '3.0', value: 0 },
      { key: '4.0', value: 0 },
      { key: '5.0', value: 0 },
      { key: '6.0', value: 0 },
      { key: '7.0', value: 0 },
      { key: '8.0', value: 0 },
      { key: '9.0', value: 0 },
      { key: '10.0', value: 0 },
    ];
    // const updateSentimentObj = () => {
    //   statuses.forEach(status => {
    //     sentimentObj[status.get('sentiment_score')] = sentimentObj[status.get('sentiment_score')] + 1.0;
    //   });
    //   return sentimentObj;
    // };

    // const updateSentimentObj = () => {
    //   var item;
    //   var index;
    //   statuses.forEach(status => {
    //     item = sentimentObj.find((item)=> item.key === status.get('sentiment_score'));
    //     if(item){
    //       index = sentimentObj.indexOf(item);
    //       sentimentObj[index].value = sentimentObj[index].value + 1.0;
    //     }
    //   });
    //   return sentimentObj;
    // };

    const updateSentimentObj = () => {
      var item;
      var index;
      var sentimentScore;
      favorites.forEach((statusId) => {
        sentimentScore = statuses.getIn([statusId, 'sentiment_score']);
        item = sentimentObj.find((elem) => elem.key === sentimentScore);
        if (item) {
          index = sentimentObj.indexOf(item);
          sentimentObj[index].value = sentimentObj[index].value + 1.0;
        }
      });
      return sentimentObj;
    };

    const sentimentMap = (sentimentScore) => {
      switch (sentimentScore) {
      case '0.0':
        return 'Optimistic';
      case '1.0':
        return 'Thankful';
      case '2.0':
        return 'Empathetic';
      case '3.0':
        return 'Pessimistic';
      case '4.0':
        return 'Anxious';
      case '5.0':
        return 'Sad';
      case '6.0':
        return 'Annoyed';
      case '7.0':
        return 'Denial';
      case '8.0':
        return 'Surprise';
      case '9.0':
        return 'Official report';
      case '10.0':
        return 'Joking';
      default:
        return 'not classified';
      }
    };

    const calculateSize = (sentimentScore) => {
      // var counter = 0;
      // statuses.forEach(status => {
      //   if(status.get('sentiment_score') === sentimentScore) {
      //     counter++;
      //   }
      // });
      return sentimentScore / Object.keys(statuses).length;
    };

    // const renderBubbleList = statuses.map((status) => (
    //   <div key={status.id} style={{ borderRadius: '50%', width: '100px', height:'100px', backgroundColor: 'lightblue', display:'flex', justifyContent: 'center', alignItems:'center' }}>
    //     <div style={{}}>
    //       <p style={{ color: 'black', fontSize: 18 }}>
    //         {sentimentMap(status.get('sentiment_score'))}
    //       </p>
    //     </div>
    //   </div>));

    // const BubbleList = ({ statuses }) => (
    //   <>
    //     {statuses.map(status => (
    //       <div key={status.get('id')} style={{ borderRadius: '50%', width: 100*calculateSize(status.get('sentiment_score'))+50, height:100*calculateSize(status.get('sentiment_score'))+50, backgroundColor: 'lightblue', display:'flex', justifyContent: 'center', alignItems:'center' }}>
    //         <p style={{ color: 'black', fontSize: 14 }}>
    //           {sentimentMap(status.get('sentiment_score'))}
    //         </p>
    //         <p>
    //           {calculateSize(status.get('sentiment_score'))}
    //         </p>
    //       </div>
    //     ))}
    //   </>
    // );

    const BubbleList = ({ statuses }) => (
      <>
        {/* <p>{'Hallo ' + JSON.stringify(favorites)}</p> */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 'auto',
            // marginLeft: 350,
            marginTop: 100,
            backgroundColor: 'cadetblue',
            zIndex: 10,
            borderRadius: '50%',
            width: '65vh',
            height: '65vh',
            padding: 40,
            border: '10px solid powderblue',
            boxShadow: '0px 0px 0px 3px teal',
          }}
        >
          {statuses.map((status) =>
            status.value !== 0 ? (
              <div
                key={status.key}
                style={{
                  borderRadius: '50%',
                  border: '10px solid powderblue',
                  boxShadow: '0px 0px 0px 3px teal',
                  width: 100 * calculateSize(status.value) + 100,
                  height: 100 * calculateSize(status.value) + 100,
                  backgroundColor: 'lightblue',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 15,
                }}
              >
                <p style={{ color: 'black', fontSize: 14 }}>
                  {sentimentMap(status.key)}
                </p>
              </div>
            ) : (
              <div
                key={status.key}
                style={{
                  borderRadius: '50%',
                  border: '3px solid tan',
                  width: 100,
                  height: 100,
                  backgroundColor: 'wheat',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 15,
                  position: 'absolute',
                  top:
                    parseInt(status.key) <= 5
                      ? 200 - parseInt(status.key) * 40
                      : 'initial',
                  bottom:
                    parseInt(status.key) <= 5
                      ? 'initial'
                      : 0 + parseInt(status.key) * 40,
                  left:
                    parseInt(status.key) <= 5
                      ? parseInt(status.key) * 140
                      : parseInt(status.key) * 210,
                  // right: parseInt(status.key) <= 5 ? 'initial':parseInt(status.key)*80,
                }}
              >
                <p style={{ color: 'black', fontSize: 14 }}>
                  {sentimentMap(status.key)}
                </p>
              </div>
            ),
          )}
        </div>
        {/* <div style={{ backgroundColor:'blue', position:'absolute', width: 800, height: 800, borderRadius:'50%',   left: 0,
          right: 0,
          marginLeft: 'auto',
          marginRight: 'auto'  }}
        /> */}
      </>
    );

    return (
      <Column
        bindToDocument={!multiColumn}
        ref={this.setRef}
        label={intl.formatMessage(messages.title)}
      >
        <ColumnHeader
          icon='star'
          title={'Polarisierung erkunden'}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
          showBackButton
        />
        {/* <h3>{'Statuses' + JSON.stringify(statuses)}</h3> */}
        <BubbleList statuses={updateSentimentObj()} />
        {/* <p>{JSON.stringify(updateSentimentObj())}</p> */}
        {/* <div className='newsfeed-compare__row'>
          <StatusListContainer
            trackScroll={!pinned}
            scrollKey={`community_timeline-${columnId}`}
            timelineId={`community${onlyMedia ? ':media' : ''}`}
            onLoadMore={this.handleLoadMore}
            emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The local timeline is empty. Write something publicly to get the ball rolling!' />}
            bindToDocument={!multiColumn}
          />
        </div> */}
      </Column>
    );
  }

}
