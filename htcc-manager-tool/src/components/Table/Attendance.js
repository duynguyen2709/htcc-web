import React from 'react';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import * as _ from 'lodash';

class TableAttendance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (!_.isEqual(this.props.data, nextProps.data)) {
            this.setState({
                data: nextProps.data,
            });
        }
    }

    componentDidMount() {
        if (this.props.data) {
            this.setState({
                data: this.props.data,
            });
        }
    }

    render() {
        const { columns } = this.props;
        const { data } = this.state;

        return (
            <Table
                pagination={{ pageSize: 6, hideOnSinglePage: true }}
                columns={columns}
                dataSource={data}
                scroll={{ x: 1300, y: 'calc(100vh - 250px)' }}
                bordered={true}
                loading={data === null}
            />
        );
    }
}

export default TableAttendance;
