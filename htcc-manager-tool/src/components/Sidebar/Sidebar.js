import React from 'react';
import { NavLink } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import PerfectScrollbar from 'perfect-scrollbar';
import { Nav } from 'reactstrap';
import NumberNotify from '../Tool/NumberNotify';
import * as _ from 'lodash';
import { complaintApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingComplaint: 0
    };
    this.activeRoute.bind(this);
  }

  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
  }

  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(this.refs.sidebar, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }

    complaintApi
      .getTotal()
      .then(res => {
        if (res.returnCode === 1) {
          this.setState({
            pendingComplaint: res.data.pendingComplaint
          });
        } else {
          store.addNotification(createNotify('danger', res.returnMessage));
        }
      })
      .catch(err => {
        store.addNotification(createNotify('danger', JSON.stringify(err)));
      });
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps.destroy();
    }
  }

  linkOnClick = () => {
    document.documentElement.classList.remove('nav-open');
  };

  render() {
    const { bgColor, routes, logo } = this.props;
    const { pendingComplaint } = this.state;
    const logoImg = (
      <a href="/" className="simple-text logo-mini">
        <div className="logo-img">
          <img src={logo.imgSrc} alt="tool-logo" />
        </div>
      </a>
    );
    const logoText = (
      <div className="simple-text logo-normal">HTCC - Manager</div>
    );

    return (
      <div id="sidebar" className="sidebar" data={bgColor}>
        <div className="sidebar-wrapper" ref="sidebar">
          {logoImg !== null || logoText !== null ? (
            <div className="logo">
              {logoImg}
              {logoText}
            </div>
          ) : null}
          <Nav>
            {routes.map((prop, key) => {
              if (prop.redirect) return null;
              return (
                <li
                  className={
                    this.activeRoute(prop.path) +
                    (prop.pro ? ' active-pro' : '')
                  }
                  key={key}
                >
                  <NavLink
                    to={prop.path}
                    className="nav-link"
                    activeClassName="active"
                    onClick={this.props.toggleSidebar}
                  >
                    <i className={prop.icon} id={prop.id} />
                    <p className="menu-item">{prop.name}</p>
                    {_.isEqual(prop.name, 'Khiếu nại') && (
                      <NumberNotify value={pendingComplaint} />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </Nav>
        </div>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  bgColor: 'primary',
  routes: [{}]
};

Sidebar.propTypes = {
  bgColor: PropTypes.oneOf(['primary', 'blue', 'green']),
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    text: PropTypes.node,
    imgSrc: PropTypes.string
  })
};

export default Sidebar;
