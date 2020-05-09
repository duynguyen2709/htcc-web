import React, { Component } from 'react';
import { Tabs, Table, Input } from 'antd';
import { WarningOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { complaintApi } from '../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../utils/notifier';
import * as _ from 'lodash';
import { buildColsComplaint } from '../constant/colTable';
import moment from 'moment';
import CalendarTool from '../components/Tool/CalendarTool';
import FormEditStatusComplaint from '../components/Form/FormEditStatusComplaint';
import AsyncModal from '../components/Modal/AsyncModal';
import { addKeyPropsToTable } from '../utils/dataTable';

const { Search } = Input;
const { TabPane } = Tabs;

class Complaint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataResolved: null,
            dataNotResolve: null,
            showFormEdit: false,
            curRecordEdit: null,
            currDate: moment(new Date()).format('YYYYMM'),
            isLoading: true,
            currTab: 'NotResolve',
            onlyView: false,
        };
        this.dataResolved = [];
        this.dataNotResolve = [];
    }

    toggle = (isLoading = false) => {
        this.setState({
            showFormEdit: !this.state.showFormEdit,
            isLoading,
            curRecordEdit: null,
        });
    };

    onChangeTab = (key) => {
        this.setState({
            currTab: key,
        });
    };

    handleEditStatus = (record, onlyView = false) => {
        this.setState({
            showFormEdit: true,
            curRecordEdit: record,
            onlyView: onlyView,
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
                    this.getListComplaint(value.format('YYYYMM'));
                }
            );
        }
    };

    componentDidMount() {
        this.getListComplaint(this.state.currDate);
    }

    getListComplaint = (month) => {
        complaintApi
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

                    dataResolved = addKeyPropsToTable(
                        'dataResolved',
                        dataResolved
                    );
                    dataNotResolve = addKeyPropsToTable(
                        'dataResolved',
                        dataNotResolve
                    );

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

    onSearch = (e) => {
        const { currTab } = this.state;

        const data = _.filter(this[`data${currTab}`], (ele) =>
            JSON.stringify(ele).includes(e.target.value)
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
            showFormEdit,
            curRecordEdit,
            currDate,
            onlyView,
        } = this.state;

        return (
            <div className="content">
                <div className="table-wrapper tabs-small">
                    <div className="header-table clearfix">
                        <div className="float-left">
                            <Search
                                className="form-control bor-radius"
                                placeholder="Tìm kiếm nhanh"
                                style={{ width: 300 }}
                                onChange={this.onSearch}
                            />
                        </div>
                        <div className="tool-calendar float-right">
                            <CalendarTool update={this.updateData} />
                        </div>
                    </div>
                    <Tabs
                        onTabClick={(key) => this.onChangeTab(key)}
                        defaultActiveKey={this.state.currTab}
                    >
                        <TabPane
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
                                        columns={buildColsComplaint(
                                            this.handleEditStatus
                                        )}
                                        dataSource={dataNotResolve}
                                        scroll={{
                                            x: 1300,
                                            y: 'calc(100vh - 355px)',
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
                                        columns={buildColsComplaint(
                                            this.handleEditStatus
                                        )}
                                        dataSource={dataResolved}
                                        scroll={{
                                            x: 1300,
                                            y: 'calc(100vh - 355px)',
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
                    <div>
                        <AsyncModal
                            CompomentContent={FormEditStatusComplaint}
                            visible={showFormEdit}
                            toggle={this.toggle}
                            title={'Thông tin khiếu nại'}
                            data={curRecordEdit}
                            mode={'edit'}
                            currDate={currDate}
                            key={curRecordEdit}
                            onlyView={onlyView}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Complaint;
