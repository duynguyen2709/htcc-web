import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PerfectScrollbar from 'perfect-scrollbar';
import * as _ from 'lodash';
import Navbar from '../components/Navbars/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import routes from '../routes';
import logo from '../assets/img/logo.png';
import AuthRequiredRoute from '../components/AuthRequiredRoute';

var ps;

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: 'blue',
            sidebarOpened:
                document.documentElement.className.indexOf('nav-open') !== -1,
        };
    }

    componentDidMount() {
        if (navigator.platform.indexOf('Win') > -1) {
            document.documentElement.className += ' perfect-scrollbar-on';
            document.documentElement.classList.remove('perfect-scrollbar-off');
            ps = new PerfectScrollbar(this.refs.mainPanel, {
                suppressScrollX: true,
            });
            let tables = document.querySelectorAll('.table-responsive');
            for (let i = 0; i < tables.length; i++) {
                ps = new PerfectScrollbar(tables[i]);
            }
        }
    }

    componentWillUnmount() {
        if (navigator.platform.indexOf('Win') > -1) {
            ps.destroy();
            document.documentElement.className += ' perfect-scrollbar-off';
            document.documentElement.classList.remove('perfect-scrollbar-on');
        }
    }

    componentDidUpdate(e) {
        if (e.history.action === 'PUSH') {
            if (navigator.platform.indexOf('Win') > -1) {
                let tables = document.querySelectorAll('.table-responsive');
                for (let i = 0; i < tables.length; i++) {
                    ps = new PerfectScrollbar(tables[i]);
                }
            }
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
            this.refs.mainPanel.scrollTop = 0;
        }

        const sidebarClasses = document.getElementById('sidebar').classList;
        if (sidebarClasses.value.includes('sidebar-minimized')) {
            const listContents = document.getElementsByClassName('content');

            _.forEach(listContents, (item) => {
                item.classList.add('content-expand');
            });
        }
    }

    // this function opens and closes the sidebar on small devices
    toggleSidebar = () => {
        document.documentElement.classList.toggle('nav-open');
        this.setState({ sidebarOpened: !this.state.sidebarOpened });
    };

    getRoutes = (listRoutes) => {
        return listRoutes.map((prop, key) => {
            if (prop.layout === '/') {
                if (_.isEmpty(prop.childs)) {
                    return (
                        <Route
                            path={prop.path}
                            component={prop.component}
                            key={key}
                        />
                    );
                }
                return this.getRoutes(prop.childs);
            } else {
                return null;
            }
        });
    };

    handleBgClick = (color) => {
        this.setState({ backgroundColor: color });
    };

    getBrandText = (path, routes = []) => {
        for (let i = 0; i < routes.length; i++) {
            if (!_.isEmpty(routes[i].childs)) {
                return this.getBrandText(path, routes[i].childs);
            } else if (
                this.props.location.pathname.indexOf(routes[i].path) !== -1
            ) {
                return routes[i].brand;
            }
        }
        return '';
    };

    switchSideBar = (state) => {
        const action = state ? 'add' : 'remove';
        const listContents = document.getElementsByClassName('content');
        const listMenuItems = document.getElementsByClassName('menu-item');

        _.forEach(listContents, (item) => {
            item.classList[action]('content-expand');
        });

        _.forEach(listMenuItems, (item) => {
            item.classList[action]('hide');
        });

        document
            .getElementById('sidebar')
            .classList[action]('sidebar-minimized');
    };

    render() {
        return (
            <>
                <div className="app wrapper">
                    <Sidebar
                        {...this.props}
                        routes={routes}
                        bgColor={this.state.backgroundColor}
                        logo={{
                            outterLink: 'https://www.creative-tim.com/',
                            text: 'Creative Tim',
                            imgSrc: logo,
                        }}
                        toggleSidebar={this.toggleSidebar}
                    />
                    <div
                        className="main-panel"
                        ref="mainPanel"
                        data={this.state.backgroundColor}
                    >
                        <Navbar
                            {...this.props}
                            brandText={this.getBrandText(
                                this.props.location.pathname,
                                routes
                            )}
                            toggleSidebar={this.toggleSidebar}
                            sidebarOpened={this.state.sidebarOpened}
                            switchSideBar={this.switchSideBar}
                        />
                        <Switch>
                            <AuthRequiredRoute>
                                {this.getRoutes(routes)}
                            </AuthRequiredRoute>
                        </Switch>
                    </div>
                </div>
            </>
        );
    }
}

export default Admin;
