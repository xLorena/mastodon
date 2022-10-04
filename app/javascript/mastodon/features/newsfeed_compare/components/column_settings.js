import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, FormattedMessage } from 'react-intl';
import SettingRadio from '../../notifications/components/setting_radio';

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

  render () {
    const { selectedNewsfeedCompare, onNewsfeedCompareChange } = this.props;

    return (
      <div>
        {/* <div className='column-settings__row'>
          <SettingToggle settings={settings} settingPath={['other', 'onlyMedia']} onChange={onChange} label={<FormattedMessage id='community.column_settings.media_only' defaultMessage='Media only' />} />
        </div> */}
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
                defaultMessage='Keine/ Chronologisch'
              />
            }
          />
        </div>
        <div className='column-settings__row'>
          <SettingRadio
            prefix='newsfeed_compare'
            settings={selectedNewsfeedCompare}
            settingPath={['newsfeedCompare']}
            onChange={onNewsfeedCompareChange}
            value='diversity'
            label={
              <FormattedMessage
                id='home.column_settings.diversity_compare'
                defaultMessage='Divers'
              />
            }
          />
        </div>
        <div className='column-settings__row'>
          <SettingRadio
            prefix='newsfeed_compare'
            settings={selectedNewsfeedCompare}
            settingPath={['newsfeedCompare']}
            onChange={onNewsfeedCompareChange}
            value='newness'
            label={
              <FormattedMessage
                id='home.column_settings.newness_compare'
                defaultMessage='Neuheitsbasiert'
              />
            }
          />
        </div>
        <div className='column-settings__row'>
          <SettingRadio
            prefix='newsfeed_compare'
            settings={selectedNewsfeedCompare}
            settingPath={['newsfeedCompare']}
            onChange={onNewsfeedCompareChange}
            value='user'
            label={
              <FormattedMessage
                id='home.column_settings.user_compare'
                defaultMessage='Benutzerdefiniert'
              />
            }
          />
        </div>
      </div>
    );
  }

}
