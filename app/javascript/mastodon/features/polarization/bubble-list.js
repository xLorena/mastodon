import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { addToSettingBubbleList, removeFromSettingBubbleList } from '../../actions/settings';
//import StatusListContainer from '../ui/containers/status_list_container';
// import {
//   expandCommunityTimeline,
//   expandDiverseSortedTimeline,
// } from '../../actions/timelines';
import { fetchFavouritedStatuses } from '../../actions/favourites';

const mapStateToProps = (state) => {
  const statuses = state.get('statuses');
  const favorites = state.getIn(['status_lists', 'favourites', 'items']);
  const insideBubble = state.getIn([
    'settings',
    'personalization',
    'insideBubble',
  ]);
  const outsideBubble = state.getIn([
    'settings',
    'personalization',
    'outsideBubble',
  ]);
  return {
    statuses,
    favorites,
    insideBubble,
    outsideBubble,
  };
};

export default
@connect(mapStateToProps)
@injectIntl
class BubbleList extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statuses: PropTypes.object,
    favorites: PropTypes.object,
    insideBubble: PropTypes.array,
    outsideBubble: PropTypes.array,
  };

  UNSAFE_componentWillMount() {
    this.props.dispatch(fetchFavouritedStatuses());
  }

  onBubbleClickOutside = (value) => {
    this.props.dispatch(addToSettingBubbleList('insideBubble', value));
    // this.props.dispatch({
    //   type: 'RESET',
    // });
    console.log('bubble clicked outside');
  };

  onBubbleClickInside = (value) => {
    this.props.dispatch(addToSettingBubbleList('outsideBubble', value));
    console.log('bubble clicked inside');
  };

  onSelectedBubbleClickInside = (value) => {
    this.props.dispatch(removeFromSettingBubbleList('insideBubble', value));
    console.log('selected bubble clicked inside');
  }

  onSelectedBubbleClickOutside = (value) => {
    this.props.dispatch(removeFromSettingBubbleList('outsideBubble', value));
    console.log('selected bubble clicked outside');
  }


  render() {
    const { statuses, favorites, insideBubble, outsideBubble } = this.props;

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
      return sentimentScore / Object.keys(statuses).length;
    };

    return (
      <div className='bubble-list'>
        <p style={{ fontSize: '0.9rem', paddingTop: '5px', textAlign:'center' }}>In deinem benutzerdefinierten Newsfeed erscheinen Inhalte, die ähnlich zu den Inhalten sind, die du bereits geliket hast. Entscheide per Mausklick welche Themen zusätzlich angezeigt oder rausgefiltert werden sollen. Alle Themen innerhalb der Blase werden angezeigt.</p>
        <div style={{ padding: '0', display:'flex', justifyContent:'center' }}>
          {updateSentimentObj().map((status) =>
            status.value !== 0 || insideBubble.includes(status.key) ? (
              <></>
            ) : (
              <div
                key={status.key}
                onClick={() => this.onBubbleClickOutside(status.key)}
                className='outside-bubble'
                style={{
                  borderRadius: '50%',
                  border: '3px solid tan',
                  width: 80,
                  height: 80,
                  backgroundColor: 'wheat',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 15,
                  float: 'left',
                  cursor: 'pointer',
                }}
              >
                <p style={{ color: 'black', fontSize: 14, textAlign:'center' }}>
                  {sentimentMap(status.key)}
                </p>
              </div>
            ),
          )}
          {outsideBubble.map((key, index) =>
            (
              <div
                key={index}
                onClick={() => this.onSelectedBubbleClickOutside(key)}
                className='outside-bubble'
                style={{
                  borderRadius: '50%',
                  border: '10px solid powderblue',
                  boxShadow: '0px 0px 0px 3px teal',
                  width: 80,
                  height: 80,
                  // width: 50 * calculateSize(this.updateSentimentObject()[key]) + 60,
                  // height: 50 * calculateSize(this.updateSentimentObject()[key]) + 60,
                  backgroundColor: 'lightblue',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 15,
                  cursor: 'pointer',
                }}
              >
                <p style={{ color: 'black', fontSize: 14, textAlign:'center' }}>
                  {sentimentMap(key)}
                </p>
              </div>
            ),
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 'auto',
            marginTop: 0,
            backgroundColor: 'cadetblue',
            zIndex: 10,
            borderRadius: '50%',
            width: '65vh',
            height: '65vh',
            padding: 10,
            border: '10px solid powderblue',
            boxShadow: '0px 0px 0px 3px teal',
          }}
        >
          {updateSentimentObj().map((status) =>
            status.value !== 0 && !outsideBubble.includes(status.key) ? (
              <div
                onClick={() => this.onBubbleClickInside(status.key)}
                key={status.key}
                className='inside-bubble'
                style={{
                  borderRadius: '50%',
                  border: '10px solid powderblue',
                  boxShadow: '0px 0px 0px 3px teal',
                  width: 50 * calculateSize(status.value) + 80,
                  height: 50 * calculateSize(status.value) + 80,
                  backgroundColor: 'lightblue',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 15,
                  cursor: 'pointer',
                }}
              >
                <p style={{ color: 'black', fontSize: 14, textAlign:'center' }}>
                  {sentimentMap(status.key)}
                </p>
              </div>
            ) : (
              <></>
            ),
          )}
          {insideBubble.map((key, index) =>
            (
              <div
                key={index}
                onClick={() => this.onSelectedBubbleClickInside(key)}
                className='outside-bubble'
                style={{
                  borderRadius: '50%',
                  border: '3px solid tan',
                  width: 80,
                  height: 80,
                  backgroundColor: 'wheat',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 15,
                  float: 'left',
                  cursor: 'pointer',
                }}
              >
                <p style={{ color: 'black', fontSize: 14, textAlign:'center' }}>
                  {sentimentMap(key)}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    );
  }

}
