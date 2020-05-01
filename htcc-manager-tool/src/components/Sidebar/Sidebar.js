import React from 'react';
import { NavLink } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import PerfectScrollbar from 'perfect-scrollbar';
import { Nav } from 'reactstrap';
import NumberNotify from '../Tool/NumberNotify';
import Dropdown from '../Tool/Dropdown';
import { homeApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { getDataHome } from '../../reducers/home.reducer';

var ps;

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.activeRoute.bind(this);
    }

    // verifies if routeName is the one active (in browser input)
    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1
            ? 'active'
            : '';
    }

    componentDidMount() {
        if (navigator.platform.indexOf('Win') > -1) {
            ps = new PerfectScrollbar(this.refs.sidebar, {
                suppressScrollX: true,
                suppressScrollY: false,
            });
        }
    }

    componentWillUnmount() {
        if (navigator.platform.indexOf('Win') > -1) {
            ps.destroy();
        }
    }

    linkOnClick = () => {
        document.documentElement.classList.remove('nav-open');
    };

    renderNotification = (name) => {
        const { pendingLeavingRequest, pendingComplaint } = this.props.data || {
            pendingLeavingRequest: 0,
            pendingComplaint: 0,
        };

        switch (name) {
            case 'Khiếu Nại':
                return <NumberNotify value={pendingComplaint} />;
            case 'Nghỉ Phép':
                return <NumberNotify value={pendingLeavingRequest} />;
            default:
                return null;
        }
    };

    renderMenuItem = (prop, key) => {
        const { canManageOffices } = this.props.data || [];
        const list = {
            canManageOffices: canManageOffices,
        };

        if (!_.isEmpty(prop.childs)) {
            if (!_.isEmpty(list[prop.id])) {
                return (
                    <React.Fragment>
                        <li
                            className={
                                this.activeRoute(prop.path) +
                                (prop.pro ? ' active-pro' : '')
                            }
                            key={key}
                        >
                            <Dropdown
                                toggleSidebar={this.props.toggleSidebar}
                                classes={prop.id}
                                items={prop.childs}
                                prop={prop}
                                activeRoute={this.activeRoute}
                            />
                        </li>
                    </React.Fragment>
                );
            }

            return null;
        }

        return (
            <li
                className={
                    this.activeRoute(prop.path) +
                    (prop.pro ? ' active-pro' : '')
                }
                key={`${key}-${prop.path}`}
            >
                <NavLink
                    to={prop.path}
                    className="nav-link"
                    activeClassName="active"
                    onClick={this.props.toggleSidebar}
                >
                    <i className={prop.icon} id={prop.id} />
                    <p className="menu-item">{prop.name}</p>
                    {this.renderNotification(prop.name)}
                </NavLink>
            </li>
        );
    };

    render() {
        const { bgColor, routes, logo, data, getDataHome } = this.props;
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

        if (_.isEmpty(data)) {
            getDataHome();
        }

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
                            return this.renderMenuItem(prop, key);
                        })}
                    </Nav>
                </div>
            </div>
        );
    }
}

Sidebar.defaultProps = {
    bgColor: 'primary',
    routes: [{}],
};

Sidebar.propTypes = {
    bgColor: PropTypes.oneOf(['primary', 'blue', 'green']),
    routes: PropTypes.arrayOf(PropTypes.object),
    logo: PropTypes.shape({
        innerLink: PropTypes.string,
        outterLink: PropTypes.string,
        text: PropTypes.node,
        imgSrc: PropTypes.string,
    }),
};

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

const mapDispatchToProps = (dispatch) => ({
    getDataHome: () => dispatch(getDataHome()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
