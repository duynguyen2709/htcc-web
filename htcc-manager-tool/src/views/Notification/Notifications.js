import React from 'react';
import { List, Avatar, Tag, Space, Input } from 'antd';
import SelectBox from '../../components/Tool/SelectBox';
import {
    BranchesOutlined,
    ClockCircleOutlined,
    BellOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { notiApi } from '../../api';
import ReactLoading from 'react-loading';
import CalendarTool from '../../components/Tool/CalendarTool';
import moment from 'moment';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import * as _ from 'lodash';

const { Search } = Input;
const DATE_FORMAT = 'yyyyMMDD';

const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

class Notifications extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listNoti: [],
            isLoading: true,
            type: 1,
            officeId: '',
            currDate: moment(new Date()).format(DATE_FORMAT),
            user: {},
        };
        this.listNoti = [];

        this.getType = this.getType.bind(this);
        this.getUsername = this.getUsername.bind(this);
        this.getOfficeId = this.getOfficeId.bind(this);
    }

    componentDidMount() {
        this.getData(this.state.currDate);
    }

    // yyyyMMDD
    getData = (date) => {
        this.setState({
            isLoading: true,
        });

        notiApi
            .getNotifications(date)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.listNoti = res.data;
                    this.setState({
                        listNoti: this.filterData(),
                        isLoading: false,
                    });
                } else {
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                this.setState({
                    isLoading: false,
                });

                store.addNotification(
                    createNotify('danger', 'Hệ thống đang có lỗi')
                );
            });
    };

    componentWillReceiveProps(nextProps, nextState) {
        if (
            !_.isEmpty(nextProps.data) &&
            !_.isEqual(nextProps.data, this.props.data)
        ) {
            this.setState({
                user: _.get(
                    nextProps.data.canManageEmployees[0],
                    'username',
                    ''
                ),
                officeId: nextProps.data.canManageOffices[0],
            });
        }
    }

    filterData = () => {
        const { type, officeId, user } = this.state;
        let data = this.listNoti;

        if (type === 3) {
            data = _.filter(this.listNoti, (item) =>
                _.isEqual(item.officeId, officeId)
            );
        } else if (type === 2) {
            data = _.filter(this.listNoti, (item) =>
                _.isEqual(item.username, user)
            );
        }

        return data;
    };

    updateDate = (value) => {
        if (!_.isEqual(value.format(DATE_FORMAT), this.state.currDate)) {
            this.setState(
                {
                    listNoti: [],
                    isLoading: true,
                    currDate: value.format(DATE_FORMAT),
                },
                () => {
                    this.getData(value.format(DATE_FORMAT));
                }
            );
        }
    };

    onSearch = (e) => {
        const data = _.filter(this.listNoti, (ele) =>
            JSON.stringify(ele)
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
        );

        this.setState({
            listNoti: data,
        });
    };

    getOfficeId = (id) => {
        if (id !== this.state.officeId) {
            this.setState(
                {
                    officeId: id,
                },
                () => {
                    this.setState({
                        listNoti: this.filterData(),
                    });
                }
            );
        }
    };

    getUsername = (key) => {
        if (key !== this.state.username) {
            this.setState(
                {
                    user: key,
                },
                () => {
                    this.setState({
                        listNoti: this.filterData(),
                    });
                }
            );
        }
    };

    getType = (type) => {
        if (type !== this.state.type) {
            this.setState({
                type: type,
                listNoti: type === 1 ? this.listNoti : this.state.listNoti,
            });
        }
    };

    mapDataUser = (data) => {
        return _.map(data, (i) => {
            return {
                key: i.username,
                value: i.username,
            };
        });
    };

    renderOption = () => {
        const { type } = this.state;
        const { data = {} } = this.props;

        switch (type) {
            case 3:
                return (
                    <div className="float-left ml-2" style={{ width: 170 }}>
                        <SelectBox
                            key={'branch' + this.state.type}
                            options={data.canManageOffices}
                            returnValue={this.getOfficeId}
                            placeholder={'Chọn chi nhánh'}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="float-left ml-2" style={{ width: 170 }}>
                        <SelectBox
                            key={'employee' + data.canManageEmployees}
                            options={this.mapDataUser(data.canManageEmployees)}
                            returnValue={this.getUsername}
                            placeholder={'Chọn nhân viên'}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    render() {
        const { listNoti } = this.state;

        return (
            <React.Fragment>
                <div className="header-table clearfix">
                    <div className="float-left">
                        <Search
                            className="form-control bor-radius"
                            placeholder="Tìm kiếm nhanh"
                            style={{ width: 300 }}
                            onChange={this.onSearch}
                        />
                    </div>
                    <div className="float-left ml-2">
                        <SelectBox
                            options={[
                                {
                                    key: 1,
                                    value: 'Toàn công ty',
                                },
                                {
                                    key: 2,
                                    value: 'Nhân viên',
                                },
                                {
                                    key: 3,
                                    value: 'Chi nhánh',
                                },
                            ]}
                            returnValue={(value) => this.getType(value)}
                            placeholder={'Chọn loại lọc'}
                        />
                    </div>
                    {this.renderOption()}
                    <div className="tool-calendar float-left ml-2">
                        <CalendarTool
                            picker="date"
                            format={'DD-MM-YYYY'}
                            update={this.updateDate}
                        />
                    </div>
                </div>
                {this.state.isLoading ? (
                    <ReactLoading
                        type={'spinningBubbles'}
                        color={'#4caf50'}
                        className={'center-div'}
                        height={'10%'}
                        width={'10%'}
                    />
                ) : _.isEmpty(listNoti) ? (
                    <div className="col-12 text-center">Không có thông báo</div>
                ) : (
                    <div className="list-noti">
                        <List
                            itemLayout="vertical"
                            size="default"
                            pagination={false}
                            dataSource={listNoti}
                            renderItem={(item) => (
                                <List.Item
                                    key={item.title}
                                    actions={[
                                        <IconText
                                            icon={ClockCircleOutlined}
                                            text={moment
                                                .unix(item.sendTime)
                                                .format('HH:mm')}
                                            key="sendTime"
                                        />,
                                        <IconText
                                            icon={UserOutlined}
                                            text={
                                                <span>
                                                    {item.sender} &#8594;{' '}
                                                    {item.username}
                                                </span>
                                            }
                                            key="sender"
                                        />,
                                        <IconText
                                            icon={BranchesOutlined}
                                            text={item.officeId}
                                            key="officeId"
                                        />,
                                        <IconText
                                            icon={BellOutlined}
                                            text={
                                                item.status === 0 ? (
                                                    <Tag color="red">
                                                        Gửi thất bại
                                                    </Tag>
                                                ) : item.status === 1 ? (
                                                    <Tag color="green">
                                                        Đã gửi
                                                    </Tag>
                                                ) : (
                                                    <Tag color="default">
                                                        Đang gửi
                                                    </Tag>
                                                )
                                            }
                                            key="satus"
                                        />,
                                    ]}
                                    extra={
                                        item.receiverType === 1 ? (
                                            <Tag color="geekblue">
                                                Toàn công ty
                                            </Tag>
                                        ) : item.status === 2 ? (
                                            <Tag color="geekblue">
                                                Nhân viên
                                            </Tag>
                                        ) : (
                                            <Tag color="geekblue">
                                                Chi nhánh
                                            </Tag>
                                        )
                                    }
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.iconUrl} />}
                                        title={item.title}
                                        description={<i>{item.content}</i>}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
