import React from 'react';
import * as _ from 'lodash';
import { Tag } from 'antd';

export const addKeyPropsToTable = (prefix, arr) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].key = `${prefix}_i`;
    }

    return arr;
};

export const getFieldTable = (columnsTable) => {
    return _.map(columnsTable, (column) => column.field);
};

export const renderCellAttendance = (checkin, checkout) => {
    const tags = [];
    if (checkin) {
        tags.push(
            <Tag key="in" color="green">
                {checkin}
            </Tag>
        );
    }

    if (checkout) {
        tags.push(
            <Tag key="out" color="blue">
                {checkout}
            </Tag>
        );
    }

    return tags;
};

export const genColTableAttendance = (num) => {
    const columns = [
        {
            title: 'Mã nhân viên',
            width: 100,
            dataIndex: 'code',
            key: 'code',
            fixed: 'left',
        },
    ];

    for (let i = 1; i <= num; i++) {
        columns.push({
            title: `Ngày ${i}`,
            dataIndex: 'attendance',
            key: `${i}`,
            width: 100,
            render: (rowData) => {
                if (rowData[i]) {
                    return renderCellAttendance(
                        rowData[i].checkin,
                        rowData[i].checkout
                    );
                }
                return (
                    <Tag key="none" color="default">
                        --:--
                    </Tag>
                );
            },
        });
    }

    return columns;
};

export const isLeapYear = (year) => {
    year = parseInt(year);

    return year % 4 === 0 && year % 100 === 0;
};
