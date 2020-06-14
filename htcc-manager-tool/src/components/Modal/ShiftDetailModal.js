import React from 'react';
import {Empty, Modal, Tabs, Tree} from 'antd';
import {CalendarOutlined, CarryOutOutlined} from '@ant-design/icons';
import * as _ from 'lodash';
import moment from "moment";
import {WEEK_DAYS} from "../../constant/constant";

const {TabPane} = Tabs;

const buildFixedShiftList = (fixedShiftMap) => {

    const fixedShiftList = [];

    _.forOwn(fixedShiftMap, (value, key) => {
        const parentNode = {
            title: WEEK_DAYS[key],
            key: `weekDay_${key}`,
            children: [],
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
                checkable: false,
                selectable: false,
            };

            parentNode.children.push(leafNode);
        });


        fixedShiftList.push(parentNode);
    });

    return fixedShiftList;
};

const buildShiftByDateList = (shiftByDateMap) => {

    if (_.isEmpty(shiftByDateMap)) {
        return [];
    }

    const result = [];

    _.forOwn(shiftByDateMap, (value, key) => {
        const parentNode = {
            title: String(moment(key, 'YYYYMMDD').format('DD-MM-YYYY')),
            key: key,
            children: [],
        };

        _.forEach(value, (shift, index) => {
            const leafNode = {
                title: `- Chi nhánh: ${shift.officeId} - Ca: ${shift.shiftName} (${shift.shiftId}) - Giờ: ${shift.shiftTime}`,
                key: `leaf_${key}_${index}`,
                isLeaf: true,
                checkable: false,
                selectable: false,
            };

            parentNode.children.push(leafNode);
        });

        result.push(parentNode);
    });

    return result;
};

const ShiftDetailModal = (props) => {

    const {data, visible, title, toggle} = props;

    const fixedShiftList = buildFixedShiftList(data.fixedShiftMap);
    const shiftByDateList = buildShiftByDateList(data.shiftByDateMap);

    return (
        <Modal
            style={{width: '110%'}}
            visible={visible}
            title={title ? title : ''}
            onCancel={toggle}
            footer={null}
        >
            <Tabs defaultActiveKey="employee-fixed-shift"
                  style={{marginTop: '-15px'}}
            >
                <TabPane
                    style={{overflow: 'auto', marginTop: '-8px'}}
                    tab={<span><CalendarOutlined/>Ca cố định</span>}
                    key="employee-fixed-shift"
                >
                    <Tree
                        defaultExpandAll
                        blockNode
                        selectable={false}
                        checkable={false}
                        treeData={fixedShiftList}
                    />
                </TabPane>
                <TabPane
                    style={{overflow: 'auto', marginTop: '-8px'}}
                    tab={<span><CarryOutOutlined/>Ca linh động</span>}
                    key="employee-day-shift"
                >
                    {_.isEmpty(data.shiftByDateMap) ?
                        <Empty style={{marginTop: '20px'}}
                               description={
                                   <span style={{color: 'rgba(0, 0, 0, 0.65)'}}>Không có ca làm việc</span>
                               }
                        />
                        :
                        <Tree
                            defaultExpandAll
                            blockNode
                            selectable={false}
                            checkable={false}
                            treeData={shiftByDateList}/>
                    }
                </TabPane>
            </Tabs>
        </Modal>
    );
};

export default ShiftDetailModal;
