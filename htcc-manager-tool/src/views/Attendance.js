import React from 'react';
import TableAttendance from '../components/Table/Attendance';
import {genColTableAttendance} from '../utils/dataTable';
import moment from 'moment';
import CalendarTool from '../components/Tool/CalendarTool';
import {Input} from 'antd';
import * as _ from 'lodash';

const {Search} = Input;

class Attendance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [],
            month: moment().month() + 1
        };

        this.data = [];
    }

    componentDidMount() {
        const columns = genColTableAttendance(30);
        const data = [
            {
                key: 1,
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
                key: 2,
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
                key: 3,
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
                key: 4,
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
                    19: {
                        checkin: moment(new Date(0, 0, 0, 8, 20, 29, 0)).format('HH:mm'),
                        checkout: moment(new Date(0, 0, 0, 18, 12, 29, 0)).format('HH:mm')
                    }
                }
            },
            {
                key: 5,
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
                key: 6,
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
                key: 7,
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

        this.data = _.cloneDeep(data);

        this.setState({
            data,
            columns
        });
    }

    onSearch = e => {
        let {data} = this.state;
        data = _.filter(this.data, ele => ele.code.includes(e.target.value));
        this.setState({
            data
        });
    };

    updateData = month => {
        //update data

        this.setState({
            month
        });
    };

    render() {
        const {data, columns} = this.state;
        return (
            <div className="content">
                <div className="table-wrapper">
                    <div className="header-table clearfix">
                        <div className="float-left">
                            <Search
                                className="form-control bor-radius"
                                placeholder="Tìm mã nhân viên"
                                style={{width: 300}}
                                onChange={this.onSearch}
                            />
                        </div>
                        <div className="tool-calendar float-right">
                            <CalendarTool update={this.updateData}/>
                        </div>
                    </div>
                    <div className="table-edit">
                        <TableAttendance data={data} columns={columns}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Attendance;
