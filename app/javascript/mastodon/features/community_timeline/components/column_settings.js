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

  render() {
    const { selectedAlgorithm, onAlgorithmChange } = this.props;
    // const menu = [];
    // menu.push(  <div style={{ width: 100, height: 100, backgroundColor: 'green' }} />);

    return (
      <div>
        <div className='column-settings__row'>
          {/* We don't need this for our use case */}
          {/* <SettingToggle
            settings={settings}
            settingPath={['other', 'onlyMedia']}
            onChange={onChange}
            label={
              <FormattedMessage
                id='community.column_settings.media_only'
                defaultMessage='Media only'
              />
            }
          /> */}
          <span className='column-settings__section'>
            <FormattedMessage
              id='home.column_settings.filteralgorithm'
              defaultMessage='Filterungsalgorithmus'
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

          <div className='column-settings__row'>
            <SettingRadio
              prefix='home_timeline'
              settings={selectedAlgorithm}
              settingPath={['algorithm']}
              // settingPath={['algorithm', 'diversity']}
              onChange={onAlgorithmChange}
              value='diversity'
              label={
                <FormattedMessage
                  id='home.column_settings.diversity_algo'
                  defaultMessage='Divers'
                />
              }
            />
          </div>
          <div className='column-settings__row'>
            <SettingRadio
              prefix='home_timeline'
              settingPath={['algorithm']}
              settings={selectedAlgorithm}
              // settingPath={['algorithm', 'newness']}
              onChange={onAlgorithmChange}
              value='newness'
              label={
                <FormattedMessage
                  id='home.column_settings.newness_algo'
                  defaultMessage='Neuheitsbasiert'
                />
              }
            />
          </div>
          <div className='column-settings__row'>
            <SettingRadio
              prefix='home_timeline'
              settings={selectedAlgorithm}
              settingPath={['algorithm']}
              // settingPath={['algorithm', 'user']}
              value='user'
              onChange={onAlgorithmChange}
              //onChange={onChange}
              label={
                <>
                  <FormattedMessage
                    id='home.column_settings.user_algo'
                    defaultMessage='Benutzerdefiniert'
                  />
                  {/* <DropdownMenu renderItem={this.renderItem} scrollable onItemClick={this.handleItemClick}> */}
                  <button className='dropdown-menu__text-button' onClick={this.handleItemClick}>
                    <Icon id='caret-down' fixedWidth />
                  </button>
                  {/* </DropdownMenu> */}
                  {/* <DropdownMenuContainer
                    //items={menu}
                    icon='chevron-down'
                    size={16}
                    direction='right'
                  /> */}
                </>
              }
            />
          </div>
        </div>
      </div>
    );
  }

}
