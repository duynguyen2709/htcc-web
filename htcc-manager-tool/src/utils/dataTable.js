import React from 'react';
import * as _ from 'lodash';
import { columnsEmployee } from '../constant/colTable';
import { checkValidPhoneNumber } from '../utils/validate';
import { store } from 'react-notifications-component';
import { createNotify } from './notifier';
import { Tag } from 'antd';

export const getFieldTable = columnsTable => {
  return _.map(columnsTable, column => column.field);
};

export const checkValidInputDataRow = row => {
  let flag = true;

  if (_.isEmpty(row)) {
    return false;
  }
  row = { ...row, code: '1' };

  _.forEach(getFieldTable(columnsEmployee), column => {
    if (column === 'phoneNumber') {
      if (!checkValidPhoneNumber(row[column])) {
        store.addNotification(
          createNotify('warning', 'Số điện thoại không hợp lệ !')
        );
        flag = false;
      }
    } else if (!row[column]) {
      flag = false;
    }
  });

  return flag;
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

export const genColTableAttendance = num => {
  const columns = [
    {
      title: 'Mã nhân viên',
      width: 100,
      dataIndex: 'code',
      key: 'code',
      fixed: 'left'
    }
  ];

  for (let i = 1; i <= num; i++) {
    columns.push({
      title: `Ngày ${i}`,
      dataIndex: 'attendance',
      key: `${i}`,
      width: 100,
      render: rowData => {
        if (rowData[i]) {
          return renderCellAttendance(rowData[i].checkin, rowData[i].checkout);
        }
        return (
          <Tag key="none" color="default">
            --:--
          </Tag>
        );
      }
    });
  }

  return columns;
};
