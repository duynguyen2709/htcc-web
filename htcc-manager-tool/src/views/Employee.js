import React from 'react';
import TableEmployee from '../components/Table/Employee';
import { columns } from '../constant/tableEmployee';
import { userApi } from '../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../utils/notifier';
import { Input } from 'antd';

const { Search } = Input;
const data = [
  {
    companyId: 'VNG',
    username: 'admin',
    employeeId: 'VNG-00001',
    officeId: 'CAMPUS',
    department: 'PMA',
    fullName: 'Nguyễn Anh Duy',
    birthDate: '1998-09-28',
    email: 'naduy.hcmus@gmail.com',
    identityCardNo: '272683901',
    phoneNumber: '0948202709',
    address: 'Quận 9, TPHCM',
    avatar:
      'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
  },
  {
    companyId: 'VNG',
    username: 'admin1',
    employeeId: 'VNG-002',
    officeId: 'CAMPUS',
    department: 'ZPI',
    fullName: 'Võ Tấn Duy',
    birthDate: '1998-07-29',
    email: 'Duytv.2907@gmail.com',
    identityCardNo: '123456789',
    phoneNumber: '0912345678',
    address: 'Gò Vấp, TPHCM',
    avatar:
      'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
  },
  {
    companyId: 'VNG',
    username: 'admin',
    employeeId: 'VNG-0003',
    officeId: 'CAMPUS',
    department: 'PMA',
    fullName: 'Nguyễn Anh Duy',
    birthDate: '1998-09-28',
    email: 'naduy.hcmus@gmail.com',
    identityCardNo: '272683901',
    phoneNumber: '0948202709',
    address: 'Quận 9, TPHCM',
    avatar:
      'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
  },
  {
    companyId: 'VNG',
    username: 'admin1',
    employeeId: 'VNG-004',
    officeId: 'CAMPUS',
    department: 'ZPI',
    fullName: 'Võ Tấn Duy',
    birthDate: '1998-07-29',
    email: 'Duytv.2907@gmail.com',
    identityCardNo: '123456789',
    phoneNumber: '0912345678',
    address: 'Gò Vấp, TPHCM',
    avatar:
      'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
  },
  {
    companyId: 'VNG',
    username: 'admin',
    employeeId: 'VNG-0005',
    officeId: 'CAMPUS',
    department: 'PMA',
    fullName: 'Nguyễn Anh Duy',
    birthDate: '1998-09-28',
    email: 'naduy.hcmus@gmail.com',
    identityCardNo: '272683901',
    phoneNumber: '0948202709',
    address: 'Quận 9, TPHCM',
    avatar:
      'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
  },
  {
    companyId: 'VNG',
    username: 'admin1',
    employeeId: 'VNG-006',
    officeId: 'CAMPUS',
    department: 'ZPI',
    fullName: 'Võ Tấn Duy',
    birthDate: '1998-07-29',
    email: 'Duytv.2907@gmail.com',
    identityCardNo: '123456789',
    phoneNumber: '0912345678',
    address: 'Gò Vấp, TPHCM',
    avatar:
      'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
  },
  {
    companyId: 'VNG',
    username: 'admin',
    employeeId: 'VNG-0007',
    officeId: 'CAMPUS',
    department: 'PMA',
    fullName: 'Nguyễn Anh Duy',
    birthDate: '1998-09-28',
    email: 'naduy.hcmus@gmail.com',
    identityCardNo: '272683901',
    phoneNumber: '0948202709',
    address: 'Quận 9, TPHCM',
    avatar:
      'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
  },
  {
    companyId: 'VNG',
    username: 'admin1',
    employeeId: 'VNG-008',
    officeId: 'CAMPUS',
    department: 'ZPI',
    fullName: 'Võ Tấn Duy',
    birthDate: '1998-07-29',
    email: 'Duytv.2907@gmail.com',
    identityCardNo: '123456789',
    phoneNumber: '0912345678',
    address: 'Gò Vấp, TPHCM',
    avatar:
      'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
  },
  {
    companyId: 'VNG',
    username: 'admin',
    employeeId: 'VNG-0009',
    officeId: 'CAMPUS',
    department: 'PMA',
    fullName: 'Nguyễn Anh Duy',
    birthDate: '1998-09-28',
    email: 'naduy.hcmus@gmail.com',
    identityCardNo: '272683901',
    phoneNumber: '0948202709',
    address: 'Quận 9, TPHCM',
    avatar:
      'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
  },
  {
    companyId: 'VNG',
    username: 'admin1',
    employeeId: 'VNG-0010',
    officeId: 'CAMPUS',
    department: 'ZPI',
    fullName: 'Võ Tấn Duy',
    birthDate: '1998-07-29',
    email: 'Duytv.2907@gmail.com',
    identityCardNo: '123456789',
    phoneNumber: '0912345678',
    address: 'Gò Vấp, TPHCM',
    avatar:
      'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
  },
  {
    companyId: 'VNG',
    username: 'admin',
    employeeId: 'VNG-0011',
    officeId: 'CAMPUS',
    department: 'PMA',
    fullName: 'Nguyễn Anh Duy',
    birthDate: '1998-09-28',
    email: 'naduy.hcmus@gmail.com',
    identityCardNo: '272683901',
    phoneNumber: '0948202709',
    address: 'Quận 9, TPHCM',
    avatar:
      'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
  },
  {
    companyId: 'VNG',
    username: 'admin1',
    employeeId: 'VNG-0012',
    officeId: 'CAMPUS',
    department: 'ZPI',
    fullName: 'Võ Tấn Duy',
    birthDate: '1998-07-29',
    email: 'Duytv.2907@gmail.com',
    identityCardNo: '123456789',
    phoneNumber: '0912345678',
    address: 'Gò Vấp, TPHCM',
    avatar:
      'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
  }
];
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
    // const { data } = this.state;
    return (
      <div className="content">
        <div className="table-wrapper">
          <div className="header-table clearfix">
            <div className="float-left">
              <Search
                placeholder="Tìm mã nhân viên"
                style={{ width: 200 }}
                onChange={this.onSearch}
              />
            </div>
            {/* <div className="tool-calendar float-right">
              <CalendarTool update={this.updateData} />
            </div> */}
          </div>
          <div className="table-attendance">
            <TableEmployee columnsInput={columns} dataInput={data} />
          </div>
        </div>
      </div>
    );
  }
}

export default Employee;
