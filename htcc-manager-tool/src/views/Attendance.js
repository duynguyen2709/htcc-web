import React from 'react';
import TableAttendance from '../components/Table/Attendance';
import moment from 'moment';
import CalendarTool from '../components/Tool/CalendarTool';
import {Badge, Modal, Table, Tabs, Tooltip} from 'antd';
import * as _ from 'lodash';
import {FileProtectOutlined, FileTextTwoTone, HistoryOutlined,} from '@ant-design/icons';
import ApprovalAttendance from './ApprovalAttendance';
import {buildColsDetailHistoryCheckin, buildColsHistoryCheckin, MONTHS,} from '../constant/colTable';
import {addKeyPropsToTable, isLeapYear} from '../utils/dataTable';
import {checkinApi} from '../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../utils/notifier';
import {Button} from 'reactstrap';
import {connect} from 'react-redux';
import {CSVLink} from 'react-csv';
import {CHECKIN_SUBTYPE} from "../constant/constant";

const {TabPane} = Tabs;

const HEADER = [
    {label: 'Tên đăng nhập', key: 'username'},
    {label: 'Ngày điểm danh', key: 'checkInDate'},
    {label: 'Thời gian', key: 'checkInTime'},
    {label: 'Loại điểm danh', key: 'type'},
    {label: 'Hình thức điểm danh', key: 'subType'},
    {label: 'Tên ca', key: 'shiftName'},
    {label: 'Thời gian ca', key: 'shiftTime'},
    {label: 'Chi nhánh', key: 'officeId'},
    {label: 'Đúng giờ hay không', key: 'isOnTime'},
    {label: 'Lý do', key: 'reason'},
    {label: 'Người duyệt', key: 'approver'},
    {label: 'Trạng thái duyệt', key: 'status'},
];

class Attendance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataResolved: null,
            dataNotResolve: null,
            columns: [],
            month: moment(new Date()),
            currTab: 'approval',
            dataHistorCheckin: [],
            showDetail: false,
            dataDetail: [],
            csvData: [],
        };

        this.dataResolved = [];
        this.dataNotResolve = [];
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const {month} = this.state;

        this.getListApprovedCheckin(month.format('YYYYMM'));
        this.getListPendingCheckin(month.format('YYYYMM'));
    };

    getListApprovedCheckin = (yyyyMM) => {
        checkinApi
            .getListApprovedCheckin(yyyyMM)
            .then((res) => {
                if (res.returnCode === 1) {
                    const data = this.parseDataHistoryCheckin(
                        res.data.detailMap
                    );
                    const csvData = this.buildDataExport(data);

                    this.setState({
                        dataHistorCheckin: data,
                        csvData: csvData,
                    });
                } else {
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                store.addNotification(
                    createNotify('danger', JSON.stringify(err))
                );
            });
    };

    parseDataHistoryCheckin = (data) => {
        const result = [];
        const months = MONTHS;
        const month = this.state.month.month();

        if (isLeapYear(this.state.month.year())) {
            months[2] = 29;
        }

        _.forEach(_.keys(data), (elem) => {
            const item = {
                username: elem,
            };

            for (let i = 1; i <= months[month]; i++) {
                let day = i;

                if (_.floor(i / 10) === 0) {
                    day = `0${i}`;
                }

                const key = `${this.state.month.format('YYYYMM')}${day}`;
                item[day] = data[elem][key];
            }

            result.push(item);
        });

        return result;
    };

    mapData = (data) => {
        //type
        if (data['type'] === 1) {
            data['type'] = 'Vào ca';
        } else {
            data['type'] = 'Tan ca';
        }

        //subType
        data['subType'] = CHECKIN_SUBTYPE[data['subType']];

        //isOntime
        if (data['isOnTime']) {
            data['isOnTime'] = 'Đúng giờ';
        } else {
            data['isOnTime'] = 'Trễ giờ';
        }

        //status
        if (data['status'] === 1) {
            data['status'] = 'Chấp nhận';
        } else if (data['status'] === 0) {
            data['status'] = 'Từ chối';
        } else {
            data['status'] = 'Từ chối';
        }

        return data;
    };

    buildDataExport = (data) => {
        const csvData = [];

        _.forEach(data, (d) => {
            _.forEach(d, (item) => {
                if (typeof o !== 'string') {
                    _.forEach(item, (o) => {
                        if (typeof o !== 'string') {
                            csvData.push(this.mapData(o));
                        }
                    });
                }
            });
        });

        return csvData;
    };

    getListPendingCheckin = (yyyyMM) => {
        checkinApi
            .getListPendingCheckin(yyyyMM)
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
                store.addNotification(
                    createNotify('danger', JSON.stringify(err))
                );
            });
    };

    updateData = (month) => {
        this.setState({
            month,
            dataNotResolve: null,
            dataResolved: null,
            dataHistorCheckin: null,
        });
        this.getListPendingCheckin(month.format('yyyyMM'));
        this.getListApprovedCheckin(month.format('YYYYMM'));
    };

    onChangeTab = (key) => {
        this.setState({
            currTab: key,
        });
    };

    funcHandleOnHover = (key, id) => {
        const actionEye = key === 'on' ? 'remove' : 'add';
        const elemEye = document.getElementById(id);

        if (elemEye) {
            elemEye.classList[actionEye]('hide');
            const actionContent = key === 'out' ? 'remove' : 'add';

            document
                .getElementById(`content-${id}`)
                .classList[actionContent]('cell-blur');
        }
    };

    funcShowDetail = (data, id) => {
        _.map(data, (item, index) => (
            item.uid = `${item.username}_${index}`
        ));

        this.setState({
            showDetail: true,
            dataDetail: data,
        });
        this.funcHandleOnHover('out', id);
    };

    handleCancel = () => {
        this.setState({
            showDetail: false,
            dataDetail: [],
        });
    };

    buildData = (detailList) => {
        const {data} = this.props;
        if (!data || _.isEmpty(data)) {
            return detailList;
        }

        if (detailList) {
            for (let detail of detailList) {
                for (let employee of data.canManageEmployees) {
                    if (_.isEqual(detail.username, employee.username)) {
                        detail.username = `${employee.fullName} (${employee.username})`;
                        break;
                    }
                }
            }
        }

        return detailList;
    };

    render() {
        const {
            dataNotResolve,
            dataResolved,
            month,
            dataHistorCheckin,
            csvData,
        } = this.state;

        return (
            <div className="content">
                <div className="table-wrapper">
                    <Tabs
                        onTabClick={(key) => this.onChangeTab(key)}
                        defaultActiveKey={this.state.currTab}
                        tabBarExtraContent={
                            <div className="header-table clearfix">
                                {_.size(csvData) > 1 && (
                                    <div className="float-right btn-new ml-2">
                                        <Tooltip
                                            placement="bottom"
                                            title={'Xuất file điểm danh'}
                                        >
                                            <CSVLink
                                                data={csvData}
                                                headers={HEADER}
                                                filename={`checkin-${month.format(
                                                    'MM-YYYY'
                                                )}.csv`}
                                            >
                                                <FileTextTwoTone/>
                                            </CSVLink>
                                        </Tooltip>
                                    </div>
                                )}
                                <div className="tool-calendar float-right">
                                    <CalendarTool update={this.updateData}/>
                                </div>
                                <Badge
                                    style={{marginRight: 20}}
                                    status="success"
                                    text="Vào ca đúng giờ"
                                />
                                <Badge
                                    style={{marginRight: 20}}
                                    status="processing"
                                    text="Tan ca đúng giờ"
                                />
                                <Badge
                                    style={{marginRight: 50}}
                                    status="red"
                                    text="Điểm danh trễ"
                                />
                            </div>
                        }
                    >
                        <TabPane
                            style={{overflow: 'auto'}}
                            tab={
                                <span>
                                    <FileProtectOutlined/>
                                    Đơn phê duyệt
                                </span>
                            }
                            key="approval"
                        >
                            <div className="table-edit">
                                <div className="table-small table-complaint">
                                    <ApprovalAttendance
                                        dataNotResolve={dataNotResolve}
                                        dataResolved={dataResolved}
                                        refreshFunc={this.getData}
                                    />
                                </div>
                            </div>
                        </TabPane>
                        <TabPane
                            style={{overflow: 'auto'}}
                            tab={
                                <span>
                                    <HistoryOutlined/>
                                    Lịch sử điểm danh
                                </span>
                            }
                            key="history"
                        >
                            <div className="table-edit">
                                <div className="table-small table-complaint">
                                    <TableAttendance
                                        data={this.buildData(dataHistorCheckin)}
                                        columns={buildColsHistoryCheckin(
                                            month,
                                            this.funcHandleOnHover,
                                            this.funcShowDetail
                                        )}
                                    />
                                </div>
                            </div>
                            <div>
                                <Modal
                                    className="modal-detail-checkin "
                                    title="Chi tiết lịch sử chấm công"
                                    visible={this.state.showDetail}
                                    onCancel={this.handleCancel}
                                    footer={[
                                        <Button
                                            key={"button-close"}
                                            className="btn-custom"
                                            color="primary"
                                            type="button"
                                            onClick={this.handleCancel}
                                        >
                                            Đóng
                                        </Button>,
                                    ]}
                                >
                                    <Table rowKey={"checkInId"}
                                           columns={buildColsDetailHistoryCheckin()}
                                           dataSource={this.state.dataDetail}
                                           pagination={false}
                                           scroll={{
                                               y: 'calc(100vh - 450px)',
                                           }}
                                    />
                                </Modal>
                            </div>
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

export default connect(mapStateToProps, null)(Attendance);
