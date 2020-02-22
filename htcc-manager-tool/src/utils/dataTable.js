import * as _ from 'lodash';
import { columnsEmployee } from '../constant/table';
import { checkValidPhoneNumber } from '../utils/validate';
import { store } from 'react-notifications-component';
import { createNotify } from './notifier';

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
