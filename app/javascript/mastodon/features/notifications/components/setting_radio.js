import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

export default class SettingRadio extends React.PureComponent {

  static propTypes = {
    prefix: PropTypes.string,
    settings: ImmutablePropTypes.map.isRequired,
    settingPath: PropTypes.array.isRequired,
    label: PropTypes.node.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.string,
  };

  onChange = ({ target }) => {
    this.props.onChange(this.props.settingPath, target.checked);
  };

  render() {
    const { prefix, settings, settingPath, label, value, disabled } =
      this.props;
    const id = ['setting-checkbox', prefix, ...settingPath]
      .filter(Boolean)
      .join('-');

    return (
      <div className='setting-checkbox'>
        <input
          disabled={disabled}
          type='radio'
          name='used-algorithm'
          onKeyDown={this.onKeyDown}
          value={value}
        />
        {/* <Toggle
          disabled={disabled}
          id={id}
          checked={settings.getIn(settingPath, defaultValue)}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        /> */}
        <label htmlFor={id} className='setting-toggle__label'>
          {label}
        </label>
      </div>
    );
  }

}
