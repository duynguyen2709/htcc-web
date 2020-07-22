import React, {Component} from 'react';
import {Tabs} from 'antd';
import {BellOutlined} from '@ant-design/icons';
import Notifications from './Notifications';

const {TabPane} = Tabs;

class Notification extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
                            style={{overflow: 'auto'}}
                            tab={
                                <span>
                                    <BellOutlined/>
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
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default Notification;
