import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { addToSettingBubbleList, removeFromSettingBubbleList } from '../../actions/settings';
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
  };

  onBubbleClickInside = (value) => {
    this.props.dispatch(addToSettingBubbleList('outsideBubble', value));
  };

  onSelectedBubbleClickInside = (value) => {
    this.props.dispatch(removeFromSettingBubbleList('insideBubble', value));
  }

  onSelectedBubbleClickOutside = (value) => {
    this.props.dispatch(removeFromSettingBubbleList('outsideBubble', value));
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
      //for every element in favorites
      favorites.forEach((statusId) => {
        //get the sentiment score of the status (we have to get it from statuses because in favorites only the ids are saved)
        sentimentScore = statuses.getIn([statusId, 'sentiment_score']);
        //get the item of the sentimentObject whith the same key as the sentiment-score
        item = sentimentObj.find((elem) => elem.key === sentimentScore);
        if (item) {
          //get the index of the found item
          index = sentimentObj.indexOf(item);
          //increase the value of the entry with the found sentiment-score
          sentimentObj[index].value = sentimentObj[index].value + 1.0;
        }
      });
      return sentimentObj;
    };

    //map sentiment-score to according Emotion
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
        <p className='headline'>In deinem benutzerdefinierten Newsfeed erscheinen Inhalte, die ähnlich zu den Inhalten sind, die du bereits geliket hast. Entscheide per Mausklick welche Themen zusätzlich angezeigt oder rausgefiltert werden sollen. Alle Themen innerhalb der Blase werden angezeigt.</p>
        <div className='wrapper'>
          {/* loop through every sentiment class */}
          {updateSentimentObj().map((status) =>
          /* don't render it on the outside of the bubble when it's in the favorite list or in the insideBubble array */
            status.value !== 0 || insideBubble.includes(status.key) ? (
              <></>
            ) : (
              <div
                key={status.key}
                // on click add to insideBubble array
                onClick={() => this.onBubbleClickOutside(status.key)}
                className='outside-bubble not-favorites'
              >
                <p className='bubble-text'>
                  {/* map sentiment score to the according sentiment word */}
                  {sentimentMap(status.key)}
                </p>
              </div>
            ),
          )}
          {/* render all entries in the outsideBubble array on the outside of the bubble*/}
          {outsideBubble.map((key, index) =>
            (
              <div
                key={index}
                // on click remove from outsideBubble array
                onClick={() => this.onSelectedBubbleClickOutside(key)}
                className='outside-bubble outside-array'
              >
                <p className='bubble-text'>
                  {sentimentMap(key)}
                </p>
              </div>
            ),
          )}
        </div>
        {/* render the big bubble*/}
        <div className='big-bubble'>
          {/* render inside the bubble: all entries of favorites that are not in the outsideBubble array */}
          {updateSentimentObj().map((status) =>
            status.value !== 0 && !outsideBubble.includes(status.key) ? (
              <div
                // on click add to outsideBubble array
                onClick={() => this.onBubbleClickInside(status.key)}
                key={status.key}
                className='inside-bubble favorites'
                style={{
                  width: 50 * calculateSize(status.value) + 80,
                  height: 50 * calculateSize(status.value) + 80,
                }}
              >
                <p className='bubble-text'>
                  {sentimentMap(status.key)}
                </p>
              </div>
            ) : (
              <></>
            ),
          )}
          {/* render all entries in the insideBubble array inside of the bubble*/}
          {insideBubble.map((key, index) =>
            (
              <div
                key={index}
                // on click remove from insideBubble array
                onClick={() => this.onSelectedBubbleClickInside(key)}
                className='inside-bubble inside-array'
              >
                <p className='bubble-text'>
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
