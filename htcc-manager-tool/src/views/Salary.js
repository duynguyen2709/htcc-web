import React, {Component} from 'react';
import {Input, Popconfirm, Table, Tooltip} from 'antd';
import {connect} from 'react-redux';
import {ExclamationCircleTwoTone, LockOutlined,} from '@ant-design/icons';
import {salaryApi} from '../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../utils/notifier';
import * as _ from 'lodash';
import {buildColsSalary} from '../constant/colTable';
import moment from 'moment';
import CalendarTool from '../components/Tool/CalendarTool';
import {canDoAction} from '../utils/permission';
import {ACTION, ROLE_GROUP_KEY} from '../constant/constant';

const {Search} = Input;

class Salary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            curRecordEdit: null,
            currDate: moment(new Date()).format('YYYYMM'),
            isLoading: true,
        };
        this.data = [];
    }

    toggle = (isLoading = false) => {
        this.setState({
            isLoading,
            curRecordEdit: null,
        });

        if (isLoading) {
            this.setState({
                data: null,
            });
            this.data = [];
            this.getData(this.state.currDate);
        }
    };

    handleLock = () => {
        const {data, currDate} = this.state;
        const dataLock = data.filter(ele => ele.status === 0);

        if (_.isEmpty(dataLock)) {
            store.addNotification(
                createNotify('warning', "Không có bảng lương cần chốt")
            );
            return;
        }

        const paySlipIdList = [];
        for (let ele of dataLock) {
            paySlipIdList.push(ele.paySlipId);
        }

        const obj = {
            yyyyMM: currDate,
            paySlipIdList: paySlipIdList,
        };

        this.setState({
            isLoading: true,
        });

        salaryApi
            .lockSalaryLog(obj)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.getData(currDate);
                } else {
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                    this.setState({
                        isLoading: false,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                store.addNotification(
                    createNotify(
                        'danger',
                        'Hệ thống có lỗi. Vui lòng thử lại sau.'
                    )
                );
                this.setState({
                    isLoading: false,
                });
            })
    };

    handleDelete = (paySlipId) => {
        const {currDate} = this.state;

        this.setState({
            isLoading: true,
        });

        salaryApi
            .deleteSalaryLog(currDate, paySlipId)
            .then((res) => {
                if (res.returnCode === 1) {
                    let {data} = this.state;
                    data = data.filter(ele => !_.isEqual(ele.paySlipId, paySlipId));
                    this.setState({
                        data
                    });
                    this.data = data;

                    store.addNotification(
                        createNotify('default', 'Xóa bảng lương thành công')
                    );
                } else {
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                store.addNotification(
                    createNotify(
                        'danger',
                        'Hệ thống có lỗi. Vui lòng thử lại sau.'
                    )
                );
            })
            .finally(() => {
                this.setState({
                    isLoading: false,
                });
            });
    };

    updateData = (value) => {
        if (!_.isEqual(value.format('YYYYMM'), this.state.currDate)) {
            this.setState(
                {
                    data: null,
                    currDate: value.format('YYYYMM'),
                },
                () => {
                    this.getData(value.format('YYYYMM'));
                }
            );
        }
    };

    componentDidMount() {
        this.getData(this.state.currDate);
    }

    getData = (month) => {
        this.setState({
            isLoading: true,
        });

        salaryApi
            .getSalaryLog(month)
            .then((res) => {
                if (res.returnCode === 1) {
                    const data = res.data;
                    console.log(data);
                    this.setState({
                        data
                    });

                    this.data = {...data}
                } else {
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                store.addNotification(
                    createNotify(
                        'danger',
                        'Hệ thống có lỗi. Vui lòng thử lại sau.'
                    )
                );
            })
            .finally(() => {
                this.setState({
                    isLoading: false,
                });
            });
    };

    onSearch = (e) => {
        const data = _.filter(this.data, (ele) =>
            JSON.stringify(ele)
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
        );

        this.setState({
            data: data,
        });
    };

    render() {
        const {
            data,
            isLoading,
        } = this.state;

        const canAdd = canDoAction(
            this.props.data,
            ROLE_GROUP_KEY.SALARY,
            ACTION.CREATE
        );
        const canDelete = canDoAction(
            this.props.data,
            ROLE_GROUP_KEY.SALARY,
            ACTION.DELETE
        );

        return (
            <div className="content">
                <div className="table-wrapper tabs-small">
                    <div className="header-table clearfix">
                        <div className="float-left">
                            <Search
                                className="form-control bor-radius"
                                placeholder="Tìm kiếm nhanh"
                                style={{width: 300}}
                                onChange={this.onSearch}
                            />
                        </div>
                        <div
                            className="tool-calendar float-left"
                            style={{marginLeft: '20px'}}
                        >
                            <CalendarTool update={this.updateData}/>
                        </div>
                        {canAdd ? (
                            <div className="float-right btn-new">
                                <Popconfirm
                                    title={`Bạn chắc chắn chốt bảng lương ? Bảng lương đã chốt không thể thay đổi`}
                                    icon={
                                        <ExclamationCircleTwoTone twoToneColor="#d9534f"/>
                                    }
                                    okText="Đồng ý"
                                    cancelText="Huỷ"
                                    onConfirm={this.handleLock}
                                >
                                    <Tooltip
                                        placement="left"
                                        title={'Chốt bảng lương'}
                                    >
                                        <LockOutlined
                                            style={{
                                                color: '#ff0000',
                                                fontSize: '25px',
                                                float: 'left',
                                                margin: '0 8px',
                                            }}
                                        />
                                    </Tooltip>
                                </Popconfirm>
                            </div>
                        ) : null}
                    </div>
                    <div className="table-edit">
                        <div className="table-small table-complaint">
                            <Table rowKey={"paySlipId"}
                                   columns={buildColsSalary(
                                       this.handleDelete,
                                       canDelete
                                   )}
                                   dataSource={data}
                                   scroll={{
                                       x: 2000,
                                       y: 'calc(100vh - 355px)',
                                   }}
                                   loading={
                                       isLoading || data === null
                                   }
                                   pagination={{
                                       hideOnSinglePage: true,
                                       pageSize: 6,
                                   }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

export default connect(mapStateToProps, null)(Salary);
