import React from 'react';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!_.isEqual(nextProps.show, this.state.show)) {
            this.setState({
                show: nextProps.show,
            });
        }
    }

    toggle = () => {
        const {show} = this.state;

        this.setState({
            show: !show,
        });
    };

    render() {
        const {show} = this.state;
        const {items, prop, data} = this.props;

        return (
            <React.Fragment>
                <NavLink
                    to={prop.path}
                    className="nav-link"
                    activeClassName="active"
                    onClick={this.toggle}
                >
                    <i className={prop.icon} id={prop.id}/>
                    <p className="menu-item">{prop.name}</p>
                </NavLink>
                <div
                    className={show ? 'triangle-up' : 'triangle-down'}
                    onClick={this.toggle}
                />
                {_.map(items, (ele, i) => {
                    let canView = true;
                    if (ele.rule) {
                        canView = ele.rule(data);
                    }
                    return (canView ?
                            <span key={`sub-${ele.id}-${i}-${window.location.hash}`}>
                                <NavLink
                                    key={`sub-${ele.id}-${i}-${window.location.hash}`}
                                    to={ele.path}
                                    className={`${ele.class} ${show ? '' : 'hide'}`}
                                    activeClassName="active"
                                    onClick={this.props.toggleSidebar}
                                >
                                    <i className={ele.icon} id={ele.id}/>
                                    <span className="menu-item">
                                        {ele.name}
                                    </span>
                                </NavLink>
                            </span> : null
                    );
                })}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.authReducer.user,
    data: state.homeReducer.data,
});

export default connect(mapStateToProps, null)(Dropdown);
