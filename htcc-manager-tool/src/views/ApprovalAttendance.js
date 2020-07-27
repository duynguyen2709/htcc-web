import React, { Component } from 'react';
import { Table, Tabs, Tooltip } from 'antd';
import {
    CheckSquareOutlined,
    WarningOutlined,
    PlusSquareOutlined,
} from '@ant-design/icons';
import * as _ from 'lodash';
import { buildColsApprovalAttendance } from '../constant/colTable';
import moment from 'moment';
import FormEditStatusCheckinRequest from '../components/Form/FormEditStatusCheckinRequest';
import FormAddCheckinRequest from '../components/Form/FormAddCheckinRequest';
import {connect} from 'react-redux';
import AsyncModal from '../components/Modal/AsyncModal';
import {canDoAction} from "../utils/permission";
import {ACTION, ROLE_GROUP_KEY} from "../constant/constant";
import ReactLoading from "react-loading";

const { TabPane } = Tabs;

class ApprovalAttendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataResolved: props.dataResolved,
            dataNotResolve: props.dataNotResolved,
            curRecordEdit: null,
            currDate: moment(new Date()).format('YYYYMM'),
            currTab: 'NotResolve',
            showModal: false,
            mode: 'new',
        };
        this.dataResolved = [];
        this.dataNotResolve = [];
    }

    toggle = (submit = false) => {
        this.setState({
            showModal: !this.state.showModal,
            curRecordEdit: null,
        });

        if (submit) {
            this.setState({
                dataResolved: null,
                dataNotResolve: null,
            });
            this.props.refreshFunc();
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
                    this.getListApprovedCheckin(value.format('YYYYMM'));
                }
            );
        }
    };

    componentWillReceiveProps(nextProps, nextState) {
        if (
            !_.isEqual(nextProps.dataResolved, this.state.dataResolved) ||
            !_.isEqual(nextProps.dataNotResolve, this.state.dataNotResolve)
        ) {
            this.setState({
                dataNotResolve: nextProps.dataNotResolve,
                dataResolved: nextProps.dataResolved,
            });
        }
    }

    mapData = (data) => {
        return _.map(data, (item) => ({
            key: item.checkInId,
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
        } = this.state;

        if (!dataResolved || !dataNotResolve) {
            return (
                <ReactLoading
                    type={'spinningBubbles'}
                    color={'#4caf50'}
                    className={'center-div'}
                    height={'10%'}
                    width={'10%'}
                />
            );
        }

        const canAdd = canDoAction(this.props.data, ROLE_GROUP_KEY.CHECKIN, ACTION.CREATE);
        const canUpdate = canDoAction(this.props.data, ROLE_GROUP_KEY.CHECKIN, ACTION.UPDATE);

        return (
            <div>
                <Tabs
                    onTabClick={(key) => this.onChangeTab(key)}
                    defaultActiveKey={this.state.currTab}
                    type="card"
                    tabBarExtraContent={canAdd ?
                        <div className="float-right btn-new">
                            <Tooltip
                                placement="left"
                                title={'Tạo yêu cầu điểm danh'}
                            >
                                <PlusSquareOutlined
                                    onClick={() => {
                                        this.setState({
                                            mode: 'new',
                                        });
                                        this.toggle(false);
                                    }}
                                />
                            </Tooltip>
                        </div> : null
                    }
                >
                    <TabPane
                        style={{ overflow: 'auto' }}
                        tab={
                            <span>
                                <WarningOutlined />
                                Chưa xử lý
                            </span>
                        }
                        key="NotResolve"
                    >
                        <div className="table-edit">
                            <div className="table-small table-complaint">
                                <Table
                                    columns={buildColsApprovalAttendance(
                                        this.handleEditStatus,
                                        canUpdate
                                    )}
                                    dataSource={dataNotResolve}
                                    scroll={{
                                        x: 1300,
                                        y: 'calc(100vh - 420px)',
                                    }}
                                    loading={dataResolved === null}
                                    pagination={{
                                        hideOnSinglePage: true,
                                        pageSize: 6,
                                    }}
                                />
                            </div>
                        </div>
                    </TabPane>
                    <TabPane
                        style={{ overflow: 'auto' }}
                        tab={
                            <span>
                                <CheckSquareOutlined />
                                Đã xử lý
                            </span>
                        }
                        key="Resolved"
                    >
                        <div className="table-edit">
                            <div className="table-small table-complaint">
                                <Table
                                    columns={buildColsApprovalAttendance(
                                        this.handleEditStatus,
                                        canUpdate,
                                        [
                                            {
                                                title: 'Người duyệt',
                                                dataIndex: 'approver',
                                                width: '150px',
                                            },
                                            {
                                                title: 'Lý do',
                                                dataIndex: 'reason',
                                                width: '150px',
                                            },
                                        ]
                                    )}
                                    dataSource={dataResolved}
                                    scroll={{
                                        x: 1300,
                                        y: 'calc(100vh - 420px)',
                                    }}
                                    loading={dataResolved === null}
                                    pagination={{
                                        hideOnSinglePage: true,
                                        pageSize: 6,
                                    }}
                                />
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
                {((mode === 'new' && canAdd) || (mode === 'edit' && canUpdate)) ?
                <div>
                    <AsyncModal
                        key={curRecordEdit}
                        reload={false}
                        CompomentContent={
                            mode === 'new'
                                ? FormAddCheckinRequest
                                : FormEditStatusCheckinRequest
                        }
                        visible={showModal}
                        toggle={(submit) => this.toggle(submit)}
                        title={
                            mode === 'new'
                                ? 'Tạo yêu cầu điểm danh'
                                : 'Xử lý yêu cầu điểm danh'
                        }
                        data={curRecordEdit}
                        mode={mode}
                        currDate={currDate}
                    />
                </div> : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data
});

export default connect(mapStateToProps, null)(ApprovalAttendance);
