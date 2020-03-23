import React from 'react';
import EditTable from '../components/Table/EditTable';
import { columns } from '../constant/tableEmployee';
import { userApi } from '../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../utils/notifier';
import { Input, Tooltip } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import AsyncModal from '../components/Modal/AsyncModal';
import FormAddNewEmployee from '../components/Form/FormAddNewEmployee';
import * as _ from 'lodash';

const { Search } = Input;
const editURL = 'xxxx';

class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showAddNew: false
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
        // store.addNotification(createNotify('danger',  err));
      });
  }

  toggle = () => {
    this.setState({
      showAddNew: !this.state.showAddNew
    });
  };

  mapData = data => {
    return _.map(data, item => ({
      key: item.employeeId.toString(),
      ...item
    }));
  };

  valideInput = input => {
    // store.addNotification(createNotify('danger', 'Thông tin chưa hợp lệ'));
    return true;
  };

  render() {
    const { data } = this.state;
    const { showAddNew } = this.state;
    return (
      <div className="content">
        <div className="table-wrapper">
          <div className="header-table clearfix">
            <div className="float-left">
              <Search
                className="form-control bor-radius"
                placeholder="Tìm mã nhân viên"
                style={{ width: 300 }}
                onChange={this.onSearch}
              />
            </div>
            <div className="float-right btn-new">
              <Tooltip placement="left" title={'Thêm nhân viên'}>
                <PlusSquareOutlined onClick={this.toggle} />
              </Tooltip>
            </div>
          </div>
          <div className="table-attendance">
            <EditTable
              columnsInput={columns}
              dataInput={this.mapData(data)}
              editURL={editURL}
              valideInput={this.valideInput}
            />
          </div>
        </div>
        <div>
          <AsyncModal
            CompomentContent={FormAddNewEmployee}
            visible={showAddNew}
            toggle={this.toggle}
          />
        </div>
      </div>
    );
  }
}

export default Employee;
