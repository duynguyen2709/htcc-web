import React, { Component } from 'react';
import { Tabs } from 'antd';
import { InsertRowAboveOutlined, ToolOutlined } from '@ant-design/icons';
import CalendarView from '../components/WorkingDay/CalendarView';
import Branch from '../components/Company/Branch';

const { TabPane } = Tabs;

class WorkingDay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listData: [],
        };
    }

    getList = () => {};

    changeTab = (key) => {
        this.setState({
            updateMap: key === 'map',
        });
    };

    render() {
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
                                    Tổng quan
                                </span>
                            }
                            key="view"
                        >
                            <CalendarView />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default WorkingDay;
