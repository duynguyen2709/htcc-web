import React from 'react';
import classNames from 'classnames';
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal
} from 'reactstrap';
import UserProfile from '../../views/UserProfile';
import { removeUserFromLocalStorage } from '../../utils/user';
class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      modalSearch: false,
      color: 'navbar-transparent',
      openSidebarOnlyIcon: false,
      modalProfile: false
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateColor);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateColor);
  }

  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: 'bg-white'
      });
    } else {
      this.setState({
        color: 'navbar-transparent'
      });
    }
  };

  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: 'navbar-transparent'
      });
    } else {
      this.setState({
        color: 'bg-white'
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };

  switchSideBar = () => {
    this.setState(
      {
        openSidebarOnlyIcon: !this.state.openSidebarOnlyIcon
      },
      () => {
        this.props.switchSideBar(this.state.openSidebarOnlyIcon);
      }
    );
  };

  logout = () => {
    removeUserFromLocalStorage();
  };

  toggle = id => {
    this.setState({
      [id]: !this.state[id]
    });
  };

  render() {
    const { openSidebarOnlyIcon } = this.state;

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
                  ></i>
                </button>
              </div>
              <div
                className={classNames('navbar-toggle d-inline', {
                  toggled: this.props.sidebarOpened
                })}
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
              <NavbarBrand href="#pablo" onClick={e => e.preventDefault()}>
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
                <InputGroup className="search-bar">
                  <Button
                    color="link"
                    data-target="#searchModal"
                    data-toggle="modal"
                    id="search-button"
                    onClick={() => this.toggle('modalSearch')}
                  >
                    <i className="tim-icons icon-zoom-split" />
                    <span className="d-lg-none d-md-block">Tìm kiếm</span>
                  </Button>
                </InputGroup>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                  >
                    <div className="notification d-none d-lg-block d-xl-block" />
                    <i className="tim-icons icon-bell-55" />
                    <p className="d-lg-none">Notifications</p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">
                        Mike John responded to your email
                      </DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                    onClick={e => e.preventDefault()}
                  >
                    <div className="photo">
                      <img
                        alt="..."
                        src={require('../../assets/img/avatar.png')}
                      />
                    </div>
                    <b className="caret d-none d-lg-block d-xl-block" />
                    <p className="d-lg-none">Log out</p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <DropdownItem
                        onClick={() => this.toggle('modalProfile')}
                        className="nav-item"
                      >
                        Tài khoản của bạn
                      </DropdownItem>
                    </NavLink>
                    <DropdownItem divider tag="li" />
                    <NavLink tag="li">
                      <DropdownItem onClick={this.logout} className="nav-item">
                        Thoát
                      </DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <li className="separator d-lg-none" />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <Modal
          modalClassName="modal-search"
          isOpen={this.state.modalSearch}
          toggle={() => this.toggle('modalSearch')}
        >
          <div className="modal-header">
            <Input
              id="inlineFormInputGroup"
              placeholder="Tìm kiếm"
              type="text"
            />
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggle('modalSearch')}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
        </Modal>
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

export default AdminNavbar;
