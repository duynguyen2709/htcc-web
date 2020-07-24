import React, { Component } from 'react';
import { Button as AntButton, Card, Col, Empty, List, Row } from 'antd';
import { connect } from 'react-redux';
import { permissionApi } from '../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../utils/notifier';
import ReactLoading from 'react-loading';
import { EditOutlined, CaretLeftOutlined } from '@ant-design/icons';
import { Button, CardFooter } from 'reactstrap';
import EmployeePermissionCard from '../components/Permission/EmployeePermissionCard';
import * as _ from 'lodash';
import AsyncModal from '../components/Modal/AsyncModal';
import FormEditEmployeePermission from '../components/Form/FormEditEmployeePermission';
import { canDoAction } from '../utils/permission';
import { ACTION, ROLE_GROUP_KEY } from '../constant/constant';

class EmployeePermission extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            currentUsername: '',
            isLoading: false,
            showModal: false,
        };
    }

    toggle = (submit = false) => {
        this.setState({
            showModal: !this.state.showModal,
        });

        if (submit) {
            this.getConfig();
        }
    };

    componentDidMount() {
        this.getConfig();
    }

    getConfig = () => {
        if (!this.props.username || this.props.username === '') {
            this.setState({
                data: null,
            });
            return;
        }

        this.setState({
            isLoading: true,
            data: null,
        });

        permissionApi
            .getEmployeePermission(this.props.username)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        data: res.data,
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
                this.setState({ isLoading: false });
            });
    };

    renderButton = () => {
        return (
            <Button
                id="save"
                onClick={() => this.toggle(false)}
                className="btn-custom"
                color="primary"
                type="button"
            >
                <EditOutlined
                    style={{ display: 'inline', margin: '5px 10px 0 0' }}
                />{' '}
                {'  '}
                <span className="btn-save-text"> Chỉnh sửa</span>
            </Button>
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
        return (
            <Row>
                {_.map(list, (item, index) => (
                    <Col
                        span={span}
                        style={{ padding: 10 }}
                        key={item.username}
                    >
                        <EmployeePermissionCard user={item} />
                    </Col>
                ))}
            </Row>
        );
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
        return (
            <Row>
                {_.map(list, (item, index) => (
                    <Col span={span} key={item.username}>
                        <EmployeePermissionCard user={item} />
                    </Col>
                ))}
            </Row>
        );
    };

    render() {
        const { isLoading, data } = this.state;

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

        const canViewPermission = canDoAction(
            this.props.data,
            ROLE_GROUP_KEY.EMPLOYEE_PERMISSION,
            ACTION.READ
        );

        if (data === null || !canViewPermission) {
            return (
                <Empty
                    className={'center-div'}
                    style={{ marginTop: '20px' }}
                    description={
                        <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                            Không có dữ liệu
                        </span>
                    }
                />
            );
        }

        const { dataView } = data;
        return (
            <div className="content">
                <div className="table-wrapper tabs-big">
                    <Row justify={'space-between'}>
                        <AntButton
                            type="primary"
                            style={{ margin: 10 }}
                            icon={<CaretLeftOutlined />}
                            onClick={this.props.handleClickBack}
                        >
                            Quay lại
                        </AntButton>
                        <CardFooter
                            className="text-right info"
                            style={{ margin: 10 }}
                        >
                            {this.renderButton()}
                        </CardFooter>
                    </Row>
                    <Row className={'permission-container'}>
                        <Col span={16}>
                            <Row className={'permission-user-list'}>
                                <Card
                                    title="Quyền nhân viên"
                                    bordered={true}
                                    className={'card-employee-permission'}
                                >
                                    <div
                                        className={
                                            'card-employee-permission-content'
                                        }
                                    >
                                        <Row
                                            className={
                                                'permission-manager-list'
                                            }
                                            justify={'space-around'}
                                        >
                                            {dataView.lineManager ? (
                                                <Card
                                                    type="inner"
                                                    title="Cấp trên trực tiếp"
                                                >
                                                    <EmployeePermissionCard
                                                        user={
                                                            dataView.lineManager
                                                        }
                                                    />
                                                </Card>
                                            ) : null}
                                            {!_.isEmpty(
                                                dataView.subManagers
                                            ) ? (
                                                <Card
                                                    type="inner"
                                                    title="Quản lý phụ"
                                                >
                                                    {this.renderListSubManager(
                                                        dataView.subManagers
                                                    )}
                                                </Card>
                                            ) : null}
                                        </Row>
                                        <Row
                                            className={'permission-self'}
                                            justify={'center'}
                                        >
                                            <Card type="inner" title="Cá nhân">
                                                <EmployeePermissionCard
                                                    user={dataView.self}
                                                />
                                            </Card>
                                        </Row>
                                        {!_.isEmpty(dataView.subordinates) ? (
                                            <Row
                                                className={
                                                    'permission-subordinate-list'
                                                }
                                                justify={'center'}
                                            >
                                                <Card
                                                    type="inner"
                                                    title="Nhân viên dưới quyền"
                                                >
                                                    {this.renderListSubordinate(
                                                        dataView.subordinates
                                                    )}
                                                </Card>
                                            </Row>
                                        ) : null}
                                    </div>
                                </Card>
                            </Row>
                        </Col>
                        <Col span={7} offset={1}>
                            <Row className={'permission-office-list'}>
                                <List
                                    style={{ width: '100%' }}
                                    header={<div>Chi nhánh được quản lý</div>}
                                    bordered
                                    dataSource={dataView.canManageOffices}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <h4>
                                                ({item.officeId}){' '}
                                                {item.officeName}
                                            </h4>
                                        </List.Item>
                                    )}
                                />
                            </Row>
                            <Row className={'permission-department-list'}>
                                <List
                                    style={{ width: '100%' }}
                                    header={<div>Phòng ban được quản lý</div>}
                                    bordered
                                    dataSource={dataView.canManageDepartments}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <h4>
                                                ({item.department}){' '}
                                                {item.departmentName}
                                            </h4>
                                        </List.Item>
                                    )}
                                />
                            </Row>

                            {data !== null && !isLoading ? (
                                <div>
                                    <AsyncModal
                                        key={data}
                                        reload={false}
                                        CompomentContent={
                                            FormEditEmployeePermission
                                        }
                                        visible={this.state.showModal}
                                        width={'50%'}
                                        toggle={(submit) => this.toggle(submit)}
                                        title={
                                            'Cập nhật quyền quản lý của nhân viên'
                                        }
                                        data={{
                                            ...data,
                                            canManageEmployees: this.props.data
                                                .canManageEmployees,
                                            canManageOffices: this.props.data
                                                .canManageOffices,
                                            canManageDepartments: this.props
                                                .data.canManageDepartments,
                                            canAssignRoles: this.props.data
                                                .canAssignRoles,
                                        }}
                                        mode={'edit'}
                                    />
                                </div>
                            ) : null}
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

export default connect(mapStateToProps, null)(EmployeePermission);
