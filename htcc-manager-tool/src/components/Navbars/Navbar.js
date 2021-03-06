import React from 'react';
import classNames from 'classnames';
import {
    Collapse,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    NavbarBrand,
    Navbar,
    NavLink,
    Nav,
    Container,
    Modal,
} from 'reactstrap';
import { logout } from '../../reducers/auth.reducer';
import { connect } from 'react-redux';
import UserProfile from '../../views/UserProfile';
import AsyncModal from '../Modal/AsyncModal';
import FormChangePass from '../Form/FormChangePass';
import { ERROR_IMAGE } from '../../constant/constant';
import Notifications from './Notifications';

class AdminNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseOpen: false,
            modalSearch: false,
            color: 'navbar-transparent',
            openSidebarOnlyIcon: false,
            modalProfile: false,
            modalChangePass: false,
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateColor);
    }

    // function that adds color white/transparent to the navbar on resize (this is for the collapse)
    updateColor = () => {
        if (window.innerWidth < 993 && this.state.collapseOpen) {
            this.setState({
                color: 'bg-white',
            });
        } else {
            this.setState({
                color: 'navbar-transparent',
            });
        }
    };

    // this function opens and closes the collapse on small devices
    toggleCollapse = () => {
        if (this.state.collapseOpen) {
            this.setState({
                color: 'navbar-transparent',
            });
        } else {
            this.setState({
                color: 'bg-white',
            });
        }
        this.setState({
            collapseOpen: !this.state.collapseOpen,
        });
    };

    switchSideBar = () => {
        this.setState(
            {
                openSidebarOnlyIcon: !this.state.openSidebarOnlyIcon,
            },
            () => {
                this.props.switchSideBar(this.state.openSidebarOnlyIcon);
            }
        );
    };

    logout = () => {
        this.props.logout();
    };

    toggle = (id) => {
        this.setState({
            [id]: !this.state[id],
        });
    };

    render() {
        const { openSidebarOnlyIcon } = this.state;
        const { user = {}, data = {} } = this.props;

        return (
            <>
                <Navbar
                    className={classNames('navbar-absolute', this.state.color)}
                    expand="lg"
                >
                    <Container fluid>
                        <div className="navbar-wrapper">
                            <div className="navbar-minimize d-inline">
                                <button
                                    type="button"
                                    id="tooltip209599"
                                    className="minimize-sidebar btn-just-icon btn btn-link"
                                    onClick={this.switchSideBar}
                                >
                                    <i
                                        className={
                                            openSidebarOnlyIcon
                                                ? 'icon-bullet-list-67 tim-icons'
                                                : 'icon-align-center tim-icons'
                                        }
                                    />
                                </button>
                            </div>
                            <div
                                className={classNames(
                                    'navbar-toggle d-inline',
                                    {
                                        toggled: this.props.sidebarOpened,
                                    }
                                )}
                            >
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    onClick={this.props.toggleSidebar}
                                >
                                    <span className="navbar-toggler-bar bar1" />
                                    <span className="navbar-toggler-bar bar2" />
                                    <span className="navbar-toggler-bar bar3" />
                                </button>
                            </div>
                            <NavbarBrand
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                            >
                                {this.props.brandText}
                            </NavbarBrand>
                        </div>
                        <button
                            aria-expanded={false}
                            aria-label="Toggle navigation"
                            className="navbar-toggler"
                            data-target="#navigation"
                            data-toggle="collapse"
                            id="navigation"
                            type="button"
                            onClick={this.toggleCollapse}
                        >
                            <span className="navbar-toggler-bar navbar-kebab" />
                            <span className="navbar-toggler-bar navbar-kebab" />
                            <span className="navbar-toggler-bar navbar-kebab" />
                        </button>
                        <Collapse navbar isOpen={this.state.collapseOpen}>
                            <Nav className="ml-auto" navbar>
                                <UncontrolledDropdown nav>
                                    <DropdownToggle
                                        caret
                                        color="default"
                                        data-toggle="dropdown"
                                        nav
                                    >
                                        {data.unreadNotifications > 0 && (
                                            <div className="notification d-none d-lg-block d-xl-block">
                                                {data.unreadNotifications > 10
                                                    ? '10+'
                                                    : data.unreadNotifications}
                                            </div>
                                        )}
                                        <i className="tim-icons icon-bell-55" />
                                    </DropdownToggle>
                                    <DropdownMenu
                                        className="dropdown-navbar"
                                        right
                                        tag="ul"
                                    >
                                        <Notifications data={data} />
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <UncontrolledDropdown nav>
                                    <DropdownToggle
                                        caret
                                        color="default"
                                        data-toggle="dropdown"
                                        nav
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <div className="photo">
                                            <img
                                                alt="..."
                                                src={
                                                    user
                                                        ? user.avatar
                                                        : ERROR_IMAGE
                                                }
                                            />
                                        </div>
                                        <b className="caret d-none d-lg-block d-xl-block" />
                                        <p className="d-lg-none">Log out</p>
                                    </DropdownToggle>
                                    <DropdownMenu
                                        className="dropdown-navbar"
                                        right
                                        tag="ul"
                                    >
                                        <NavLink tag="li">
                                            <DropdownItem
                                                onClick={() =>
                                                    this.toggle('modalProfile')
                                                }
                                                className="nav-item"
                                            >
                                                Tài khoản của bạn
                                            </DropdownItem>
                                        </NavLink>
                                        <DropdownItem divider tag="li" />
                                        <NavLink tag="li">
                                            <DropdownItem
                                                onClick={() =>
                                                    this.toggle(
                                                        'modalChangePass'
                                                    )
                                                }
                                                className="nav-item"
                                            >
                                                Đổi mật khẩu
                                            </DropdownItem>
                                        </NavLink>
                                        <DropdownItem divider tag="li" />
                                        <NavLink tag="li">
                                            <DropdownItem
                                                onClick={this.logout}
                                                className="nav-item"
                                            >
                                                Đăng xuất
                                            </DropdownItem>
                                        </NavLink>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <li className="separator d-lg-none" />
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
                {/* <Modal
                    toggle={() => this.toggle('modalChangePass')}
                    isOpen={this.state.modalChangePass}
                >
                    <FormChangePass toggle={this.toggle} />
                </Modal> */}
                <div>
                    <AsyncModal
                        key={this.state.modalChangePass}
                        reload={false}
                        CompomentContent={FormChangePass}
                        visible={this.state.modalChangePass}
                        toggle={(submit) =>
                            this.toggle('modalChangePass', submit)
                        }
                        title={'Thay đổi mật khẩu'}
                        data={null}
                        mode={'new'}
                    />
                </div>
                <Modal
                    toggle={() => this.toggle('modalProfile')}
                    modalClassName="modal-profile"
                    isOpen={this.state.modalProfile}
                >
                    <UserProfile toggle={this.toggle} />
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.authReducer.user,
    data: state.homeReducer.data,
});

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminNavbar);
