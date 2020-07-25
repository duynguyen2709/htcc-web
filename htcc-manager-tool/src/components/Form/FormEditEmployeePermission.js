import React from 'react';
import {Button, CardFooter, Col, Form, FormGroup, Row} from 'reactstrap';
import * as _ from 'lodash';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {CheckCircleOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Checkbox, Col as AntCol, Empty, Popconfirm, Row as AntRow, Select} from 'antd';
import {permissionApi} from '../../api';

const {Option} = Select;

class FormEditEmployeePermission extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!_.isEqual(nextProps.data.dataEdit, this.state.value)) {
            this.setState({
                value: nextProps.data.dataEdit,
            });
        }
    }

    componentDidMount() {
        this.setState({
            value: {
                ...this.props.data.dataEdit,
            },
        });
    }

    handleSubmit = (e) => {
        const {value} = this.state;

        this.props.loading();
        permissionApi
            .updateEmployeePermission(value, value.username)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.props.onSubmit(true);
                } else {
                    this.props.stopLoading();
                    store.addNotification(createNotify('danger', res.returnMessage));
                }
            })
            .catch((err) => {
                this.props.stopLoading();
                console.error(err);
                store.addNotification(createNotify('danger', 'Hệ thống có lỗi. Vui lòng thử lại sau'));
            });
    };

    handleChangeLineManager = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                lineManager: value,
            },
        });
    };

    handleChangeManagerRole = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                managerRole: value,
            },
        });
    };

    renderLineManagerOptions = () => {
        const {canManageEmployees} = this.props.data;
        return _.map(canManageEmployees, (employee, index) => (
            <Option className=" bor-radius" value={employee.username} key={`LM_${employee.username}`}>
                {employee.fullName} ({employee.username})
            </Option>
        ))
    };

    renderManagerRoleOptions = () => {
        const {canAssignRoles} = this.props.data;
        return _.map(canAssignRoles, (role, index) => (
            <Option className=" bor-radius"
                    value={role.roleId}
                    key={`Role_${role.roleId}`}>
                {role.roleName} ({role.roleId})
            </Option>
        ))
    };

    onChangeCanManageOffices = (values) => {
        this.setState({
            value: {
                ...this.state.value,
                canManageOffices: values,
            }
        })
    };

    onChangeCanManageDepartments = (values) => {
        this.setState({
            value: {
                ...this.state.value,
                canManageDepartments: values,
            }
        })
    };

    onChangeSubManagers = (values) => {
        this.setState({
            value: {
                ...this.state.value,
                subManagers: values,
            }
        })
    };

    render() {
        const {value} = this.state;
        const {canManageOffices, canManageDepartments, canManageEmployees} = this.props.data;

        if (!value) {
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

        return (
            <Form>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Cấp trên trực tiếp</label>
                            <Select
                                style={{width: '100%'}}
                                allowClear={true}
                                className="bor-radius"
                                onChange={(val) => this.handleChangeLineManager(val)}
                                value={value.lineManager}
                            >
                                {this.renderLineManagerOptions()}
                            </Select>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Quản lý phụ</label>
                            <Checkbox.Group style={{width: '100%'}}
                                            value={value.subManagers}
                                            onChange={(values) => this.onChangeSubManagers(values)}>
                                <AntRow>
                                    {_.map(canManageEmployees, (employee, index) => (
                                        <AntCol span={8} key={employee.username}>
                                            <Checkbox value={employee.username}>
                                                {employee.fullName} ({employee.username})
                                            </Checkbox>
                                        </AntCol>

                                    ))}
                                </AntRow>
                            </Checkbox.Group>
                        </FormGroup>
                    </Col>
                </Row>
                <Row style={{marginTop: 20}}>
                    <Col md="12">
                        <FormGroup>
                            <label>Nhóm quyền quản lý</label>
                            <Select
                                style={{width: '100%'}}
                                allowClear={true}
                                className="bor-radius"
                                onChange={(val) => this.handleChangeManagerRole(val)}
                                value={value.managerRole}
                            >
                                {this.renderManagerRoleOptions()}
                            </Select>
                        </FormGroup>
                    </Col>
                </Row>
                <Row style={{marginTop: 20}}>
                    <Col md="6">
                        <FormGroup>
                            <label>Chi nhánh quản lý</label>
                            <Checkbox.Group options={canManageOffices}
                                            style={{width: '100%'}}
                                            value={value.canManageOffices}
                                            onChange={(values) => this.onChangeCanManageOffices(values)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Phòng ban quản lý</label>
                            <Checkbox.Group options={canManageDepartments}
                                            value={value.canManageDepartments}
                                            onChange={(values) => this.onChangeCanManageDepartments(values)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <CardFooter className="text-right info">
                    <Popconfirm
                        title="Bạn chắc chắn thay đổi？"
                        icon={<QuestionCircleOutlined/>}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onConfirm={this.handleSubmit}
                    >
                        <Button className="btn-custom" color="primary" type="button">
                            <CheckCircleOutlined
                                style={{display: 'inline', margin: '5px 10px 0 0'}}
                            />{' '}
                            {'  '}
                            <span className="btn-save-text"> LƯU</span>
                        </Button>
                    </Popconfirm>
                </CardFooter>
            </Form>
        );
    }
}

export default FormEditEmployeePermission;
