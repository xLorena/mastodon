import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage } from 'react-intl';
import SettingRadio from './setting_radio';
import Icon from 'mastodon/components/icon';

export default @injectIntl
class ColumnSettings extends React.PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    selectedNewsfeedCompare: PropTypes.object,
    onNewsfeedCompareChange: PropTypes.func.isRequired,
  };

  state={
    popup:'',
    hover:'',
  };
  renderPopupDiverse = () =>{
    return (<div className='column-settings__row--modal' ><p>
      Der diverse Filteralgorithmus versucht die Inhalte, die in der Timeline angezeigt werden, möglichst ausgeglichen zu gestalten. Hier wird die ,,Stimmung'' der Posts berechnet und in einer Reihenfolge angezeigt, in der die unterschiedlichen Stimmungen gleichmäßig verteilt sind.
    </p></div>);
  };
  renderPopupNewness = () =>{
    return (<div className='column-settings__row--modal' ><p>
      Der neuheitsbasierte Filteralgorithmus versucht dir in der Timeline möglichst die Inhalte anzuzeigen, die für dich neu sind. Hier wird das Thema der Posts bestimmt und es werden nur die Posts mit den Themen angezeigt, die du noch nie favorisiert hast.
    </p></div>);
  };
  renderPopupUser = () =>{
    return (<div className='column-settings__row--modal' ><p>
      Bei der benutzerdefinierten Filterung werden nur die Inhalte in deiner Timeline angezeigt, die dir möglicherweise gefallen. Dafür wird das Thema der Posts bestimmt und es werden nur die Posts mit Themen angezeigt, die du bereits favorisiert hast. Du kannst aber selber Einfluss nehmen, indem du Inhalte in deine Blase rein oder raus schiebst. Öffne dafür die benutzerdefinierte Filterung oder wechsle zum Reiter ,,Personalisierung erkunden".
    </p></div>);
  };
  handleLeave=()=>{
    return this.setState({ popup:'', hover: '' });
  };
  handleHoverDiverse=()=>{
    return this.setState({ popup: this.renderPopupDiverse(), hover: 'diverse' });
  };

  handleHoverNewness=()=>{
    return this.setState({ popup: this.renderPopupNewness(), hover:'newness' });
  };

  handleHoverUser=()=>{
    return this.setState({ popup: this.renderPopupUser(), hover:'user' });
  };

  render () {
    const { selectedNewsfeedCompare, onNewsfeedCompareChange } = this.props;

    return (
      <div className='newsfeed-compare-settings' style={{ paddingTop: '10px', width:'15%' }}>
        <div className='column-settings__row'>
          <SettingRadio
            prefix='newsfeed_compare'
            settings={selectedNewsfeedCompare}
            settingPath={['newsfeedCompare']}
            onChange={onNewsfeedCompareChange}
            value='default'
            label={
              <FormattedMessage
                id='home.column_settings.default_compare'
                defaultMessage='Keiner/ Chronologisch'
              />
            }
          />
        </div>
        <div className='column-settings__row' onMouseOver={this.handleHoverDiverse} onMouseLeave={this.handleLeave}>
          <SettingRadio
            prefix='newsfeed_compare'
            settings={selectedNewsfeedCompare}
            settingPath={['newsfeedCompare']}
            onChange={onNewsfeedCompareChange}
            value='diversity'
            label={
              <>
                <FormattedMessage
                  id='home.column_settings.diversity_algo'
                  defaultMessage='Divers'
                />
                <Icon id='info-circle' className='algorithm-icon' />
              </>
            }
          />
          {this.state.hover ==='diverse' && this.state.popup}
        </div>
        <div className='column-settings__row' onMouseOver={this.handleHoverNewness} onMouseLeave={this.handleLeave}>
          <SettingRadio
            prefix='newsfeed_compare'
            settings={selectedNewsfeedCompare}
            settingPath={['newsfeedCompare']}
            onChange={onNewsfeedCompareChange}
            value='newness'
            label={
              <>
                <FormattedMessage
                  id='home.column_settings.newness_algo'
                  defaultMessage='Neuheitsbasiert'
                />
                <Icon id='info-circle' className='algorithm-icon' />
              </>
            }
          />
          {this.state.hover ==='newness' && this.state.popup}
        </div>
        <div className='column-settings__row' onMouseOver={this.handleHoverUser} onMouseLeave={this.handleLeave}>
          <SettingRadio
            prefix='newsfeed_compare'
            settings={selectedNewsfeedCompare}
            settingPath={['newsfeedCompare']}
            onChange={onNewsfeedCompareChange}
            value='user'
            label={
              <>
                <FormattedMessage
                  id='home.column_settings.user_algo'
                  defaultMessage='Benutzerdefiniert'
                />
                <Icon id='info-circle' className='algorithm-icon' />
              </>
            }
          />
          {this.state.hover ==='user' && this.state.popup}
        </div>
      </div>
    );
  }

}
