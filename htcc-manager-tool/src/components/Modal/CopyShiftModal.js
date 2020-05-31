import React from 'react';
import {Card, Col, Empty, Modal, Row, Select, Tree} from 'antd';
import * as _ from 'lodash';
import {ArrowRightOutlined} from '@ant-design/icons';

import {WEEK_DAYS} from "../../constant/constant";

class CopyShiftModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            templateId: '',
            expandedKeys: [],
            data: {},
            templateList: props.templateList,
        };

        this.onChangeTemplate = this.onChangeTemplate.bind(this);
    }

    onChangeTemplate = (templateId) => {
        const {templateList} = this.props;
        for (let template of templateList) {
            if (_.isEqual(template.templateId, templateId)) {
                const keys = [];
                _.forOwn(template.shiftTimeMap, (value, key) => {
                    keys.push(`weekDay_${key}`);

                    if (value.length === 0) {
                        keys.push(`leaf_${key}_0`);

                        _.forEach(value, (shift, index) => {
                            keys.push(`leaf_${key}_${index}`);
                        });
                    }});

                this.setState({
                    templateId: templateId,
                    data: template.shiftTimeMap,
                    expandedKeys: keys
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
                const leafNode = {
                    title: `- Chi nhánh: ${shift.officeId} - Ca: ${shift.shiftName} (${shift.shiftId}) - Giờ: ${shift.shiftTime}`,
                    key: `leaf_${key}_${index}`,
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



    render() {
        const {visible, title, toggle, templateList, employeeList} = this.props;
        const {expandedKeys} = this.state;

        const isEmpty = (_.isEmpty(templateList) || _.isEmpty(employeeList));

        console.log(expandedKeys);
        return (
            <Modal
                width={isEmpty ? "520px" : "70%"}
                visible={visible}
                title={title ? title : ''}
                onCancel={toggle}
                footer={null}
            >
                {isEmpty ?
                    <Empty style={{marginTop: '20px'}}
                           description={
                               <span style={{color: 'rgba(0, 0, 0, 0.65)'}}>Không có dữ liệu</span>
                           }
                    />
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
                                        treeData={this.buildTreeData(true)}/>
                                </Card>
                            </Col>
                        </Row>
                    </>
                }
            </Modal>
        );
    }
}

export default CopyShiftModal;
