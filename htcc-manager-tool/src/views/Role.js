import React, {Component} from 'react';
import {Button as AntdButton, Card, Empty, Popconfirm, Tooltip, Tree} from 'antd';
import {Button, CardFooter, Col, Row,} from 'reactstrap';
import {CheckCircleOutlined, DeleteOutlined, PlusSquareOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {roleApi} from '../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../utils/notifier';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import ReactLoading from 'react-loading';
import {ACTION, ROLE_ACTION, ROLE_GROUP, ROLE_GROUP_KEY} from "../constant/constant";
import AsyncModal from "../components/Modal/AsyncModal";
import FormNewRole from "../components/Form/FormNewRole";
import {canDoAction} from "../utils/permission";

class Role extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            defaultRoleDetail: {},
            isLoading: false,
            currentRoleId: '',
            expandedKeysMap: new Map(),
            checkedKeysMap: new Map(),
            originalKeysMap: new Map(),
            showModal: false
        };
    }

    componentDidMount() {
        this.getConfig();
    }

    toggle = (submit = false) => {
        this.setState({
            showModal: !this.state.showModal,
        });

        if (submit) {
            this.getConfig();
        }
    };

    getConfig = () => {
        this.setState({isLoading: true});
        roleApi
            .getRoles()
            .then((res) => {
                if (res.returnCode === 1) {
                    const expandedKeysMap = new Map();
                    const checkedKeysMap = new Map();
                    const originalKeysMap = new Map();

                    for (let ele of res.data.roleList) {
                        const {roleDetail} = ele;
                        const expandedKeysList = [];
                        const checkedKeyList = [];
                        const originalKey = {};

                        _.forOwn(roleDetail, (value, key) => {
                            expandedKeysList.push(`${key}`);
                            originalKey[key] = {};

                            _.forOwn(value, (isEnable, action) => {
                                if (isEnable) {
                                    checkedKeyList.push(`${key}-${action}`);
                                }
                                originalKey[key][action] = false;
                            })
                        });
                        expandedKeysMap.set(ele.roleId, expandedKeysList);
                        checkedKeysMap.set(ele.roleId, checkedKeyList);
                        originalKeysMap.set(ele.roleId, originalKey);
                    }

                    this.setState({
                        data: res.data.roleList,
                        defaultRoleDetail: res.data.defaultRoleDetail,
                        expandedKeysMap: expandedKeysMap,
                        checkedKeysMap: checkedKeysMap,
                        originalKeysMap: originalKeysMap,
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

    handleSubmit = () => {
        const {checkedKeysMap, originalKeysMap, currentRoleId} = this.state;
        const checkedKey = checkedKeysMap.get(currentRoleId);
        const rawDataObj = originalKeysMap.get(currentRoleId);

        const data = {};
        _.forOwn(rawDataObj, (value, group) => {
            data[group] = {};
            _.forOwn(value, (isEnable, action) => {
                const key = `${group}-${action}`;
                if (checkedKey.includes(key)) {
                    data[group][action] = true;
                } else {
                    data[group][action] = false;
                }
            });
        });

        this.setState({isLoading: true});
        roleApi
            .updateRole({
                roleId: currentRoleId,
                roleDetail: data
            })
            .then((res) => {
                if (res.returnCode === 1) {
                    this.getConfig();

                    store.addNotification(
                        createNotify('default', 'Cập nhật thành công')
                    );
                } else {
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                store.addNotification(
                    createNotify('danger', 'Hệ thống có lỗi. Vui lòng thử lại sau.')
                );
            })
            .finally(() => {
                this.setState({isLoading: false});
            })
    };

    handleDeleteRole = (roleId) => {
        if (roleId === 'ROLE_SUPER_ADMIN') {
            return;
        }

        this.setState({isLoading: true});

        roleApi
            .deleteRole(roleId)
            .then((res) => {
                if (res.returnCode === 1) {
                    let {data} = this.state;
                    data = data.filter(ele => ele.roleId !== roleId);
                    this.setState({
                        data
                    });
                    store.addNotification(
                        createNotify('default', res.returnMessage)
                    );
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

    changeColorOnClick = (roleId) => {
        this.setState({
            currentRoleId: roleId
        });

        const textRoleNameList = document.getElementsByClassName('text-role-name');
        for (let text of textRoleNameList) {
            text.style.backgroundColor = '#fff';
        }

        const id = `text-role-name-${roleId}`;
        document.getElementById(id).style.backgroundColor = '#a3e3ff';
    };

    renderRoleName = () => {
        const {data} = this.state;
        const canDelete = canDoAction(this.props.data, ROLE_GROUP_KEY.PERMISSION, ACTION.DELETE);

        if (_.isEmpty(data)) {
            return (
                <Empty
                    style={{marginTop: '20px'}}
                    description={
                        <span style={{color: 'rgba(0, 0, 0, 0.65)'}}>
                            Chưa cài đặt danh sách quyền hạn
                        </span>
                    }
                />
            );
        }

        return _.map(data, (item) => (
            <div
                className={'role-name'}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: '10px'
                }}
                key={item.roleId}
            >
                <span className="text-role-name"
                      id={`text-role-name-${item.roleId}`}
                      onClick={() => this.changeColorOnClick(item.roleId)}
                      style={{margin: 'auto 0px'}}>
                    {`${item.roleName} (${item.roleId})`}
                </span>
                {item.roleId !== 'ROLE_SUPER_ADMIN' && canDelete ?
                    <Popconfirm
                        title={`Bạn có chắc xóa quyền ${item.roleName} (${item.roleId})`}
                        icon={<QuestionCircleOutlined/>}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onConfirm={(event) => {
                            this.handleDeleteRole(item.roleId);
                        }}
                    >
                        <AntdButton
                            type="primary"
                            danger
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                            icon={<DeleteOutlined/>}
                            size={'small'}
                        />
                    </Popconfirm> : null}
            </div>
        ));
    };

    buildTreeData = (roleDetail) => {
        const canUpdate = canDoAction(this.props.data, ROLE_GROUP_KEY.PERMISSION, ACTION.UPDATE);
        const result = [];

        _.forOwn(roleDetail, (value, key) => {
            const parentNode = {
                title: `${ROLE_GROUP[key]}`,
                key: `${key}`,
                children: [],
                disabled: !canUpdate,
                checkable: true,
            };

            _.forOwn(value, (isEnable, action) => {
                const leafNode = {
                    title: `${ROLE_ACTION[key][action]}`,
                    key: `${key}-${action}`,
                    isLeaf: true,
                    disabled: !canUpdate,
                    checkable: true,
                    selectable: false,
                };
                parentNode.children.push(leafNode);
            });

            result.push(parentNode);
        });
        return result;
    };

    onCheck = checkedKeys => {
        checkedKeys = _.filter(checkedKeys, (ele) => ele.includes('-'));
        const {checkedKeysMap, currentRoleId} = this.state;
        checkedKeysMap.set(currentRoleId, checkedKeys);
        this.setState({
            checkedKeysMap
        });
    };

    renderRoleDetail = () => {
        const {currentRoleId, data, expandedKeysMap, checkedKeysMap} = this.state;
        if (_.isEmpty(currentRoleId)) {
            return;
        }

        let currentRoleDetail = null;
        for (let obj of data) {
            if (_.isEqual(obj.roleId, currentRoleId)) {
                currentRoleDetail = {...obj.roleDetail};
                break;
            }
        }

        return <div style={{overflow: 'auto', height: 'calc(100vh - 365px)'}}>
            <Tree
                blockNode
                selectable={false}
                checkable={true}
                expandedKeys={expandedKeysMap.get(currentRoleId)}
                checkedKeys={checkedKeysMap.get(currentRoleId)}
                onCheck={this.onCheck}
                treeData={this.buildTreeData(currentRoleDetail)}/>
        </div>
    };

    render() {
        const {
            isLoading,
            data,
            currentRoleId,
            showModal,
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

        const canAdd = canDoAction(this.props.data, ROLE_GROUP_KEY.PERMISSION, ACTION.CREATE);
        const canUpdate = canDoAction(this.props.data, ROLE_GROUP_KEY.PERMISSION, ACTION.UPDATE);

        return (
            <div className="content">
                <div className="table-wrapper tabs-small">
                    <Row>
                        <Col span={3} push={21}>
                            {canAdd ?
                                <div
                                    className="btn-new"
                                    style={{
                                        float: 'right'
                                    }}
                                >
                                    <Tooltip
                                        placement="bottomLeft"
                                        title={'Thêm nhóm quyền'}
                                    >
                                        <PlusSquareOutlined
                                            onClick={() => this.toggle(false)}
                                        />
                                    </Tooltip>
                                </div> : null}
                        </Col>
                    </Row>
                    <Row style={{height: 'calc(100vh - 280px)'}}>
                        <Col>
                            <Card title="Nhóm quyền">
                                <div style={{overflow: 'auto', height: 'calc(100vh - 365px)'}}>
                                    {this.renderRoleName()}
                                </div>
                            </Card>
                        </Col>
                        <Col>
                            <Card title="Chi tiết">
                                {this.renderRoleDetail()}
                            </Card>
                        </Col>
                    </Row>
                    {!_.isEmpty(data) && !_.isEmpty(currentRoleId) && canUpdate ? <>
                        <h5 style={{marginTop: 30}} className="text-right">
                            <i>Nếu có thay đổi xin hãy bấm LƯU để cập nhật</i>
                        </h5>
                        <hr style={{marginTop: 0}}/>
                        <CardFooter className="text-right info">
                            <Popconfirm
                                title={
                                    <>
                                        <div>
                                            Bạn chắc chắn cập nhật chi tiết quyền
                                        </div>
                                        <div>
                                            {currentRoleId} ？
                                        </div>
                                    </>
                                }
                                icon={<QuestionCircleOutlined/>}
                                okText="Đồng ý"
                                cancelText="Huỷ"
                                onConfirm={() => this.handleSubmit()}
                            >
                                <Button
                                    className="btn-custom"
                                    color="primary"
                                    type="button"
                                >
                                    <CheckCircleOutlined
                                        style={{
                                            display: 'inline',
                                            margin: '5px 10px 0 0',
                                        }}
                                    />{' '}
                                    {'  '}
                                    <span className="btn-save-text"> LƯU</span>
                                </Button>
                            </Popconfirm>
                        </CardFooter>
                    </> : null}
                </div>
                <AsyncModal
                    // width={'50%'}
                    key={'role-modal'}
                    reload={false}
                    CompomentContent={FormNewRole}
                    visible={showModal}
                    toggle={(submit) => this.toggle(submit)}
                    title={'Thêm nhóm quyền mới'}
                    data={{
                        defaultRoleDetail: this.state.defaultRoleDetail,
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data
});

export default connect(mapStateToProps, null)(Role);
