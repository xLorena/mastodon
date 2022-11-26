/* eslint-disable jsx-quotes */
import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Icon from 'mastodon/components/icon';
import { showTrends } from 'mastodon/initial_state';
import ListPanel from './list_panel';
import TrendsContainer from 'mastodon/features/getting_started/containers/trends_container';
import PropTypes from 'prop-types';


const NavigationPanel = (props) => (
  <div className="navigation-panel">
    <NavLink
      className="column-link column-link--transparent"
      to="/home"
      data-preview-title-id="column.home"
      data-preview-icon="home"
    >
      <Icon className="column-link__icon" id="home" fixedWidth />
      <span className={props.showLabelOnHover ? 'show-on-hover' : null}>
        <FormattedMessage  id="tabs_bar.home" defaultMessage="Home" />
      </span>
    </NavLink>
    <ListPanel />

    <hr />

    <NavLink
      className="column-link column-link--transparent"
      to="/newsfeed-compare"
    >
      <Icon className="column-link__icon" id="columns" fixedWidth />
      <span className={props.showLabelOnHover ? 'show-on-hover' : null}>
        <FormattedMessage
          id="navigation_bar.newsfeed-vergleich"
          defaultMessage="Newsfeed Vergleich"
        />
      </span>
    </NavLink>
    <NavLink
      className="column-link column-link--transparent"
      to="/polarization"
    >
      <Icon className="column-link__icon" id="user-circle-o" fixedWidth />
      <span className={props.showLabelOnHover ? 'show-on-hover' : null}>
        <FormattedMessage
          id="navigation_bar.polarisierung"
          defaultMessage="Polarisierung erkunden"
        />
      </span>
    </NavLink>
    <NavLink className="column-link column-link--transparent" to="/awareness">
      <Icon className="column-link__icon" id="lightbulb-o" fixedWidth />
      <span className={props.showLabelOnHover ? 'show-on-hover' : null}>
        <FormattedMessage
          id="navigation_bar.awareness"
          defaultMessage="Awareness"
        />
      </span>
    </NavLink>

    {showTrends && <div className="flex-spacer" />}
    {showTrends && <TrendsContainer />}
  </div>
);

NavigationPanel.propTypes = {
  showLabelOnHover: PropTypes.bool,
};

export default withRouter(NavigationPanel);
