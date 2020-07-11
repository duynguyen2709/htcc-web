import React from 'react';
import {Avatar, Empty, Input, List, Space, Tag} from 'antd';
import SelectBox from '../../components/Tool/SelectBox';
import {BellOutlined, BranchesOutlined, ClockCircleOutlined, PlusOutlined, UserOutlined,} from '@ant-design/icons';
import {connect} from 'react-redux';
import {notiApi} from '../../api';
import ReactLoading from 'react-loading';
import CalendarTool from '../../components/Tool/CalendarTool';
import moment from 'moment';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import * as _ from 'lodash';
import {USER} from "../../constant/localStorageKey";
import AsyncModal from "../../components/Modal/AsyncModal";
import FormSendNotification from "../../components/Form/FormSendNotification";
import {Button, CardFooter} from "reactstrap";
import {canDoAction} from "../../utils/permission";
import {ACTION, ROLE_GROUP_KEY} from "../../constant/constant";

const {Search} = Input;
const DATE_FORMAT = 'yyyyMMDD';

const IconText = ({icon, text}) => (
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
            showModal: false,
            isLoading: true,
            type: 1,
            officeId: '',
            currDate: moment(new Date()).format(DATE_FORMAT),
            user: {},

            // load more
            hasMore: true,
            index: 0,
        };

        this.listNoti = [];

        this.getType = this.getType.bind(this);
        this.getUsername = this.getUsername.bind(this);
        this.getOfficeId = this.getOfficeId.bind(this);
    }

    componentDidMount() {
        this.getData(this.state.currDate);
    }

    disabledDate = (current) => {
        return current && current > moment().endOf('day');
    };

    toggle = async (submit = false) => {
        this.setState({
            showModal: !this.state.showModal
        });

        if (submit) {
            await new Promise(r => setTimeout(r, 2000));

            this.reloadData(this.state.currDate);
        }
    };

    openModal = () => {
        this.setState({
            showModal: true,
        })
    };


    // yyyyMMDD
    getData = async (date) => {
        this.setState({
            isLoading: true,
        });

        while (true) {
            let {index, hasMore} = this.state;

            await notiApi
                .getNotifications(date, index)
                .then((res) => {
                    if (res.returnCode === 1) {
                        index = index + 1;
                        hasMore = (res.data.length >= 20);

                        this.listNoti = this.listNoti.concat(res.data);
                        this.setState({
                            listNoti: this.filterData(),
                        });
                    } else {
                        hasMore = false;
                        store.addNotification(
                            createNotify('danger', res.returnMessage)
                        );
                    }
                })
                .catch((err) => {
                    hasMore = false;
                    store.addNotification(
                        createNotify('danger', 'Hệ thống đang có lỗi')
                    );
                })
                .finally(() => {
                    this.setState({
                        index: index,
                        hasMore: hasMore,
                    });
                });

            if (!hasMore) {
                break;
            }
        }

        this.setState({
            isLoading: false,
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
        const {type, officeId, user} = this.state;
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

    reloadData = (newDate) => {
        this.listNoti = [];

        this.setState(
            {
                listNoti: [],
                isLoading: true,
                currDate: newDate,
                // load more
                hasMore: true,
                index: 0,
            },
            () => {
                this.getData(newDate);
            }
        );
    };

    updateDate = (value) => {
        if (!_.isEqual(value.format(DATE_FORMAT), this.state.currDate)) {
            this.reloadData(value.format(DATE_FORMAT));
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
        const {type} = this.state;
        const {data = {}} = this.props;

        switch (type) {
            case 3:
                return (
                    <div className="float-left ml-2" style={{width: 170}}>
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
                    <div className="float-left ml-2" style={{width: 170}}>
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
        const {listNoti, showModal} = this.state;
        const user = JSON.parse(localStorage.getItem(USER));

        const canAdd = canDoAction(this.props.data, ROLE_GROUP_KEY.NOTIFICATION, ACTION.CREATE);

        return (
            <>
                <div className="header-table clearfix">
                    <div className="float-left">
                        <Search
                            className="form-control bor-radius"
                            placeholder="Tìm kiếm nhanh"
                            style={{width: 300}}
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
                            disabledDate={this.disabledDate}
                            picker="date"
                            format={'DD-MM-YYYY'}
                            update={this.updateDate}
                        />
                    </div>
                    {canAdd ?
                        <div className="float-right">
                            <CardFooter className="text-right info" style={{marginRight: '20px'}}>
                                <Button
                                    className="btn-custom"
                                    color="primary"
                                    type="button"
                                    onClick={this.openModal}
                                >
                                    <PlusOutlined style={{display: 'inline', margin: '5px 10px 0 0',}}/>
                                    <span className="btn-save-text"> Gửi thông báo </span>
                                </Button>
                            </CardFooter>
                        </div> : null}
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
                    <div className="col-12 text-center">
                        <Empty
                            style={{marginTop: '50px'}}
                            description={
                                <span style={{color: 'rgba(0, 0, 0, 0.65)'}}>
                                    Không có thông báo
                                </span>}
                        />
                    </div>
                ) : (
                    <div className="list-noti">
                        <List
                            itemLayout="vertical"
                            size="default"
                            pagination={false}
                            dataSource={listNoti}
                            renderItem={(item) => (
                                <List.Item
                                    style={{paddingLeft: '20px'}}
                                    key={item.title}
                                    actions={[
                                        <IconText
                                            icon={ClockCircleOutlined}
                                            text={moment(item.sendTime)
                                                .format('HH:mm')}
                                            key="sendTime"
                                        />,
                                        <IconText
                                            icon={UserOutlined}
                                            text={
                                                <span>
                                                    {item.sender !== user.username ? item.sender : null} &#8594;{' '}
                                                    {item.fullName} ({item.username})
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
                                                ) : item.status === 0 ? (
                                                    <Tag color="red">
                                                        Gửi thất bại
                                                    </Tag>
                                                ) : (
                                                    <Tag color="volcano">
                                                        Đang gửi
                                                    </Tag>
                                                )
                                            }
                                            key="status"
                                        />,
                                    ]}
                                    extra={
                                        item.receiverType === 1 ? (
                                            <Tag color="geekblue">
                                                Toàn công ty
                                            </Tag>
                                        ) : item.receiverType === 2 ? (
                                            <Tag color="blue">
                                                Nhân viên
                                            </Tag>
                                        ) : item.receiverType === 3 ? (
                                            <Tag color="purple">
                                                Chi nhánh
                                            </Tag>
                                        ) : null
                                    }
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.iconUrl}/>}
                                        title={item.title}
                                        description={<i>{item.content}</i>}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                )}
                {canAdd ?
                    <AsyncModal
                        key={'notification'}
                        reload={false}
                        CompomentContent={FormSendNotification}
                        visible={showModal}
                        toggle={(submit) => this.toggle(submit)}
                        title={'Gửi thông báo mới'}
                        mode={'new'}
                    /> : null}
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

export default connect(mapStateToProps, null)(Notifications);
