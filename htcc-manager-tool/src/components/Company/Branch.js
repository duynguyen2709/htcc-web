import React from 'react';
import * as _ from 'lodash';
import { userApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import { checkValidEmail, checkValidPhoneNumber } from '../../utils/validate';
import { PlusSquareOutlined } from '@ant-design/icons';
import EditTable from '../Table/EditTable';
import { columns } from '../../constant/tableEmployee';
import { Input, Tooltip } from 'antd';
import AsyncModal from '../Modal/AsyncModal';
import FormAddNewBranch from '../Form/FormAddNewBranch';

const { Search } = Input;
const editURL = 'xxxx';

class Branch extends React.Component {
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
        store.addNotification(createNotify('danger', JSON.stringify(err)));
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
    const { data, showAddNew } = this.state;
    return (
      <React.Fragment>
        <div className="header-table clearfix">
          <div className="float-left">
            <Search
              className="form-control bor-radius"
              placeholder="Tìm mã chi nhánh"
              style={{ width: 300 }}
              onChange={this.onSearch}
            />
          </div>
          <div className="float-right btn-new">
            <Tooltip placement="left" title={'Thêm chi nhánh'}>
              <PlusSquareOutlined onClick={this.toggle} />
            </Tooltip>
          </div>
        </div>
        <div className="table-edit" id="branch">
          <EditTable
            columnsInput={columns}
            dataInput={this.mapData(data)}
            editURL={editURL}
            valideInput={this.valideInput}
            pageSize={6}
          />
        </div>
        <div>
          <AsyncModal
            CompomentContent={FormAddNewBranch}
            visible={showAddNew}
            toggle={this.toggle}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Branch;
