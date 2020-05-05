import React, { Component } from 'react';
import { Tabs } from 'antd';
import { InsertRowAboveOutlined, ToolOutlined } from '@ant-design/icons';
import CalendarView from '../components/WorkingDay/CalendarView';
import Branch from '../components/Company/Branch';
import { connect } from 'react-redux';

const { TabPane } = Tabs;

class WorkingDay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listData: [],
            currentOffices: '',
        };
    }

    getList = () => {};

    changeTab = (key) => {
        this.setState({
            updateMap: key === 'map',
        });
    };

    render() {
        const { data = {} } = this.props;
        const { currentOffices } = this.state;

        return (
            <div className="content">
                <div className="table-wrapper tabs-big">
                    <Tabs
                        defaultActiveKey="view"
                        onChange={(key) => this.changeTab(key)}
                    >
                        <TabPane
                            tab={
                                <span>
                                    <ToolOutlined />
                                    Thiết lập
                                </span>
                            }
                            key="config"
                        >
                            <Branch />
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                    <InsertRowAboveOutlined />
                                    Lịch
                                </span>
                            }
                            key="view"
                        >
                            <CalendarView
                                optionsOffices={data.canManageOffices}
                                currentOffices={'CAMPUS'}
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
