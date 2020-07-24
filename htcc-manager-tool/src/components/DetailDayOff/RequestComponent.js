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

    handleChange = (key, value) => {
        this.setState({
            ...this.state,
            [key]: value,
        });

        if (_.isFunction(this.props.returnValue)) {
            this.props.returnValue(
                this.props.index,
                this.converData({
                    ...this.state,
                    [key]: value,
                })
            );
        }
    };

    componentDidMount() {
        const { index = 0, returnValue } = this.props;

        if (_.isFunction(returnValue)) {
            returnValue(index, this.converData(this.state));
        }
    }

    converData = (data) => {
        const result = _.cloneDeep(data);
        result['date'] = data['date'].format('YYYYMMDD');

        return result;
    };

    render() {
        const { date, session } = this.state;
        return (
            <React.Fragment>
                <Col md="5">
                    <FormGroup>
                        <label>Ngày</label>
                        <DatePicker
                            className="form-control bor-radius"
                            format={'DD/MM/YYYY'}
                            value={date}
                            onChange={(val) => this.handleChange('date', val)}
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
                            onChange={(val) =>
                                this.handleChange('session', val)
                            }
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
