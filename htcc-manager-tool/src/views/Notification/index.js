import React, { Component } from 'react';
import { Tabs } from 'antd';
import { SendOutlined, BellOutlined } from '@ant-design/icons';
import Notifications from './Notifications';
import SendNotification from './SendNotification';

const { TabPane } = Tabs;

class Notification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            updateMap: false,
            currentTab: 'listNoti',
        };
    }

    onChangeTab = (key) => {
        this.setState({
            currentTab: key,
        });
    };

    render() {
        return (
            <div className="content noti-wrapper">
                <div className="table-wrapper tabs-big">
                    <Tabs
                        defaultActiveKey="listNoti"
                        onChange={this.onChangeTab}
                    >
                        <TabPane
                            tab={
                                <span>
                                    <BellOutlined />
                                    Danh sách thông báo
                                </span>
                            }
                            key={`listNoti`}
                            className="list-noti"
                        >
                            <Notifications
                                key={`listNoti-${this.state.currentTab}`}
                            />
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                    <SendOutlined />
                                    Gửi thông báo
                                </span>
                            }
                            key={`sendNoti`}
                        >
                            <SendNotification
                                key={`sendNoti-${this.state.currentTab}`}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default Notification;
