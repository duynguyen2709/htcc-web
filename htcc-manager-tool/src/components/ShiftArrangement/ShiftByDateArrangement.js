import React, {Component} from 'react';
import {Avatar, Button, Col, Collapse, Empty, Popconfirm, Row, Tabs} from 'antd';
import {DeleteOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {shiftArrangement} from '../../api';
import * as _ from 'lodash';
import moment from 'moment';
import EmployeeInfoCard from "./EmployeeInfoCard";
import {store} from "react-notifications-component";
import {createNotify} from "../../utils/notifier";
import ReactLoading from "react-loading";

const {TabPane} = Tabs;
const {Panel} = Collapse;

class ShiftByDateArrangement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employeeList: this.props.employeeList,
            isLoading: false
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!_.isEqual(this.props.employeeList, nextProps.employeeList)) {
            this.setState({
                employeeList: nextProps.employeeList
            }, () => this.convertEmployeeListToMap())
        }
    }

    componentWillMount() {
        this.convertEmployeeListToMap();
    }

    toggleLoading = () => {
        this.setState({
            isLoading: !this.state.isLoading
        })
    };

    convertEmployeeListToMap = () => {
        const {employeeList} = this.state;

        const employeeMap = new Map();
        for (let employee of employeeList) {
            employeeMap.set(employee.username, employee);
        }

        this.employeeMap = employeeMap;
    };

    renderListOffice = (data) => {
        return (_.map(data, (item) => (
            <TabPane
                className={"shift-office"}
                style={{overflow: 'auto'}}
                tab={
                    <span>{item.officeId}</span>
                }
                key={item.officeId}
                size={"small"}
            >
                <Tabs type={"card"}>
                    {this.renderListShiftDetail(item.shiftDetailList)}
                </Tabs>
            </TabPane>
        )));
    };

    renderListShiftDetail = (shiftDetailList) => {
        return (_.map(shiftDetailList, (item) => (
            <TabPane
                className={"shift-detail"}
                style={{overflow: 'auto'}}
                tab={`${item.shiftName} (${item.shiftTime})`}
                key={item.shiftId}
                size={"small"}
            >
                {this.renderDetailList(item.detailList)}
            </TabPane>
        )));
    };

    renderDetailList = (detailList) => {
        return (<Tabs tabPosition={"left"} className={"shift-list-date-detail"}>
            {_.map(detailList, (item) => (
                <TabPane
                    className={"shift-date-detail"}
                    style={{overflow: 'auto'}}
                    tab={_.upperFirst(moment(item.date, "YYYYMMDD").format('dddd, DD/MM/YYYY'))}
                    key={item.date}
                    size={"small"}
                >
                    {this.renderEmployeeList(item.employeeList)}
                </TabPane>
            ))}
        </Tabs>);
    };

    renderEmployeeList = (employeeList) => {
        if (this.state.isLoading) {
            return <ReactLoading
                type={'spinningBubbles'}
                color={'#4caf50'}
                className={"center-div"}
                height={'10%'}
                width={'10%'}/>
        }

        if (_.isEmpty(employeeList)) {
            return <Empty
                style={{marginTop: '50px'}}
                description={
                    <span style={{color: 'rgba(0, 0, 0, 0.65)'}}>
                        Không có ca làm việc hôm nay
                    </span>
                }/>
        }

        return (<Row className={"shift-list-employee"}>
            {_.map(employeeList, (item) => {
                    const user = this.employeeMap.get(item.username);
                    return (
                        <Col span={6}
                             key={user.username}
                             className={"shift-employee-card"}
                        >
                            <Collapse defaultActiveKey={[user.username]}>
                                <Panel key={user.username}
                                       showArrow={false}
                                       extra={this.renderButtonDelete(item.arrangeId, user.fullName)}
                                       header={
                                           <>
                                               <Avatar src={user.avatar}/>
                                               <span style={{color: 'rgba(0, 0, 0, 0.75)', marginLeft: '5px'}}>
                                            {user.fullName}
                                        </span>
                                           </>
                                       }>
                                    <EmployeeInfoCard info={user}/>
                                </Panel>
                            </Collapse>
                        </Col>
                    );
                }
            )}
        </Row>);
    };

    renderButtonDelete = (arrangeId, fullName) => {
        const message = `Bạn có chắc xóa nhân viên ${fullName} khỏi ca ?`;
        return (<>
            <Popconfirm
                title={message}
                icon={<QuestionCircleOutlined/>}
                okText="Đồng ý"
                cancelText="Huỷ"
                onConfirm={(event) => {
                    event.stopPropagation();
                    this.deleteShiftArrangement(arrangeId);
                }}
            >
                <Button type="primary" danger
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        icon={<DeleteOutlined/>}
                        size={"small"}
                />
            </Popconfirm>
        </>)
    };

    deleteShiftArrangement = (arrangeId) => {
        const type = 2;

        this.toggleLoading();

        shiftArrangement
            .deleteShiftArrangement(type, arrangeId)
            .then((res) => {
                if (res.returnCode === 1) {
                    store.addNotification(
                        createNotify('default', res.returnMessage)
                    );

                    this.props.removeShiftArrangement(type, arrangeId);
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

            this.toggleLoading();
        })
    };

    render() {
        const {data} = this.props;
        return (
            <Tabs type={"card"} className={"shift-office-list"}>
                {this.renderListOffice(data)}
            </Tabs>
        );
    }
}

export default ShiftByDateArrangement;
