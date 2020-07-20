import React from 'react';
import {Button, CardFooter, Col, Form, FormFeedback, FormGroup, Input, Row,} from 'reactstrap';
import * as _ from 'lodash';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {CheckCircleOutlined, QuestionCircleOutlined,} from '@ant-design/icons';
import {Card, Empty, Popconfirm, Tree} from 'antd';
import {roleApi} from '../../api';
import {ROLE_ACTION, ROLE_GROUP} from "../../constant/constant";

const RESET_TOUCH = {
    roleId: false,
    roleName: false,
};

class FormNewRole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                roleId: '',
                roleName: '',
                roleDetail: this.props.data.defaultRoleDetail,
            },
            messageInvalid: {
                roleName: 'Vui lòng nhập tên nhóm quyền',
                roleId: 'Vui lòng nhập mã nhóm quyền',
            },
            touch: {
                ...RESET_TOUCH,
            },
            isLoading: false,
            expandedKeys: [],
            checkedKeys: [],
        };
    }

    onCheck = checkedKeys => {
        checkedKeys = _.filter(checkedKeys, (ele) => ele.includes('-'));
        this.setState({
            checkedKeys
        });
    };

    buildExpandedKeys = () => {
        const {value} = this.state;
        const {roleDetail} = value;
        if (_.isEmpty(roleDetail)) {
            return;
        }

        const expandedKeys = [];
        _.forOwn(roleDetail, (value, key) => {
            expandedKeys.push(`${key}`);
        });
        this.setState({
            expandedKeys
        });
    };

    componentDidMount() {
        this.buildExpandedKeys();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!_.isEqual(nextProps.data.defaultRoleDetail, this.state.value.roleDetail)) {
            this.setState({
                value: {
                    roleDetail: nextProps.data.defaultRoleDetail,
                    ...this.state.value
                }
            }, () => this.buildExpandedKeys())
        }
    }

    handleOnChange = (e) => {
        const {value: valueInput, name} = e.target;
        let {value, touch} = this.state;

        value[name] = valueInput;
        touch[name] = true;

        this.setState({
            value: {...value},
            touch: {...touch},
        });
    };

    clear = () => {
        this.setState({
            value: {
                roleId: '',
                roleName: '',
                roleDetail: this.props.data.defaultRoleDetail,
            },
            touch: {...RESET_TOUCH},
        });
    };

    handleSubmit = (e) => {
        const {value, checkedKeys} = this.state;
        if (_.isEmpty(value.roleId)) {
            store.addNotification(
                createNotify('warning', 'Mã nhóm quyền không được rỗng')
            );
            return;
        }
        if (_.isEmpty(value.roleName)) {
            store.addNotification(
                createNotify('warning', 'Tên nhóm quyền không được rỗng')
            );
            return;
        }

        const defaultData = this.props.data.defaultRoleDetail;
        const roleDetail = {};
        let hasActive = false;
        _.forOwn(defaultData, (value, group) => {
            roleDetail[group] = {};
            _.forOwn(value, (isEnable, action) => {
                const key = `${group}-${action}`;
                if (checkedKeys.includes(key)) {
                    roleDetail[group][action] = true;
                    hasActive = true;
                } else {
                    roleDetail[group][action] = false;
                }
            });
        });

        if (!hasActive) {
            store.addNotification(
                createNotify('warning', 'Chi tiết nhóm quyền không được rỗng')
            );
            return;
        }

        const data = {
            roleId: value.roleId,
            roleName: value.roleName,
            roleDetail: roleDetail,
        };

        this.props.loading();
        this.setState({
            isLoading: true,
        });

        roleApi
            .createRole(data)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.props.stopLoading();
                    this.clear();
                    this.props.onSubmit(true);
                } else {
                    this.props.stopLoading();

                    this.setState({
                        isLoading: false,
                    });
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                this.props.stopLoading();

                this.setState({
                    isLoading: false,
                });

                console.error(err);
                store.addNotification(
                    createNotify(
                        'danger',
                        'Hệ thống có lỗi. Vui lòng thử lại sau.'
                    )
                );
            });
    };

    buildTreeData = (roleDetail) => {
        const result = [];

        _.forOwn(roleDetail, (value, key) => {
            const parentNode = {
                title: `${ROLE_GROUP[key]}`,
                key: `${key}`,
                children: [],
                checkable: true,
            };

            _.forOwn(value, (isEnable, action) => {
                const leafNode = {
                    title: `${ROLE_ACTION[key][action]}`,
                    key: `${key}-${action}`,
                    isLeaf: true,
                    checkable: true,
                    selectable: false,
                };
                parentNode.children.push(leafNode);
            });

            result.push(parentNode);
        });
        return result;
    };

    render() {
        const {value, messageInvalid, touch, expandedKeys} = this.state;
        const {defaultRoleDetail} = this.props.data;
        if (_.isEmpty(defaultRoleDetail)) {
            return (
                <Empty
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
                            <label>Mã nhóm quyền</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập mã nhóm quyền"
                                type="text"
                                name="roleId"
                                value={value.roleId}
                                onChange={this.handleOnChange}
                                invalid={
                                    touch.roleId &&
                                    _.isEmpty(value.roleId)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.roleId}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Tên nhóm quyền</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập tên nhóm quyền"
                                type="text"
                                name="roleName"
                                value={value.roleName}
                                onChange={this.handleOnChange}
                                invalid={
                                    touch.roleName &&
                                    _.isEmpty(value.roleName)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.roleName}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>

                <Row style={{marginTop: '10px'}}>
                    <Col md="12">
                        <Card title="Chi tiết quyền">
                            <Tree
                                blockNode
                                selectable={false}
                                checkable={true}
                                expandedKeys={expandedKeys}
                                // checkedKeys={checkedKeysMap.get(currentRoleId)}
                                onCheck={this.onCheck}
                                treeData={this.buildTreeData(value.roleDetail)}/>
                        </Card>
                    </Col>
                </Row>
                <CardFooter className="text-right info">
                    <Popconfirm
                        title="Bạn chắc chắn thêm mới？"
                        icon={<QuestionCircleOutlined/>}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onConfirm={() => this.handleSubmit()}
                    >
                        <Button
                            className="btn-custom"
                            color="primary"
                            type="button"
                            disabled={this.state.isLoading}
                        >
                            <CheckCircleOutlined
                                style={{
                                    display: 'inline',
                                    margin: '5px 10px 0 0',
                                }}
                            />{' '}
                            {'  '}
                            <span className="btn-save-text"> THÊM</span>
                        </Button>
                    </Popconfirm>
                </CardFooter>
            </Form>
        );
    }
}

export default FormNewRole;
