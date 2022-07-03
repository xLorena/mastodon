import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage } from 'react-intl';
import SettingToggle from '../../notifications/components/setting_toggle';
import SettingRadio from '../../notifications/components/setting_radio';
import DropdownMenuContainer from '../../../containers/dropdown_menu_container';

export default
@injectIntl
class ColumnSettings extends React.PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };



  render() {
    const { settings, onChange } = this.props;
    const menu = [];
    menu.push(  <div style={{ width: 100, height: 100, backgroundColor: 'green' }} />);

    return (
      <div>
        <span className='column-settings__section'>
          <FormattedMessage
            id='home.column_settings.basic'
            defaultMessage='Basic'
          />
        </span>

        <div className='column-settings__row'>
          <SettingToggle
            prefix='home_timeline'
            settings={settings}
            settingPath={['shows', 'reblog']}
            onChange={onChange}
            label={
              <FormattedMessage
                id='home.column_settings.show_reblogs'
                defaultMessage='Show boosts'
              />
            }
          />
        </div>

        <div className='column-settings__row'>
          <SettingToggle
            prefix='home_timeline'
            settings={settings}
            settingPath={['shows', 'reply']}
            onChange={onChange}
            label={
              <FormattedMessage
                id='home.column_settings.show_replies'
                defaultMessage='Show replies'
              />
            }
          />
        </div>
        <span className='column-settings__section'>
          <FormattedMessage
            id='home.column_settings.filteralgorithm'
            defaultMessage='Filterungsalgorithmus'
          />
        </span>

        <div className='column-settings__row'>
          <SettingRadio
            prefix='home_timeline'
            // settings={settings}
            // settingPath={['algorithm', 'default']}
            // onChange={onChange}
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
            // settings={settings}
            // settingPath={['algorithm', 'diversity']}
            // onChange={onChange}
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
            // settings={settings}
            // settingPath={['algorithm', 'newness']}
            // onChange={onChange}
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
            // settings={settings}
            // settingPath={['algorithm', 'user']}
            value='user'
            //onChange={onChange}
            label={
              <>
                <FormattedMessage
                  id='home.column_settings.user_algo'
                  defaultMessage='Benutzerdefiniert'
                />
                <DropdownMenuContainer items={menu} icon='chevron-down' size={16} direction='right' />
              </>
            }
          />
        </div>
      </div>
    );
  }

}
