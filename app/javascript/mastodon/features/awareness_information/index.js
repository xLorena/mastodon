import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  fetchFavouritedStatuses,
  expandFavouritedStatuses,
} from '../../actions/favourites';
import Column from '../ui/components/column';
import ColumnHeader from '../../components/column_header';
import { addColumn, removeColumn, moveColumn } from '../../actions/columns';
import StatusList from '../../components/status_list';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { debounce } from 'lodash';
import Columns_area from '../ui/components/columns_area';

const messages = defineMessages({
  heading: { id: 'column.favourites', defaultMessage: 'Favourites' },
});

const mapStateToProps = (state) => ({
  statusIds: state.getIn(['status_lists', 'favourites', 'items']),
  isLoading: state.getIn(['status_lists', 'favourites', 'isLoading'], true),
  hasMore: !!state.getIn(['status_lists', 'favourites', 'next']),
});

export default
@connect(mapStateToProps)
@injectIntl
class AwarenessInformation extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    intl: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    multiColumn: PropTypes.bool,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
  };

  UNSAFE_componentWillMount() {
    this.props.dispatch(fetchFavouritedStatuses());
  }

  handlePin = () => {
    const { columnId, dispatch } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('FAVOURITES', {}));
    }
  };

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  };

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  setRef = (c) => {
    this.column = c;
  };

  handleLoadMore = debounce(
    () => {
      this.props.dispatch(expandFavouritedStatuses());
    },
    300,
    { leading: true },
  );

  render() {
    const { intl, columnId, multiColumn } =
      this.props;
    const pinned = !!columnId;

    return (
      <Column
        bindToDocument={!multiColumn}
        ref={this.setRef}
        label={intl.formatMessage(messages.heading)}
      >
        <ColumnHeader
          icon='lightbulb-o'
          title={'Awareness'}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
          showBackButton
        />
        <div>
          <h3>Was ist eine Filterblase?</h3>
          <p>„Eine Welt, die aus dem Bekannten konstruiert ist, ist eine Welt, in der es nichts mehr zu lernen gibt.“ -Eli Pariser</p>
          <FormattedMessage
            id='awareness_information.text1'
            defaultMessage='Eine Filterblase ist ein Effekt, bei dem einer Person nur Informationen angezeigt werden, die mit ihrer bisherigen Meinung bereits übereinstimmen.
            Die Person wird dadurch gegenüber anderen Standpunkten isoliert und im schlimmsten Fall entwickelt sich die eigene Meinung der Person dadurch immer weiter zum Extremen.
            Diese Situation entsteht, weil Webseiten versuchen mit Hilfe von Algorithmen vorrauszusagen was für Informationen ein Benutzer sehen möchte.
            Dafür sammeln diese Webseiten Daten wie den Standort, die Suchhistorie oder das Klickverhalten der Person.
            Durch das Weglassen von Informationen, die nicht den Ansichten und Interessen des Benutzers entsprechen, wird dieser zwar weniger durch gegenteilige Ansichten belastet, aber auch in einer Informations-„Blase“ intellektuell isoliert.
            Dies kann eine Gefahr für die Demokratie sein, denn in einer freien Gesellschaft ist ein öffentlicher Diskurs wichtig.
            Diesen Effekt kann es in sozialen Netzwerken und auch in Suchmaschinen geben.'
          />
          <h3>Was kann dagegen getan werden?</h3>
          <FormattedMessage
            id='awareness_information.text2'
            defaultMessage='Das Bewusstsein über die Existenz von Filterblasen ist der erste Schritt, um diesem Effekt entgegenzuwirken.
            Es ist eine wichtige Erkenntnis, dass die Inhalte in den meisten sozialen Netzwerken für dich gefiltert werden und du dadurch eventuell Themen und Meinungen siehst, die andere nicht sehen und andersherum.
            Mit diesem Wissen kannst du dich selbst fragen, wie deine eigene Blase aussieht und ob es möglicherweise Positionen oder Themen gibt, mit denen du dich noch nicht so viel auseinandergesetzt hast.
            Du kannst auch versuchen darauf zu achten, unterschiedliche Inhalte zu liken, um den Algorithmus für dich „umzutrainieren“.
            Aber auch die Plattformen selber stehen in der Verantwortung ihre Algorithmen auf solche Effekte zu überprüfen und stets weiterzuentwickeln.
            Hast du das Gefühl, eine Plattform handelt nicht ethisch, teile deine Meinung öffentlich oder wechsle zu einer Plattform, bei der du ein besseres Gefühl hast.
            Es gibt auch soziale Netzwerken, bei denen du dich nicht auf eine Plattform festlegen musst. Dieses Konzept nennt sich „dezentralisiert“ und funktioniert so wie das E-Mail-System.
            Du kannst dir dort einen Account auf einem Server machen und trotzdem mit allen anderen Accounts befreundet sein, die auf anderen Servern im dezentralisierten Netzwerk sind.
            Ein Beispiel dafür ist „Mastodon“.'
          />
          <h3>Wo kann ich mich tiefergehend darüber informieren?</h3>
          <FormattedMessage
            id='awareness_information.text3'
            defaultMessage='Hier sind einige hilfreiche Links für den Anfang, mit denen du dich informieren kannst. Wikipedia ist auch immer ein guter Start.'
          />
          <a href='https://de.wikipedia.org/wiki/Filterblase'>Wikipedia</a>
          <a href='https://www.bpb.de/kurz-knapp/lexika/lexikon-in-einfacher-sprache/303050/filterblase/'>Bundeszentrale für politische Bildung</a>
          <a href='https://books.google.de/books/about/The_Filter_Bubble.html?id=-FWO0puw3nYC&redir_esc=y'>Eli Pariser - The Filter Bubble: What the Internet is hiding from you</a>
          <a href='https://www.semanticscholar.org/paper/Exposure-to-ideologically-diverse-news-and-opinion-Bakshy-Messing/c8665198592b52ba122e5cf84032a9bc1c61eade'>Exposure to ideologically diverse news and opinion on Facebook</a>
          <a href='https://joinmastodon.org/'>Mastodon</a>
        </div>
      </Column>
    );
  }

}
