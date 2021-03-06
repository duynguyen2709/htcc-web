import React, {Component} from 'react';
import {Input, Table, Tabs, Tooltip} from 'antd';
import {connect} from 'react-redux';
import {CheckSquareOutlined, PlusSquareOutlined, WarningOutlined,} from '@ant-design/icons';
import {leaveRequestApi} from '../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../utils/notifier';
import * as _ from 'lodash';
import {buildColsLeaveRequest} from '../constant/colTable';
import moment from 'moment';
import CalendarTool from '../components/Tool/CalendarTool';
import FormEditStatusLeaveRequest from '../components/Form/FormEditStatusLeaveRequest';
import FormAddLeaveRequest from '../components/Form/FormAddLeaveRequest';
import AsyncModal from '../components/Modal/AsyncModal';
import {addKeyPropsToTable} from '../utils/dataTable';
import {canDoAction} from '../utils/permission';
import {ACTION, ROLE_GROUP_KEY} from '../constant/constant';

const {Search} = Input;
const {TabPane} = Tabs;

class LeaveRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataResolved: null,
            dataNotResolve: null,
            curRecordEdit: null,
            currDate: moment(new Date()).format('YYYYMM'),
            isLoading: true,
            currTab: 'NotResolve',
            showModal: false,
            mode: 'new',
        };
        this.dataResolved = [];
        this.dataNotResolve = [];
    }

    toggle = (isLoading = false) => {
        this.setState({
            showModal: !this.state.showModal,
            isLoading,
            curRecordEdit: null,
        });

        if (isLoading) {
            this.setState({
                dataResolved: null,
                dataNotResolve: null,
            });
            this.getListLeavingRequest(this.state.currDate);
        }
    };

    onChangeTab = (key) => {
        this.setState({
            currTab: key,
        });
    };

    handleEditStatus = (record) => {
        this.setState({
            showModal: true,
            curRecordEdit: record,
            mode: 'edit',
        });
    };

    updateData = (value) => {
        if (!_.isEqual(value.format('YYYYMM'), this.state.currDate)) {
            this.setState(
                {
                    dataNotResolve: null,
                    dataResolved: null,
                    currDate: value.format('YYYYMM'),
                },
                () => {
                    this.getListLeavingRequest(value.format('YYYYMM'));
                }
            );
        }
    };

    componentDidMount() {
        this.getListLeavingRequest(this.state.currDate);
    }

    getListLeavingRequest = (month) => {
        leaveRequestApi
            .getList(month)
            .then((res) => {
                if (res.returnCode === 1) {
                    let dataResolved = _.filter(
                        res.data,
                        (item) => item.status !== 2
                    );
                    let dataNotResolve = _.filter(
                        res.data,
                        (item) => item.status === 2
                    );

                    dataResolved = addKeyPropsToTable('', dataResolved);
                    dataNotResolve = addKeyPropsToTable('', dataNotResolve);

                    this.setState({
                        dataNotResolve,
                        dataResolved,
                        isLoading: false,
                    });

                    this.dataNotResolve = dataNotResolve;
                    this.dataResolved = dataResolved;
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
            });
    };

    onSearch = (e) => {
        const {currTab} = this.state;

        const data = _.filter(this[`data${currTab}`], (ele) =>
            JSON.stringify(ele)
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
        );

        this.setState({
            [`data${currTab}`]: data,
        });
    };

    mapData = (data) => {
        return _.map(data, (item) => ({
            key: item.complaintId.toString(),
            ...item,
        }));
    };

    render() {
        const {
            dataResolved,
            dataNotResolve,
            showModal,
            curRecordEdit,
            currDate,
            mode,
            isLoading,
        } = this.state;

        const canAdd = canDoAction(
            this.props.data,
            ROLE_GROUP_KEY.LEAVING_REQUEST,
            ACTION.CREATE
        );
        const canUpdate = canDoAction(
            this.props.data,
            ROLE_GROUP_KEY.LEAVING_REQUEST,
            ACTION.UPDATE
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
                                <Tooltip
                                    placement="left"
                                    title={'Thêm đơn nghỉ phép'}
                                >
                                    <PlusSquareOutlined
                                        onClick={() => {
                                            this.toggle(false);
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        ) : null}
                    </div>
                    <Tabs
                        onTabClick={(key) => this.onChangeTab(key)}
                        defaultActiveKey={this.state.currTab}
                    >
                        <TabPane
                            style={{overflow: 'auto'}}
                            tab={
                                <span>
                                    <WarningOutlined/>
                                    Chưa xử lý
                                </span>
                            }
                            key="NotResolve"
                        >
                            <div className="table-edit">
                                <div className="table-small table-complaint">
                                    <Table
                                        columns={buildColsLeaveRequest(
                                            this.handleEditStatus,
                                            canUpdate
                                        )}
                                        dataSource={dataNotResolve}
                                        scroll={{
                                            x: 1300,
                                            y: 'calc(100vh - 355px)',
                                        }}
                                        loading={
                                            isLoading || dataResolved === null
                                        }
                                        pagination={{
                                            hideOnSinglePage: true,
                                            pageSize: 6,
                                        }}
                                    />
                                </div>
                            </div>
                        </TabPane>
                        <TabPane
                            style={{overflow: 'auto'}}
                            tab={
                                <span>
                                    <CheckSquareOutlined/>
                                    Đã xử lý
                                </span>
                            }
                            key="Resolved"
                        >
                            <div className="table-edit">
                                <div className="table-small table-complaint">
                                    <Table
                                        columns={buildColsLeaveRequest(
                                            this.handleEditStatus,
                                            [
                                                {
                                                    title: 'Người duyệt',
                                                    dataIndex: 'approver',
                                                    width: '150px',
                                                },
                                                {
                                                    title: 'Phản hồi',
                                                    dataIndex: 'response',
                                                    width: '150px',
                                                },
                                            ]
                                        )}
                                        dataSource={dataResolved}
                                        scroll={{
                                            x: 1300,
                                            y: 'calc(100vh - 355px)',
                                        }}
                                        loading={
                                            isLoading || dataResolved === null
                                        }
                                        pagination={{
                                            hideOnSinglePage: true,
                                            pageSize: 6,
                                        }}
                                    />
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    {(mode === 'new' && canAdd) ||
                    (mode === 'edit' && canUpdate) ? (
                        <div>
                            <AsyncModal
                                key={curRecordEdit}
                                reload={false}
                                CompomentContent={
                                    mode === 'new'
                                        ? FormAddLeaveRequest
                                        : FormEditStatusLeaveRequest
                                }
                                visible={showModal}
                                toggle={(submit) => this.toggle(submit)}
                                title={
                                    mode === 'new'
                                        ? 'Tạo đơn nghỉ phép'
                                        : 'Xử lý đơn nghỉ phép'
                                }
                                data={curRecordEdit}
                                mode={mode}
                                currDate={currDate}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

export default connect(mapStateToProps, null)(LeaveRequest);
