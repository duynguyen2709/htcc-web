import React from 'react';
import { Col, FormGroup } from 'reactstrap';
import { DatePicker, Select } from 'antd';
import moment from 'moment';
import * as _ from 'lodash';

const { Option } = Select;

class RequestComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment(new Date()),
            session: 0,
        };
    }

    handleChangeSession = (value) => {
        this.setState({
            ...this.state.value,
            session: value,
        });
    };

    handleChangeDate = (date) => {
        if (!_.isEmpty(date)) {
            this.setState({
                date: moment(date),
            });
        }
    };

    render() {
        const { date, session } = this.state;
        console.log('state', this.state);
        return (
            <React.Fragment>
                <Col md="5">
                    <FormGroup>
                        <label>Ngày</label>
                        <DatePicker
                            className="form-control bor-radius"
                            format={'DD/MM/YYYY'}
                            value={moment(date)}
                            onChange={(val) => this.handleChangeDate(val)}
                        />
                    </FormGroup>
                </Col>
                <Col md="5">
                    <FormGroup>
                        <label>Ca nghỉ</label>
                        <Select
                            style={{ width: '100%' }}
                            className="bor-radius"
                            defaultValue={0}
                            onChange={(val) => this.handleChangeSession(val)}
                            onCancel={() => this.clear()}
                            value={session}
                        >
                            <Option className=" bor-radius" value={0}>
                                Cả ngày
                            </Option>
                            <Option className=" bor-radius" value={1}>
                                Sáng
                            </Option>
                            <Option className=" bor-radius" value={2}>
                                Chiều
                            </Option>
                        </Select>
                    </FormGroup>
                </Col>
            </React.Fragment>
        );
    }
}

export default RequestComponent;
