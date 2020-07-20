import React, {Component} from 'react';
import {Card, Col, Empty, List, Popconfirm, Row} from 'antd';
import {connect} from 'react-redux';
import {permissionApi} from "../api";
import {store} from 'react-notifications-component';
import {createNotify} from "../utils/notifier";
import ReactLoading from "react-loading";
import {CheckCircleOutlined, EditOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Button, CardFooter} from 'reactstrap';
import EmployeePermissionCard from "../components/Permission/EmployeePermissionCard";
import {USER} from "../constant/localStorageKey";
import * as _ from "lodash";

class EmployeePermission extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            currentUsername: '',
            isLoading: false,
            readOnly: true
        }
    }

    componentDidMount() {
        this.getConfig();
    }

    getConfig = () => {
        this.setState({isLoading: true});
        permissionApi
            .getEmployeePermission('duytv')
            // .getEmployeePermission(this.props.username)
            .then((res) => {
                if (res.returnCode === 1) {
                    console.log(res.data);
                    this.setState({
                        data: res.data
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
            })
            .finally(() => {
                this.setState({isLoading: false});
            });
    };

    renderButton = () => {
        const {readOnly} = this.state;

        if (readOnly) {
            return (
                <Button
                    id="save"
                    // onClick={this.handleOnEdit}
                    className="btn-custom"
                    color="primary"
                    type="button"
                >
                    <EditOutlined style={{display: 'inline', margin: '5px 10px 0 0'}}/>{' '}
                    {'  '}
                    <span className="btn-save-text"> Chỉnh sửa</span>
                </Button>
            );
        }

        return (
            <Popconfirm
                title="Bạn chắc chắn thay đổi？"
                icon={<QuestionCircleOutlined/>}
                okText="Đồng ý"
                cancelText="Huỷ"
                // onConfirm={() => this.handleSubmit()}
            >
                <Button
                    id="save"
                    className="btn-custom"
                    color="primary"
                    type="button"
                >
                    <CheckCircleOutlined
                        style={{display: 'inline', margin: '5px 10px 0 0'}}
                    />{' '}
                    {'  '}
                    <span className="btn-save-text"> LƯU</span>
                </Button>
            </Popconfirm>
        );
    };

    renderListSubordinate = (list) => {
        let span = 6;
        if (list.length === 1) {
            span = 24;
        }
        if (list.length === 2) {
            span = 12;
        }
        if (list.length === 3) {
            span = 8;
        }
        return <Row>
            {_.map(list, (item, index) => (
                <Col span={span} style={{padding: 10}}
                     key={item.username}>
                    <EmployeePermissionCard user={item}/>
                </Col>
            ))}
        </Row>
    };

    renderListSubManager = (list) => {
        let span = 6;
        if (list.length === 1) {
            span = 24;
        }
        if (list.length === 2) {
            span = 12;
        }
        if (list.length === 3) {
            span = 8;
        }
        return <Row>
            {_.map(list, (item, index) => (
                <Col span={span} key={item.username}>
                    <EmployeePermissionCard user={item}/>
                </Col>
            ))}
        </Row>
    };

    render() {
        const {
            isLoading,
            data
        } = this.state;

        if (isLoading) {
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

        if (data === null) {
            return (
                <Empty
                    className={'center-div'}
                    style={{marginTop: '20px'}}
                    description={
                        <span style={{color: 'rgba(0, 0, 0, 0.65)'}}>
                            Không có dữ liệu
                        </span>
                    }
                />
            );
        }

        const {dataView, dataEdit} = data;

        return (
            <div className="content">
                <div className="table-wrapper tabs-big">
                    <Row className={"permission-container"}>
                        <Col span={16}>
                            <Row className={"permission-user-list"}>
                                <Card title="Quyền nhân viên"
                                      bordered={true}
                                      className={"card-employee-permission"}
                                >
                                    <div className={"card-employee-permission-content"}>
                                        <Row className={"permission-manager-list"}
                                             justify={"space-around"}
                                        >
                                            {dataView.lineManager ?
                                                <Card type="inner" title="Cấp trên trực tiếp">
                                                    <EmployeePermissionCard user={dataView.lineManager}/>
                                                </Card> : null}
                                            {!_.isEmpty(dataView.subManagers) ?
                                                <Card type="inner" title="Quản lý phụ">
                                                    {this.renderListSubManager(dataView.subManagers)}
                                                </Card> : null}
                                        </Row>
                                        <Row className={"permission-self"}
                                             justify={"center"}
                                        >
                                            <Card type="inner" title="Cá nhân"
                                            >
                                                <EmployeePermissionCard user={dataView.self}/>
                                            </Card>
                                        </Row>
                                        {!_.isEmpty(dataView.subordinates) ?
                                            <Row className={"permission-subordinate-list"}
                                                 justify={"center"}
                                            >
                                                <Card type="inner" title="Nhân viên dưới quyền">
                                                    {this.renderListSubordinate(dataView.subordinates)}
                                                </Card>
                                            </Row> : null}
                                    </div>
                                </Card>
                            </Row>
                        </Col>
                        <Col span={7} offset={1}>
                            <Row className={"permission-office-list"}>
                                <List
                                    style={{width: '100%'}}
                                    header={<div>Chi nhánh được quản lý</div>}
                                    bordered
                                    dataSource={dataView.canManageOffices}
                                    renderItem={item => (
                                        <List.Item>
                                            <h4>({item.officeId}) {item.officeName}</h4>
                                        </List.Item>
                                    )}
                                />
                            </Row>
                            <Row className={"permission-department-list"}>
                                <List
                                    style={{width: '100%'}}
                                    header={<div>Phòng ban được quản lý</div>}
                                    bordered
                                    dataSource={dataView.canManageDepartments}
                                    renderItem={item => (
                                        <List.Item>
                                            <h4>({item.department}) {item.departmentName}</h4>
                                        </List.Item>
                                    )}
                                />
                            </Row>
                            <CardFooter className="text-right info" style={{marginTop: 20, marginRight: 20}}>
                                {this.renderButton()}
                            </CardFooter>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data
});

export default connect(mapStateToProps, null)(EmployeePermission);
