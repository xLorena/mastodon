import React from 'react';
import PropTypes from 'prop-types';
//import ImmutablePropTypes from 'react-immutable-proptypes';
import Toggle from 'react-toggle';

export default class SettingRadio extends React.PureComponent {

  static propTypes = {
    prefix: PropTypes.string,
    settings: PropTypes.object.isRequired,
    settingPath: PropTypes.array.isRequired,
    label: PropTypes.node.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.string,
  };

  onChange = () => {
    this.props.onChange(this.props.value, this.props.settings);
  };

  render() {
    const { prefix, settings, settingPath, label, value, disabled } =
      this.props;
    const id = ['setting-checkbox', prefix, ...settingPath]
      .filter(Boolean)
      .join('-');

    return (
      <div className='setting-checkbox'>
        {/* <input
          disabled={disabled}
          type='radio'
          name='used-algorithm'
          onKeyDown={this.onKeyDown}
          value={value}
          onChange={this.onChange}
          // checked={settings.getIn(settingPath) === 'default'}
        /> */}
        <Toggle
          disabled={disabled}
          id={id}
          // checked={settings.getIn(settingPath, defaultValue)}
          checked={settings.includes(value)}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
        <label htmlFor={id} className='setting-toggle__label'>
          {label}
        </label>
      </div>
    );
  }

}
