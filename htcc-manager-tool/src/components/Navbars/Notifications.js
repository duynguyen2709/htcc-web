import React from 'react';
import { List, message, Avatar, Spin } from 'antd';
import { notiApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import { CheckOutlined } from '@ant-design/icons';
import * as _ from 'lodash';
import { updateDataHome } from '../../reducers/home.reducer';
import { connect } from 'react-redux';

const DEFAULT_ICON = require('../../assets/img/default_noti.png');

class Notifications extends React.Component {
    state = {
        data: [],
        loading: false,
        hasMore: true,
    };

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        this.setState({
            isLoading: true,
        });

        notiApi
            .getNotificationsBell()
            .then((res) => {
                if (res.returnCode === 1) {
                    const listUnread = _.filter(
                        res.data,
                        (noti) => !noti.hasRead
                    );
                    const payload = {
                        name: 'unreadNotifications',
                        data: _.size(listUnread),
                    };

                    this.setState({
                        data: res.data,
                    });
                    this.props.updateDataHome(payload);
                } else {
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                store.addNotification(
                    createNotify('danger', 'Hệ thống đang có lỗi')
                );
            })
            .finally(() => {
                this.setState({
                    isLoading: false,
                });
            });
    };

    handleInfiniteOnLoad = () => {
        let { data } = this.state;
        this.setState({
            loading: true,
        });
        if (data.length > 14) {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.fetchData((res) => {
            data = data.concat(res.results);
            this.setState({
                data,
                loading: false,
            });
        });
    };

    updateOneNoti = (item) => {
        if (item.hasRead) {
            return;
        }

        this.updateById(item.notiId);
    };

    updateById = (notiId) => {
        notiApi
            .updateNoti(notiId)
            .then((res) => {
                let ids = this.state.data;

                if (!_.isEmpty(notiId)) {
                    ids = [
                        {
                            notiId: notiId,
                        },
                    ];
                }

                this.updateUI(ids);
            })
            .catch((err) => {
                store.addNotification(
                    createNotify('danger', 'Hệ thống đang có lỗi')
                );
            });
    };

    updateUI = (ids = []) => {
        const { data } = this.state;
        const { data: dataProps = {} } = this.props;
        const payload = {
            name: 'unreadNotifications',
            data: dataProps.unreadNotifications - _.size(ids),
        };

        _.forEach(ids, (elem) => {
            const index = _.findIndex(
                data,
                (item) => item.notiId === elem.notiId && !item.hasRead
            );
            if (index > -1) {
                _.set(data, `[${index}].hasRead`, true);
            }
        });

        this.setState({
            data: data,
        });

        this.props.updateDataHome(payload);
    };

    updateAllnoti = () => {
        this.updateById(null);
    };

    buildDateTimeNoti = (date, time) => {
        const result = moment(`${date} ${time}`, 'DD/MM/YYYY HH:mm')
            .startOf('hour')
            .fromNow();
        return <span style={{ fontSize: 11 }}>{result}</span>;
    };

    render() {
        const { data: dataProps = {} } = this.props;

        return (
            <div className="demo-infinite-container text-right">
                {dataProps.unreadNotifications > 0 && (
                    <CheckOutlined
                        onClick={this.updateAllnoti}
                        style={{
                            marginRight: 10,
                        }}
                        className="clearfix"
                    />
                )}
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                >
                    <List
                        className="list-noti-bell clearfix text-left"
                        dataSource={this.state.data}
                        renderItem={(item) => (
                            <List.Item key={item.notiId}>
                                <List.Item.Meta
                                    onClick={() => this.updateOneNoti(item)}
                                    className={
                                        item.hasRead ? 'has-read' : 'not-read'
                                    }
                                    avatar={
                                        <Avatar
                                            src={
                                                item.iconUrl
                                                    ? item.iconUrl
                                                    : DEFAULT_ICON
                                            }
                                        />
                                    }
                                    title={item.title}
                                    description={
                                        <div>
                                            <p className="text-dark description">
                                                {item.content}
                                            </p>
                                            {this.buildDateTimeNoti(
                                                item.date,
                                                item.time
                                            )}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    >
                        {this.state.loading && this.state.hasMore && (
                            <div className="demo-loading-container">
                                <Spin />
                            </div>
                        )}
                    </List>
                </InfiniteScroll>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

const mapDispatchToProps = (dispatch) => ({
    updateDataHome: (payload) => dispatch(updateDataHome(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
