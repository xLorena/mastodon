import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Button from '../../../components/button';
import { Polarization } from '../util/async-components';
import BubbleList from '../../polarization/bubble-list';

export default
@injectIntl
class ConfirmationModal extends React.PureComponent {

  static propTypes = {
    message: PropTypes.node.isRequired,
    showBubbleComponent: PropTypes.bool,
    confirm: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    secondary: PropTypes.string,
    onSecondary: PropTypes.func,
    closeWhenConfirm: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    closeWhenConfirm: true,
  };

  componentDidMount() {
    this.button.focus();
  }

  handleClick = () => {
    if (this.props.closeWhenConfirm) {
      this.props.onClose();
    }
    this.props.onConfirm();
  };

  handleSecondary = () => {
    this.props.onClose();
    this.props.onSecondary();
  };

  handleCancel = () => {
    this.props.onClose();
  };

  setRef = (c) => {
    this.button = c;
  };

  render() {
    const { message, confirm, secondary, showBubbleComponent } = this.props;

    return (
      <div className={`modal-root__modal confirmation-modal ${showBubbleComponent ? ' confirmation-modal--filter-bubble' : ''}`}>
        <div className='confirmation-modal__container'>
          {message}
          {showBubbleComponent ? <BubbleList /> : <></>}
        </div>
        <div className='confirmation-modal__action-bar'>
          <Button
            onClick={this.handleCancel}
            className='confirmation-modal__cancel-button'
          >
            <FormattedMessage
              id='confirmation_modal.cancel'
              defaultMessage='Cancel'
            />
          </Button>
          {secondary !== undefined && (
            <Button
              text={secondary}
              onClick={this.handleSecondary}
              className='confirmation-modal__secondary-button'
            />
          )}
          <Button text={confirm} onClick={this.handleClick} ref={this.setRef} />
        </div>
      </div>
    );
  }

}
