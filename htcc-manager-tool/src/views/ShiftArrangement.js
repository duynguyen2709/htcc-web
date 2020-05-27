import React, {Component} from 'react';
import {Col, DatePicker, Row, Tabs} from 'antd';
import {CalendarOutlined, CarryOutOutlined} from '@ant-design/icons';
import moment from 'moment';
import * as _ from 'lodash';
import {shiftArrangement} from '../api';
import {store} from "react-notifications-component";
import {createNotify} from "../utils/notifier";
import ShiftByDateArrangement from "../components/ShiftArrangement/ShiftByDateArrangement";
import ReactLoading from "react-loading";
import FixedShiftArrangement from "../components/ShiftArrangement/FixedShiftArrangement";

const {TabPane} = Tabs;

class ShiftArrangement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fixedShiftList: [],
            shiftByDateList: [],
            canManageEmployees: [],

            isLoading: false,
            currentWeek: new moment(new Date())
        };

        this.removeShiftArrangement = this.removeShiftArrangement.bind(this);
    }

    componentDidMount() {
        this.getShiftArrangement();
    }

    toggleLoading = () => {
        this.setState({
            isLoading: !this.state.isLoading
        })
    };

    getShiftArrangement = () => {
        const {currentWeek} = this.state;
        const year = currentWeek.year();
        const week = currentWeek.week();

        let fixedShiftList = [];
        let shiftByDateList = [];
        let canManageEmployees = [];

        this.toggleLoading();

        shiftArrangement
            .getShiftArrangement(year, week)
            .then((res) => {
                if (res.returnCode === 1) {
                    fixedShiftList = res.data.fixedShiftList;
                    shiftByDateList = res.data.shiftByDateList;
                    canManageEmployees = res.data.canManageEmployees;
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
            }).finally(() => {
            this.setState({
                fixedShiftList: fixedShiftList,
                shiftByDateList: shiftByDateList,
                canManageEmployees: canManageEmployees,
            });

            this.toggleLoading();
        })
    };

    onChangeWeek = (date, dateString) => {
        const newWeek = date.week();
        const newYear = date.year();
        const {currentWeek} = this.state;

        if (newWeek === currentWeek.week() &&
            newYear === currentWeek.year()) {
            return;
        }

        const self = this;
        this.setState({
            currentWeek: date
        }, () => {
            self.getShiftArrangement();
        })
    };

    disableDate = (current) => {
        return current && current.month() - (new moment(new Date())).month() > 1
    };

    removeShiftArrangement = (type, arrangeId) => {
        if (type === 2) {
            const arr = arrangeId.split("-");
            const date = arr[0];
            const officeId = arr[2];
            const shiftId = arr[3];

            const shiftByDateList = [...this.state.shiftByDateList];
            for (let office of shiftByDateList) {
                if (_.isEqual(office.officeId, officeId)) {
                    for (let shift of office.shiftDetailList) {
                        if (_.isEqual(shift.shiftId, shiftId)) {
                            for (let d of shift.detailList) {
                                if (_.isEqual(d.date, date)) {
                                    d.employeeList = d.employeeList.filter(item => item.arrangeId !== arrangeId);
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            this.setState({
                shiftByDateList: shiftByDateList
            })
        }

        if (type === 1) {
            const fixedShiftList = [...this.state.fixedShiftList];
            for (let office of fixedShiftList) {
                for (let shift of office.shiftDetailList) {
                    for (let d of shift.detailList) {
                        d.employeeList = d.employeeList.filter(item => item.arrangeId !== arrangeId);
                    }
                }
            }

            this.setState({
                fixedShiftList: fixedShiftList
            })
        }
    };

    render() {
        const {
            currentWeek, fixedShiftList, shiftByDateList,
            canManageEmployees, isLoading
        } = this.state;

        return (
            <div className="content">
                <div className="table-wrapper tabs-big">
                    {isLoading ?
                        <ReactLoading
                            type={'spinningBubbles'}
                            color={'#4caf50'}
                            className={"center-div"}
                            height={'10%'}
                            width={'10%'}
                        />
                        : <>
                            <div className="header-table clearfix">
                                <Row>
                                    <h4 style={{margin: 'auto 10px'}}>Tuần : </h4>
                                    <Col span={4} style={{margin: 'auto 0px'}}>
                                        <DatePicker onChange={this.onChangeWeek}
                                                    format={"WW-YYYY"}
                                                    value={currentWeek}
                                                    disabledDate={this.disableDate}
                                                    allowClear={false}
                                                    style={{width: '100%', margin: 'auto 0px'}}
                                                    picker="week"/>
                                    </Col>
                                </Row>
                            </div>
                            <Row style={{
                                marginTop: '10px'
                            }}>
                                <Col span={24}>
                                    <Tabs defaultActiveKey="fixed-shift">
                                        <TabPane
                                            style={{overflow: 'auto', marginTop: '-8px'}}
                                            tab={<span><CalendarOutlined/>Ca cố định</span>}
                                            key="fixed-shift"
                                        >
                                            <FixedShiftArrangement data={fixedShiftList}
                                                                   employeeList={canManageEmployees}
                                                                   reload={this.getShiftArrangement}
                                                                   removeShiftArrangement={this.removeShiftArrangement}
                                            />
                                        </TabPane>
                                        <TabPane
                                            style={{overflow: 'auto', marginTop: '-8px'}}
                                            tab={<span><CarryOutOutlined/>Ca linh động</span>}
                                            key="day-shift"
                                        >
                                            <ShiftByDateArrangement data={shiftByDateList}
                                                                    employeeList={canManageEmployees}
                                                                    reload={this.getShiftArrangement}
                                                                    removeShiftArrangement={this.removeShiftArrangement}
                                            />
                                        </TabPane>
                                    </Tabs>
                                </Col>
                            </Row>
                        </>}
                </div>
            </div>
        );
    }
}

export default ShiftArrangement;
