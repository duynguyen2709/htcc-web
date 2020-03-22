import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import * as _ from 'lodash';

class CalendarTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: moment()
    };
  }

  onChange = value => {
    if (!_.isEmpty(value)) {
      this.setState({
        value
      });
      this.props.update(value.month() + 1);
    }
  };

  render() {
    return (
      <DatePicker
        onChange={this.onChange}
        value={this.state.value}
        picker="month"
      />
    );
  }
}

export default CalendarTool;
