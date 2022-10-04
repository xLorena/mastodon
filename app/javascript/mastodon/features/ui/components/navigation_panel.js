/* eslint-disable jsx-quotes */
import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Icon from 'mastodon/components/icon';
import { profile_directory, showTrends } from 'mastodon/initial_state';
//import NotificationsCounterIcon from './notifications_counter_icon';
import FollowRequestsNavLink from './follow_requests_nav_link';
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
    {/* <NavLink
      className="column-link column-link--transparent"
      to="/notifications"
      data-preview-title-id="column.notifications"
      data-preview-icon="bell"
    >
      <NotificationsCounterIcon className="column-link__icon" />
      <FormattedMessage
        id="tabs_bar.notifications"
        defaultMessage="Notifications"
      />
    </NavLink> */}
    <FollowRequestsNavLink />
    {/* <NavLink
      className="column-link column-link--transparent"
      to="/public/local"
      data-preview-title-id="column.community"
      data-preview-icon="users"
    >
      <Icon className="column-link__icon" id="users" fixedWidth />
      <span className={props.showLabelOnHover ? 'show-on-hover' : null}>
        <FormattedMessage id="tabs_bar.local_timeline" defaultMessage="Local" />
      </span>
    </NavLink>
    <NavLink
      className="column-link column-link--transparent"
      exact
      to="/public"
      data-preview-title-id="column.public"
      data-preview-icon="globe"
    >
      <Icon className="column-link__icon" id="globe" fixedWidth />
      <span className={props.showLabelOnHover ? 'show-on-hover' : null}>
        <FormattedMessage
          id="tabs_bar.federated_timeline"
          defaultMessage="Federated"
        />
      </span>
    </NavLink> */}
    {/* <NavLink
      className="column-link column-link--transparent"
      to="/conversations"
    >
      <Icon className="column-link__icon" id="envelope" fixedWidth />
      <FormattedMessage
        id="navigation_bar.direct"
        defaultMessage="Direct messages"
      />
    </NavLink> */}
    {/* <NavLink className="column-link column-link--transparent" to="/favourites">
      <Icon className="column-link__icon" id="star" fixedWidth />
      <FormattedMessage
        id="navigation_bar.favourites"
        defaultMessage="Favourites"
      />
    </NavLink> */}
    {/* <NavLink className="column-link column-link--transparent" to="/bookmarks">
      <Icon className="column-link__icon" id="bookmark" fixedWidth />
      <FormattedMessage
        id="navigation_bar.bookmarks"
        defaultMessage="Bookmarks"
      />
    </NavLink> */}
    {/* <NavLink className="column-link column-link--transparent" to="/lists">
      <Icon className="column-link__icon" id="list-ul" fixedWidth />
      <FormattedMessage id="navigation_bar.lists" defaultMessage="Lists" />
    </NavLink> */}
    {/* ________________________________________________________________ */}
    {/* <NavLink
      className="column-link column-link--transparent"
      to="/newsfeed-compare"
    >
      <Icon className="column-link__icon" id="columns" fixedWidth />
      <FormattedMessage
        id="navigation_bar.newsfeed-vergleich"
        defaultMessage="Newsfeed Vergleich"
      />
    </NavLink>
    <NavLink
      className="column-link column-link--transparent"
      to="/polarization"
    >
      <Icon className="column-link__icon" id="user-circle-o" fixedWidth />
      <FormattedMessage
        id="navigation_bar.polarisierung"
        defaultMessage="Polarisierung erkunden"
      />
    </NavLink>
    <NavLink className="column-link column-link--transparent" to="/awareness">
      <Icon className="column-link__icon" id="lightbulb-o" fixedWidth />
      <FormattedMessage
        id="navigation_bar.awareness"
        defaultMessage="Awareness"
      />
    </NavLink>*/}
    {profile_directory && (
      <NavLink className="column-link column-link--transparent" to="/directory">
        <Icon className="column-link__icon" id="address-book-o" fixedWidth />
        <span className={props.showLabelOnHover ? 'show-on-hover' : null}>
          <FormattedMessage
            id="getting_started.directory"
            defaultMessage="Profile directory"
          />
        </span>
      </NavLink>
    )}

    <ListPanel />

    <hr />

    <a
      className="column-link column-link--transparent"
      href="/settings/preferences"
    >
      <Icon className="column-link__icon" id="cog" fixedWidth />
      <span className={props.showLabelOnHover ? 'show-on-hover' : null}>
        <FormattedMessage
          id="navigation_bar.preferences"
          defaultMessage="Preferences"
        />
      </span>
    </a>
    <a className="column-link column-link--transparent" href="/relationships">
      <Icon className="column-link__icon" id="users" fixedWidth />
      <span className={props.showLabelOnHover ? 'show-on-hover' : null}>
        <FormattedMessage
          id="navigation_bar.follows_and_followers"
          defaultMessage="Follows and followers"
        />
      </span>
    </a>

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
