import React from 'react';
import 'antd/dist/antd.css';
import {Table} from 'antd';

class TableAttendance extends React.Component {
    render() {
        const {columns, data} = this.props;
        return (
            <Table
                pagination={{pageSize: 6}}
                columns={columns}
                dataSource={data}
                scroll={{x: 1300}}
            />
        );
    }
}

export default TableAttendance;
