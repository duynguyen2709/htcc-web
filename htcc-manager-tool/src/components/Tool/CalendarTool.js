import React from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';
import * as _ from 'lodash';

class CalendarTool extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: moment(),
        };
    }

    onChange = (value) => {
        if (!_.isEmpty(value)) {
            this.setState({
                value,
            });
            this.props.update(value);
        }
    };

    render() {
        const {picker = 'month', format = 'MM-YYYY', disabledDate} = this.props;
        return (
            <DatePicker
                disabledDate={disabledDate}
                className="form-control bor-radius"
                onChange={this.onChange}
                value={this.state.value}
                picker={picker}
                format={format}
            />
        );
    }
}

export default CalendarTool;
