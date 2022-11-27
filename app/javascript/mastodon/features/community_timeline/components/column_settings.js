import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage } from 'react-intl';
//import SettingToggle from '../../notifications/components/setting_toggle';
import SettingRadio from '../../notifications/components/setting_radio';
//import DropdownMenuContainer from '../../../containers/dropdown_menu_container';
import Icon from 'mastodon/components/icon';



export default
@injectIntl
class ColumnSettings extends React.PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    selectedAlgorithm: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onItemClick: PropTypes.func,
    onAlgorithmChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    onItemClick: PropTypes.func.isRequired,
  };

  handleItemClick = () => {
    const { onItemClick } = this.props;
    onItemClick();
  };

  state={
    popup:'',
    hover:'',
  };
  renderPopupDiverse = () =>{
    return (<div className='column-settings__row--modal' ><p>
      Der diverse Filteralgorithmus versucht die Inhalte, die in der Timeline angezeigt werden, möglichst divers zu gestalten. Hier wird die ,,Stimmung'' der Posts berechnet und in einer Reihenfolge angezeigt, in der die unterschiedlichen Stimmungen möglichst ausgeglichen sind.
    </p></div>);
  };
  renderPopupNewness = () =>{
    return (<div className='column-settings__row--modal' ><p>
      Der neuheitsbasierte Filteralgorithmus versucht dir in der Timeline möglichst die Inhalte anzuzeigen, die für dich neu sind. Hier wird das Thema der Posts bestimmt und es werden nur die Posts mit den Themen angezeigt, die du noch nie favorisiert hast.
    </p></div>);
  };
  renderPopupUser = () =>{
    return (<div className='column-settings__row--modal' ><p>
      Bei der benutzerdefinierten Filterung werden nur die Inhalte in deiner Timeline angezeigt, die dir möglicherweise gefallen. Dafür wird as Thema der Posts bestimmt und es werden nur die Posts mit Themen angezeigt, die du bereits favorisiert hast. Du kannst aber selber Einfluss nehmen, indem du Inhalte in deine Blase rein oder raus schiebst. Öffne dafür die benutzerdefinierte Filterung oder wechsle zum Reiter ,,Personalisierung erkunden".
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

  render() {
    const { selectedAlgorithm, onAlgorithmChange } = this.props;

    return (
      <div className='community-timeline-settings'>
        <div className='column-settings__row'>
          <span className='column-settings__section'>
            <FormattedMessage
              id='home.column_settings.filteralgorithm'
              defaultMessage='Filteralgorithmus'
            />
          </span>

          <div className='column-settings__row'>
            <SettingRadio
              prefix='home_timeline'
              settings={selectedAlgorithm}
              settingPath={['algorithm']}
              onChange={onAlgorithmChange}
              value='default'
              label={
                <FormattedMessage
                  id='home.column_settings.default_algo'
                  defaultMessage='Keine/ Chronologisch'
                />
              }
            />
          </div>

          <div className='column-settings__row' onMouseOver={this.handleHoverDiverse} onMouseLeave={this.handleLeave}>
            <SettingRadio
              prefix='home_timeline'
              settings={selectedAlgorithm}
              settingPath={['algorithm']}
              onChange={onAlgorithmChange}
              value='diversity'
              label={
                <FormattedMessage
                  id='home.column_settings.diversity_algo'
                  defaultMessage='Divers'
                />
              }
            />
            {this.state.hover ==='diverse' && this.state.popup}
          </div>
          <div className='column-settings__row' onMouseOver={this.handleHoverNewness} onMouseLeave={this.handleLeave}>
            <SettingRadio
              prefix='home_timeline'
              settingPath={['algorithm']}
              settings={selectedAlgorithm}
              onChange={onAlgorithmChange}
              value='newness'
              label={
                <FormattedMessage
                  id='home.column_settings.newness_algo'
                  defaultMessage='Neuheitsbasiert'
                />
              }
            />
            {this.state.hover ==='newness' && this.state.popup}
          </div>
          <div className='column-settings__row' onMouseOver={this.handleHoverUser} onMouseLeave={this.handleLeave}>
            <SettingRadio
              prefix='home_timeline'
              settings={selectedAlgorithm}
              settingPath={['algorithm']}
              value='user'
              onChange={onAlgorithmChange}
              label={
                <>
                  <FormattedMessage
                    id='home.column_settings.user_algo'
                    defaultMessage='Benutzerdefiniert'
                  />
                  <button className='dropdown-menu__text-button' onClick={this.handleItemClick}>
                    <Icon id='caret-down' fixedWidth />
                  </button>
                </>
              }
            />
            {this.state.hover ==='user' && this.state.popup}
          </div>
        </div>
      </div>
    );
  }

}
