import React from 'react';
import TableAttendance from '../components/Table/Attendance';
import moment from 'moment';
import CalendarTool from '../components/Tool/CalendarTool';
import {Badge, Modal, Table, Tabs} from 'antd';
import * as _ from 'lodash';
import {FileProtectOutlined, HistoryOutlined} from '@ant-design/icons';
import ApprovalAttendance from './ApprovalAttendance';
import {buildColsDetailHistoryCheckin, buildColsHistoryCheckin, MONTHS,} from '../constant/colTable';
import {addKeyPropsToTable, isLeapYear} from '../utils/dataTable';
import {checkinApi} from '../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../utils/notifier';
import {Button} from 'reactstrap';
import {connect} from 'react-redux';

const {TabPane} = Tabs;

class Attendance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataResolved: null,
            dataNotResolve: null,
            columns: [],
            month: moment('202006', 'YYYYMM'),
            currTab: 'approval',
            dataHistorCheckin: [],
            showDetail: false,
            dataDetail: [],
        };

        this.dataResolved = [];
        this.dataNotResolve = [];
    }

    componentDidMount() {
        const {month} = this.state;

        this.getListApprovedCheckin(month.format('202006'));
        this.getListPendingCheckin(month.format('202006'));
    }

    getListApprovedCheckin = (yyyyMM) => {
        checkinApi
            .getListApprovedCheckin(yyyyMM)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        dataHistorCheckin: this.parseDataHistoryCheckin(
                            res.data.detailMap
                        ),
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
        });
        this.getListPendingCheckin(month.format('yyyyMM'));
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
        console.log('data', data);
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

        for (let detail of detailList) {
            for (let employee of data.canManageEmployees) {
                if (_.isEqual(detail.username, employee.username)) {
                    detail.username = `${employee.fullName} (${employee.username})`;
                    break;
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
        } = this.state;

        return (
            <div className="content">
                <div className="table-wrapper">
                    <Tabs
                        onTabClick={(key) => this.onChangeTab(key)}
                        defaultActiveKey={this.state.currTab}
                        tabBarExtraContent={
                            <div className="header-table clearfix">
                                <div className="tool-calendar float-right">
                                    <CalendarTool update={this.updateData}/>
                                </div>
                                <Badge
                                    style={{marginRight: 20}}
                                    status="success"
                                    text="Điểm danh đúng giờ"
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
                                            className="btn-custom"
                                            color="primary"
                                            type="button"
                                            onClick={this.handleCancel}
                                        >
                                            Đóng
                                        </Button>,
                                    ]}
                                >
                                    <Table
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
    data: state.homeReducer.data
});

export default connect(mapStateToProps, null)(Attendance);
