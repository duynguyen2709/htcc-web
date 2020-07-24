import React from 'react';
import 'antd/dist/antd.css';
import {Table} from 'antd';

const TableAttendance = (props) => {
    const {columns, data} = props;
    return (
        <Table rowKey={"username"}
               pagination={{pageSize: 6, hideOnSinglePage: true}}
               columns={columns}
               dataSource={data}
               scroll={{x: 1300, y: 'calc(100vh - 300px)'}}
               bordered={true}
               loading={data === null}
        />
    );
};

export default TableAttendance;
