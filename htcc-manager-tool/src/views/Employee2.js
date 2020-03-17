import React from 'react';
import TableEmployee from '../components/Table/Employee2';
import { columnsEmployee } from '../constant/tableEmployee2';
import { userApi } from '../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../utils/notifier';

class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    userApi
      .getAllUsers()
      .then(res => {
        if (res.returnCode === 1) {
          this.setState({
            data: res.data
          });
        } else {
          store.addNotification(createNotify('danger', res.returnMessage));
        }
      })
      .catch(err => {
        console.log('err', err);
        // store.addNotification(createNotify('danger', err));
      });
  }

  render() {
    const { data } = this.state;
    return (
      <div className="content">
        <TableEmployee
          key={data}
          title={'Danh sách nhân viên'}
          data={data}
          columns={columnsEmployee}
        />
      </div>
    );
  }
}

export default Employee;
