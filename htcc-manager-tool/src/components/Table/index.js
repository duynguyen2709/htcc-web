import React from 'react';
import MaterialTable from 'material-table';
import moment from 'moment';
import { localization, options, icons } from '../../constant/table';
import { checkValidInputDataRow } from '../../utils/dataTable';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';

const TableCompoment = props => {
  const [state, setState] = React.useState({
    data: props.data
  });

  const addRowData = newData =>
    new Promise((resolve, reject) => {
      if (!checkValidInputDataRow(newData)) {
        store.addNotification(
          createNotify(
            'warning',
            'Không được nhập dữ liệu rỗng. Xin mời thử lại !'
          )
        );
        reject();
      } else {
        setTimeout(() => {
          resolve();
          setState(prevState => {
            const data = [...prevState.data];
            data.push(newData);
            return { ...prevState, data };
          });
        }, 600);
      }
    });

  const updateRowData = (newData, oldData) =>
    new Promise((resolve, reject) => {
      if (!checkValidInputDataRow(newData)) {
        store.addNotification(
          createNotify('warning', 'Dữ liệu không hợp lệ. Xin mời thử lại !')
        );
        reject();
      } else {
        newData.birthday = moment(newData.birthday).format('DD/MM/YYYY');
        setTimeout(() => {
          resolve();
          if (oldData) {
            setState(prevState => {
              const data = [...prevState.data];
              data[data.indexOf(oldData)] = newData;
              return { ...prevState, data };
            });
          }
        }, 600);
      }
    });

  return (
    <MaterialTable
      localization={localization}
      icons={icons}
      title={props.title}
      columns={props.columns}
      data={state.data}
      options={options}
      editable={{
        onRowAdd: newData => addRowData(newData),
        onRowUpdate: (newData, oldData) => updateRowData(newData, oldData)
      }}
    />
  );
};

export default TableCompoment;
