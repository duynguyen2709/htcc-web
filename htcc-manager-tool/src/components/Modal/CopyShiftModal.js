import React from 'react';
import {Card, Col, Empty, Modal, Popconfirm, Row, Select, Spin, Tree} from 'antd';
import * as _ from 'lodash';
import {ArrowRightOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {createNotify} from '../../utils/notifier';
import {store} from 'react-notifications-component';
import {shiftArrangement} from '../../api';

import {WEEK_DAYS} from "../../constant/constant";
import {Button, CardFooter} from "reactstrap";

class CopyShiftModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            templateId: '',
            templateName: '',
            expandedKeys: [],
            checkedKeys: [],
            isLoading: false
        };

        this.onChangeTemplate = this.onChangeTemplate.bind(this);
    }

    onChangeTemplate = (templateId) => {
        const {templateList} = this.props;
        for (let template of templateList) {
            if (_.isEqual(template.templateId, templateId)) {
                const expandedKeys = [];
                const checkedKeys = [];
                _.forOwn(template.shiftTimeMap, (value, key) => {
                    expandedKeys.push(`weekDay_${key}`);

                    if (value.length > 0) {
                        checkedKeys.push(`weekDay_${key}`);
                    }

                    _.forEach(value, (shift, index) => {
                        shift.weekDay = key;
                        expandedKeys.push(`${JSON.stringify(shift)}`);
                        checkedKeys.push(`${JSON.stringify(shift)}`);
                    });
                });

                this.setState({
                    templateId: templateId,
                    templateName: template.templateName,
                    expandedKeys: expandedKeys,
                    checkedKeys: checkedKeys,
                })
            }
        }
    };


    renderTemplateSelect = () => {
        return (<>
            <Col span={3} style={{marginBottom: '10px'}}>
                <h4 style={{color: 'rgba(0, 0, 0, 0.65)'}}>Chọn ca mẫu</h4>
            </Col>
            <Col span={8}>
                <Select
                    allowClear={false}
                    autoFocus
                    style={{width: '90%'}}
                    className="bor-radius"
                    onChange={this.onChangeTemplate}
                    value={this.state.templateId}
                >
                    {_.map(this.props.templateList, (item) => (
                        <Select.Option className=" bor-radius"
                                       value={item.templateId}
                                       key={item.templateId}
                        >
                            {item.templateName}
                        </Select.Option>
                    ))}
                </Select>
            </Col>
        </>);
    };

    renderEmployeeSelect = () => {
        return (<>
            <Col offset={1} span={3} style={{marginBottom: '10px'}}>
                <h4 style={{color: 'rgba(0, 0, 0, 0.65)'}}>Chọn nhân viên</h4>
            </Col>
            <Col span={8}>
                <Select
                    allowClear={false}
                    autoFocus
                    style={{width: '100%'}}
                    className="bor-radius"
                    onChange={(val) => this.setState({
                        username: val
                    })}
                    value={this.state.username}
                >
                    {_.map(this.props.employeeList, (item) => (
                        <Select.Option className=" bor-radius"
                                       value={item.username}
                                       key={item.username}
                        >
                            {item.fullName} ({item.username})
                        </Select.Option>
                    ))}
                </Select>
            </Col>
        </>);
    };

    buildFixedShiftList = (fixedShiftMap, checkable) => {
        const result = [];

        _.forOwn(fixedShiftMap, (value, key) => {
            const parentNode = {
                title: WEEK_DAYS[key],
                key: `weekDay_${key}`,
                children: [],
                checkable: (checkable) ? (value.length > 0) : false,
            };

            if (value.length === 0) {
                const leafNode = {
                    title: <span style={{color: '#d9534f'}}>Không có ca làm việc</span>,
                    key: `leaf_${key}_0`,
                    isLeaf: true,
                    checkable: false,
                    selectable: false,
                };

                parentNode.children.push(leafNode);
            }

            _.forEach(value, (shift, index) => {
                shift.weekDay = key;
                const leafNode = {
                    title: `- Chi nhánh: ${shift.officeId} - Ca: ${shift.shiftName} (${shift.shiftId}) - Giờ: ${shift.shiftTime}`,
                    key: `${JSON.stringify(shift)}`,
                    isLeaf: true,
                    checkable: checkable,
                    selectable: false,
                };
                parentNode.children.push(leafNode);
            });

            result.push(parentNode);
        });

        return result;
    };

    buildTreeData = (checkable) => {
        const {templateList} = this.props;
        if (_.isEmpty(templateList) || this.state.templateId === '') {
            return [];
        }

        for (let template of templateList) {
            if (template.templateId === this.state.templateId) {
                return this.buildFixedShiftList(template.shiftTimeMap, checkable);
            }
        }

        return null;
    };

    onCheck = checkedKeys => {
        checkedKeys = _.filter(checkedKeys, (ele) => !ele.startsWith('weekDay_'));
        this.setState({
            checkedKeys: checkedKeys
        })
    };

    renderButton = () => {
        let fullName = '';
        for (let employee of this.props.employeeList) {
            if (_.isEqual(employee.username, this.state.username)) {
                fullName = employee.fullName;
                break;
            }
        }

        const {username, templateId, checkedKeys} = this.state;
        if ((_.isEqual(templateId, '')) || (_.isEmpty(username)) || (_.isEmpty(checkedKeys))) {
            return <Button
                id="save"
                className="btn-custom"
                color="primary"
                type="button"
                style={{margin: '10px'}}
                onClick={this.validateData}
            >
                <span className="btn-save-text"> SAO CHÉP</span>
            </Button>
        }

        const title = `Xác nhận sao chép ca "${this.state.templateName}" cho nhân viên ${fullName} ?`;
        return (
            <Popconfirm
                title={title}
                icon={<QuestionCircleOutlined/>}
                okText="Đồng ý"
                cancelText="Huỷ"
                onConfirm={this.handleSubmit}
            >
                <Button
                    id="save"
                    className="btn-custom"
                    color="primary"
                    type="button"
                    style={{margin: '10px'}}
                    disabled={this.state.isLoading}
                >
                    <span className="btn-save-text"> SAO CHÉP</span>
                </Button>
            </Popconfirm>
        );
    };

    validateData = () => {
        const {username, templateId, checkedKeys} = this.state;

        if (_.isEqual(templateId, '')) {
            store.addNotification(
                createNotify('danger', "Vui lòng chọn ca mẫu")
            );
            return;
        }

        if (_.isEmpty(username)) {
            store.addNotification(
                createNotify('danger', "Vui lòng chọn nhân viên")
            );
            return;
        }

        if (_.isEmpty(checkedKeys)) {
            store.addNotification(
                createNotify('danger', "Danh sách ca không được rỗng")
            );
            return;
        }
    };

    handleSubmit = () => {
        const {username, checkedKeys} = this.state;
        const keys = _.filter(checkedKeys, (ele) => !ele.startsWith('weekDay_'));
        const data = {};

        _.forEach(keys, (value, index) => {
            const obj = JSON.parse(value);
            const weekDay = parseInt(obj.weekDay);
            if (data[weekDay] == null) {
                data[weekDay] = [];
            }

            data[weekDay].push({
                shiftId: obj.shiftId,
                officeId: obj.officeId
            })
        });

        this.setState({
            isLoading: true
        });

        shiftArrangement.copyShiftFromTemplate(username, data)
            .then((res) => {
                if (res.returnCode === 1) {
                    store.addNotification(
                        createNotify(
                            'default',
                            res.returnMessage
                        )
                    );
                    this.props.toggle(true);
                } else {
                    store.addNotification(
                        createNotify(
                            'danger',
                            res.returnMessage
                        )
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
                this.setState({
                    isLoading: false,
                });
            })
    };

    render() {
        const {visible, title, templateList, employeeList} = this.props;
        const {expandedKeys, checkedKeys, isLoading} = this.state;

        const isEmpty = (_.isEmpty(templateList) || _.isEmpty(employeeList));

        return (
            <Modal
                width={isEmpty || isLoading ? "520px" : "70%"}
                visible={visible}
                title={title ? title : ''}
                onCancel={() => this.props.toggle(false)}
                footer={null}
            >
                {isEmpty ?
                    <Empty style={{marginTop: '20px'}}
                           description={
                               <span style={{color: 'rgba(0, 0, 0, 0.65)'}}>Không có dữ liệu</span>
                           }
                    />
                    :
                    isLoading ?
                        <>
                            <div style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                            }}>
                                <Spin size={"large"}/>
                            </div>
                        </>
                        :
                        <>
                            <Row justify="space-around" align="middle">
                                {this.renderTemplateSelect()}

                                {this.renderEmployeeSelect()}
                            </Row>
                            <Row justify="space-around" align="middle">
                                <Col span={11}>
                                    <Card>
                                        <Tree
                                            blockNode
                                            selectable={false}
                                            checkable={false}
                                            expandedKeys={expandedKeys}
                                            checkedKeys={checkedKeys}
                                            treeData={this.buildTreeData(false)}/>
                                    </Card>
                                </Col>
                                <Col span={1}>
                                    <ArrowRightOutlined style={{paddingLeft: '10px'}}/>
                                </Col>
                                <Col span={12}>
                                    <Card>
                                        <Tree
                                            blockNode
                                            selectable={false}
                                            checkable={true}
                                            expandedKeys={expandedKeys}
                                            checkedKeys={checkedKeys}
                                            onCheck={this.onCheck}
                                            treeData={this.buildTreeData(true)}/>
                                    </Card>
                                </Col>
                            </Row>
                            <CardFooter className="text-right info">
                                {this.renderButton()}
                            </CardFooter>
                        </>
                }
            </Modal>
        );
    }
}

export default CopyShiftModal;
