import React from 'react';
import TableAttendance from '../components/Table/Attendance';
import { genColTableAttendance } from '../utils/dataTable';
import moment from 'moment';

class Attendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: [],
      month: 1
    };
  }

  componentDidMount() {
    const columns = genColTableAttendance(30);
    const data = [
      {
        code: 'antt',
        attendance: {
          1: {
            checkin: moment(new Date(0, 0, 0, 8, 12, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          },
          3: {
            checkin: moment(new Date(0, 0, 0, 9, 15, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          },
          7: {
            checkin: moment(new Date(0, 0, 0, 8, 55, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          }
        }
      },
      {
        code: 'hieunt',
        attendance: {
          4: {
            checkin: moment(new Date(0, 0, 0, 9, 0, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          },
          5: {
            checkin: moment(new Date(0, 0, 0, 9, 22, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 11, 29, 0)).format('HH:mm')
          },
          6: {
            checkin: moment(new Date(0, 0, 0, 9, 30, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 18, 29, 0)).format('HH:mm')
          }
        }
      },
      {
        code: 'antt22',
        attendance: {
          1: {
            checkin: moment(new Date(0, 0, 0, 9, 12, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          },
          2: {
            checkin: moment(new Date(0, 0, 0, 8, 50, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 8, 29, 0)).format('HH:mm')
          },
          3: {
            checkin: moment(new Date(0, 0, 0, 9, 12, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          }
        }
      },
      {
        code: 'hieunt22',
        attendance: {
          4: {
            checkin: moment(new Date(0, 0, 0, 8, 57, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          },
          18: {
            checkin: moment(new Date(0, 0, 0, 8, 12, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          },
          18: {
            checkin: moment(new Date(0, 0, 0, 8, 20, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          }
        }
      },
      {
        code: 'antt12',
        attendance: {
          7: {
            checkin: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          },
          8: {
            checkin: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          },
          18: {
            checkin: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          }
        }
      },
      {
        code: 'hieunt',
        attendance: {
          1: {
            checkin: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          },
          2: {
            checkin: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          },
          3: {
            checkin: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          }
        }
      },
      {
        code: 'hieunt1',
        attendance: {
          1: {
            checkin: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          },
          5: {
            checkin: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          },
          8: {
            checkin: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm'),
            checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
          }
        }
      }
    ];

    this.setState({
      data,
      columns
    });
  }

  render() {
    const { data, columns, month } = this.state;
    return (
      <div className="content">
        <div className="table-wrapper">
          <div className="header-table clearfix">
            <h6 className="title-table float-left">{`DANH SÁCH NHÂN VIÊN ĐIỂM DANH THÁNG ${month}`}</h6>
          </div>
          <TableAttendance data={data} columns={columns} />
        </div>
      </div>
    );
  }
}

export default Attendance;
