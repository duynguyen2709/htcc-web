import React from 'react';
import TableEmployee from '../components/Table/Employee';
import { columnsEmployee } from '../constant/tableEmployee';

class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    const data = [
      {
        code: '1',
        name: 'Baran',
        birthday: '2/2/2020',
        address: 'abc abc abcabac',
        status: 1,
        phoneNumber: '0987654321',
        department: 'ABCDEFGH'
      },
      {
        code: '2',
        name: 'Baran',
        birthday: '2/2/2020',
        address: 'abc abc abcabac',
        status: 1,
        phoneNumber: '0987654321',
        department: 'ABCDEFGH'
      },
      {
        code: '3',
        name: 'Baran',
        birthday: '2/2/2020',
        address: 'abc abc abcabac',
        status: 0,
        phoneNumber: '0987654321',
        department: 'ABCDEFGH'
      },
      {
        code: '4',
        name: 'Baran',
        birthday: '2/2/2020',
        address: 'abc abc abcabac',
        status: 1,
        phoneNumber: '0987654321',
        department: 'ABCDEFGH'
      },
      {
        code: '5',
        name: 'Baran',
        birthday: '2/2/2020',
        address: 'abc abc abcabac',
        status: 0,
        phoneNumber: '0987654321',
        department: 'ABCDEFGH'
      },
      {
        code: '6',
        name: 'Baran',
        birthday: '2/2/2020',
        address: 'abc abc abcabac',
        status: 1,
        phoneNumber: '0987654321',
        department: 'ABCDEFGH'
      },
      {
        code: '1',
        name: 'Baran',
        birthday: '2/2/2020',
        address: 'abc abc abcabac',
        status: 1,
        phoneNumber: '0987654321',
        department: 'ABCDEFGH'
      },
      {
        code: '2',
        name: 'Baran',
        birthday: '2/2/2020',
        address: 'abc abc abcabac',
        status: 1,
        phoneNumber: '0987654321',
        department: 'ABCDEFGH'
      },
      {
        code: '3',
        name: 'Baran',
        birthday: '2/2/2020',
        address: 'abc abc abcabac',
        status: 0,
        phoneNumber: '0987654321',
        department: 'ABCDEFGH'
      },
      {
        code: '4',
        name: 'Baran',
        birthday: '2/2/2020',
        address: 'abc abc abcabac',
        status: 1,
        phoneNumber: '0987654321',
        department: 'ABCDEFGH'
      },
      {
        code: '5',
        name: 'Baran',
        birthday: '2/2/2020',
        address: 'abc abc abcabac',
        status: 0,
        phoneNumber: '0987654321',
        department: 'ABCDEFGH'
      },
      {
        code: '6',
        name: 'Baran',
        birthday: '2/2/2020',
        address: 'abc abc abcabac',
        status: 1,
        phoneNumber: '0987654321',
        department: 'ABCDEFGH'
      }
    ];
    this.setState({
      data
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
