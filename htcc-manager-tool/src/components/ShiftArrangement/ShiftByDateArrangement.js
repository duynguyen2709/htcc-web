import React, {Component} from 'react';
import {Avatar, Button, Col, Collapse, Empty, Popconfirm, Row, Tabs} from 'antd';
import {Button as ReactStrapButton, CardFooter} from "reactstrap";
import {DeleteOutlined, PlusOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {shiftArrangement} from '../../api';
import * as _ from 'lodash';
import moment from 'moment';
import EmployeeInfoCard from "./EmployeeInfoCard";
import {store} from "react-notifications-component";
import {createNotify} from "../../utils/notifier";
import ReactLoading from "react-loading";
import AsyncModal from "../Modal/AsyncModal";
import FormAddShiftByDate from "../Form/ShiftArrangement/FormAddShiftByDate";

const {TabPane} = Tabs;
const {Panel} = Collapse;

class ShiftByDateArrangement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employeeList: this.props.employeeList,
            isLoading: false,

            addShiftData: {
                officeId: null,
                shiftId: null,
                arrangeDate: null,
                type: 2,
            },
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!_.isEqual(this.props.employeeList, nextProps.employeeList)) {
            this.setState({
                employeeList: nextProps.employeeList
            }, () => this.convertEmployeeListToMap())
        }

        const data = nextProps.data;
        if (!_.isEqual(this.props.data, data)) {
            if (!_.isEmpty(data)) {
                this.setAddShiftData(data);
            }
        }
    }

    componentWillMount() {
        this.convertEmployeeListToMap();
        this.setAddShiftData(this.props.data);
    }

    setAddShiftData = (data) => {
        if (this.state.addShiftData.officeId !== null) {
            return;
        }

        if (_.isEmpty(data)) {
            return;
        }

        let officeId = data[0].officeId;
        let shiftId = null;
        let arrangeDate = '';

        if (this.state.addShiftData.shiftId === null) {
            if (!_.isEmpty(data[0].shiftDetailList)) {
                shiftId = data[0].shiftDetailList[0].shiftId;
                arrangeDate = data[0].shiftDetailList[0].detailList[0].date;
            }
        }

        this.setState({
            addShiftData: {
                ...this.state.addShiftData,
                officeId: officeId,
                shiftId: shiftId,
                arrangeDate: arrangeDate
            },
        }, () => console.log(this.state))
    };

    toggle = (submit = false) => {
        this.setState({
            showModal: !this.state.showModal
        });

        if (submit) {
            this.props.reload();
        }
    };

    openModal = () => {
        this.setState({
            showModal: true,
        })
    };

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
                <Tabs type={"card"}
                      tabBarExtraContent={this.renderAddShiftButton()}
                      onChange={(shiftId) => this.onChangeShift(shiftId)}
                >
                    {this.renderListShiftDetail(item.shiftDetailList)}
                </Tabs>
            </TabPane>
        )));
    };

    renderAddShiftButton = () => {
        return (<>
            <CardFooter className="text-right info" style={{marginRight: '20px'}}>
                <ReactStrapButton
                    className="btn-custom"
                    color="primary"
                    type="button"
                    onClick={this.openModal}
                >
                    <PlusOutlined style={{display: 'inline', margin: '5px 10px 0 0',}}/>
                    <span className="btn-save-text"> Xếp ca </span>
                </ReactStrapButton>
            </CardFooter>
        </>)
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
        return (<>
            <Tabs tabPosition={"left"}
                  className={"shift-list-date-detail"}
                  onChange={(date) => this.onChangeArrangeDate(date)}
            >
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
            </Tabs>
        </>);
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

        const overFlowHeightStyle = employeeList.length > 8 ? {
            height: 'calc(100vh - 350px)'
        } : null;

        return (<>
            <Row className={"shift-list-employee"}
                 style={overFlowHeightStyle}
            >
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
                                           extra={this.employeeMap.has(user.username) ?
                                               this.renderButtonDelete(item.arrangeId, user.fullName) : null}
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
            </Row>
        </>);
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
            })
            .finally(() => {
                this.toggleLoading();
            });
    };

    onChangeOffice = (officeId) => {
        this.setState({
            addShiftData: {
                ...this.state.addShiftData,
                officeId: officeId,
            },
        }, () => console.log(this.state))
    };

    onChangeShift = (shiftId) => {
        this.setState({
            addShiftData: {
                ...this.state.addShiftData,
                shiftId: shiftId,
            },
        }, () => console.log(this.state))
    };

    onChangeArrangeDate = (arrangeDate) => {
        this.setState({
            addShiftData: {
                ...this.state.addShiftData,
                arrangeDate: arrangeDate,
            }
        }, () => console.log(this.state))
    };

    render() {
        const {data, employeeList} = this.props;
        const {addShiftData, showModal} = this.state;

        return (
            <>
                <Tabs type={"card"}
                      className={"shift-office-list"}
                      onChange={(officeId) => this.onChangeOffice(officeId)}
                >
                    {this.renderListOffice(data)}
                </Tabs>
                <AsyncModal
                    key={addShiftData}
                    reload={false}
                    CompomentContent={FormAddShiftByDate}
                    visible={showModal}
                    toggle={(submit) => this.toggle(submit)}
                    title={'Xếp ca làm việc'}
                    data={addShiftData}
                    mode={'new'}
                    prop={{employeeList: employeeList}}
                />
            </>
        );
    }
}

export default ShiftByDateArrangement;
