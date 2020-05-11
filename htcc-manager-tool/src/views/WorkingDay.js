import React, { Component } from 'react';
import { Tabs } from 'antd';
import { InsertRowAboveOutlined, ToolOutlined } from '@ant-design/icons';
import CalendarView from '../components/WorkingDay/CalendarView';
import Config from '../components/WorkingDay/Config';
import { connect } from 'react-redux';
import * as _ from 'lodash';

const { TabPane } = Tabs;

class WorkingDay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listData: [],
            currentOffices: '',
            refresh: null,
        };
    }

    toggleRefresh = () => {
        let {refresh} = this.state;

        this.setState({
            refresh: !refresh
        })
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const { data: nextData = [] } = nextProps;
        const { data = [] } = this.props;

        if (
            !_.isEmpty(nextData) &&
            !_.isEqual(nextData.canManageOffices, data.canManageOffices)
        ) {
            this.setState({
                currentOffices: nextData.canManageOffices[0],
            });
        }
    }

    getCurrentOffices = (id) => {
        this.setState({
            currentOffices: id,
        });
    };

    render() {
        const { data = {} } = this.props;
        const { currentOffices, refresh } = this.state;

        return (
            <div className="content">
                <div className="table-wrapper tabs-big">
                    <Tabs defaultActiveKey="view">
                        <TabPane
                            style={{overflow: 'auto'}}
                            tab={
                                <span>
                                    <InsertRowAboveOutlined />
                                    Lịch
                                </span>
                            }
                            key="view"
                        >
                            <CalendarView
                                refresh={refresh}
                                key={currentOffices}
                                optionsOffices={data.canManageOffices}
                                currentOffices={currentOffices}
                            />
                        </TabPane>
                        <TabPane
                            style={{overflow: 'auto'}}
                            tab={
                                <span>
                                    <ToolOutlined />
                                    Thiết lập
                                </span>
                            }
                            key="config"
                        >
                            <Config
                                reload={this.toggleRefresh}
                                getCurrentOffices={this.getCurrentOffices}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

export default connect(mapStateToProps)(WorkingDay);
