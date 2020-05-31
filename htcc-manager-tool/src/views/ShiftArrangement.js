import React, {Component} from 'react';
import {Button, Col, DatePicker, Row, Select, Tabs} from 'antd';
import {CalendarOutlined, CarryOutOutlined, MenuUnfoldOutlined} from '@ant-design/icons';
import {Button as ReactStrapButton, CardFooter} from "reactstrap";
import moment from 'moment';
import * as _ from 'lodash';
import {shiftArrangement, shiftTemplate} from '../api';
import {store} from "react-notifications-component";
import {createNotify} from "../utils/notifier";
import ShiftByDateArrangement from "../components/ShiftArrangement/ShiftByDateArrangement";
import ReactLoading from "react-loading";
import FixedShiftArrangement from "../components/ShiftArrangement/FixedShiftArrangement";
import ShiftDetailModal from "../components/Modal/ShiftDetailModal";
import CopyShiftModal from "../components/Modal/CopyShiftModal";

const {TabPane} = Tabs;

class ShiftArrangement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fixedShiftList: [],
            shiftByDateList: [],
            canManageEmployees: [],
            employeeShiftDetailMap: {},

            isLoading: false,
            currentWeek: new moment(new Date()),

            modalShiftDetailVisible: false,
            currentUsernameFilter: '',

            modalCopyShiftVisible: false,
            shiftTemplateList: [],
        };

        this.copyFixedShiftList = [];
        this.copyShiftByDateList = [];

        this.handleOnFilterUsername = this.handleOnFilterUsername.bind(this);
        this.addShiftArrangement = this.addShiftArrangement.bind(this);
        this.removeShiftArrangement = this.removeShiftArrangement.bind(this);
    }

    componentDidMount() {
        this.getShiftArrangement();
        this.getShiftTemplate();
    }

    toggleModalCopyShift = () => {
        this.setState({
            modalCopyShiftVisible: !this.state.modalCopyShiftVisible
        })
    };

    toggleModalShiftDetail = () => {
        this.setState({
            modalShiftDetailVisible: !this.state.modalShiftDetailVisible
        })
    };

    toggleLoading = () => {
        this.setState({
            isLoading: !this.state.isLoading
        })
    };

    handleOnFilterUsername = (username) => {
        if (username === null || _.isEmpty(username)) {
            this.setState({
                currentUsernameFilter: '',
                fixedShiftList: this.copyFixedShiftList,
                shiftByDateList: this.copyShiftByDateList
            });
            return;
        }

        let fixedShiftList = _.cloneDeep(this.copyFixedShiftList);
        let shiftByDateList = _.cloneDeep(this.copyShiftByDateList);

        for (let office of fixedShiftList) {
            for (let shift of office.shiftDetailList) {
                for (let d of shift.detailList) {
                    d.employeeList = d.employeeList.filter(item => _.isEqual(item.username, username));
                }
            }
        }

        for (let office of shiftByDateList) {
            for (let shift of office.shiftDetailList) {
                for (let d of shift.detailList) {
                    d.employeeList = d.employeeList.filter(item => _.isEqual(item.username, username));
                }
            }
        }

        this.setState({
            currentUsernameFilter: username,
            fixedShiftList: fixedShiftList,
            shiftByDateList: shiftByDateList
        });
    };

    getShiftTemplate = () => {
        shiftTemplate
            .getShiftTemplate()
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        shiftTemplateList: res.data
                    })
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

    getShiftArrangement = () => {
        const {currentWeek} = this.state;
        const year = currentWeek.year();
        const week = currentWeek.week();

        let fixedShiftList = [];
        let shiftByDateList = [];
        let canManageEmployees = [];
        let employeeShiftDetailMap = {};

        this.toggleLoading();

        shiftArrangement
            .getShiftArrangement(year, week)
            .then((res) => {
                if (res.returnCode === 1) {
                    fixedShiftList = res.data.fixedShiftList;
                    shiftByDateList = res.data.shiftByDateList;
                    canManageEmployees = res.data.canManageEmployees;
                    employeeShiftDetailMap = res.data.employeeShiftDetailMap;
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
            })
            .finally(() => {
                this.setState({
                    fixedShiftList: fixedShiftList,
                    shiftByDateList: shiftByDateList,
                    canManageEmployees: canManageEmployees,
                    employeeShiftDetailMap: employeeShiftDetailMap,
                });

                this.copyFixedShiftList = fixedShiftList;
                this.copyShiftByDateList = shiftByDateList;

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

    addShiftArrangement = (data) => {
        const {officeId, shiftId, type, username, arrangeId} = data;
        if (type === 2) {
            const date = data.arrangeDate;
            const shiftByDateList = [...this.state.shiftByDateList];
            for (let office of shiftByDateList) {
                if (_.isEqual(office.officeId, officeId)) {
                    for (let shift of office.shiftDetailList) {
                        if (_.isEqual(shift.shiftId, shiftId)) {
                            for (let d of shift.detailList) {
                                if (_.isEqual(d.date, date)) {
                                    const obj = {
                                        type: type,
                                        username: username,
                                        arrangeId: arrangeId
                                    };
                                    d.employeeList = d.employeeList.concat(obj);
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            this.setState({
                shiftByDateList: shiftByDateList
            });

            this.copyShiftByDateList = shiftByDateList;
        }

        if (type === 1) {
            const weekDay = parseInt(data.weekDay);
            const fixedShiftList = [...this.state.fixedShiftList];
            for (let office of fixedShiftList) {
                if (_.isEqual(office.officeId, officeId)) {
                    for (let shift of office.shiftDetailList) {
                        if (_.isEqual(shift.shiftId, shiftId)) {
                            for (let d of shift.detailList) {
                                if (_.isEqual(d.weekDay, weekDay)) {
                                    const obj = {
                                        type: type,
                                        username: username,
                                        arrangeId: arrangeId
                                    };
                                    d.employeeList = d.employeeList.concat(obj);
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            this.setState({
                fixedShiftList: fixedShiftList
            });

            this.copyFixedShiftList = fixedShiftList;
        }
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
            });

            this.copyShiftByDateList = shiftByDateList;
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
            });

            this.copyFixedShiftList = fixedShiftList;
        }
    };

    getModalTitle = (canManageEmployees, currentUsernameFilter) => {
        for (let employee of canManageEmployees) {
            if (_.isEqual(employee.username, currentUsernameFilter)) {
                return `Nhân viên: ${employee.fullName} (${currentUsernameFilter})`;
            }
        }
        return `Nhân viên: ${currentUsernameFilter}`;
    };

    renderCopyShiftButton = () => {
        return (<>
            <CardFooter className="text-right info" style={{marginRight: '10px'}}>
                <ReactStrapButton
                    className="btn-custom"
                    color="primary"
                    type="button"
                    onClick={this.toggleModalCopyShift}
                >
                    <MenuUnfoldOutlined style={{display: 'inline', margin: '5px 10px 0 0',}}/>
                    <span className="btn-save-text"> Sao chép ca </span>
                </ReactStrapButton>
            </CardFooter>
        </>)
    };

    render() {
        const {
            currentWeek, fixedShiftList, shiftByDateList,
            canManageEmployees, isLoading, modalShiftDetailVisible,
            currentUsernameFilter, employeeShiftDetailMap,
            modalCopyShiftVisible, shiftTemplateList
        } = this.state;

        const modalTitle = this.getModalTitle(canManageEmployees, currentUsernameFilter);

        return (
            <div className="content">
                <div className="table-wrapper tabs-big">
                    <CopyShiftModal employeeList={canManageEmployees}
                                    templateList={shiftTemplateList}
                                    toggle={this.toggleModalCopyShift}
                                    visible={modalCopyShiftVisible}
                                    title={'Sao chép ca'}
                    />

                    {employeeShiftDetailMap[currentUsernameFilter] != null ?
                        <ShiftDetailModal data={employeeShiftDetailMap[currentUsernameFilter]}
                                          toggle={this.toggleModalShiftDetail}
                                          visible={modalShiftDetailVisible}
                                          title={modalTitle}
                        /> : null}
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
                                <Row className={"shift-arrangement-header"}>
                                    <h3 style={{
                                        margin: 'auto 10px',
                                        color: 'rgba(0, 0, 0, 0.75)'
                                    }}>
                                        Tuần :
                                    </h3>
                                    <Col span={4} style={{margin: '0px 10px'}}>
                                        <DatePicker onChange={this.onChangeWeek}
                                                    className=" bor-radius"
                                                    format={"WW-YYYY"}
                                                    value={currentWeek}
                                                    disabledDate={this.disableDate}
                                                    allowClear={false}
                                                    style={{width: '100%', margin: '5px 0px'}}
                                                    picker="week"/>
                                    </Col>
                                    <Col offset={1} span={6}>
                                        <Select
                                            allowClear={true}
                                            autoFocus
                                            placeholder={"Tìm theo nhân viên..."}
                                            style={{width: '100%', display: 'flex'}}
                                            className="bor-radius"
                                            onChange={(username) => this.handleOnFilterUsername(username)}
                                        >
                                            {_.map(canManageEmployees, (item) => (
                                                <Select.Option className=" bor-radius"
                                                               value={item.username}
                                                               key={item.username}
                                                >
                                                    {item.fullName} ({item.username})
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col span={2}>
                                        <Button type={"primary"}
                                                className={"bor-radius"}
                                                style={{marginLeft: '10px'}}
                                                onClick={this.toggleModalShiftDetail}
                                                disabled={this.state.currentUsernameFilter === ''}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </Col>
                                    <Col span={4} push={4}>
                                        {this.renderCopyShiftButton()}
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
                                                                   addShiftArrangement={this.addShiftArrangement}
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
                                                                    addShiftArrangement={this.addShiftArrangement}
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
