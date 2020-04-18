import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';

class NumberNotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.value, this.state.value)) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  render() {
    const { value } = this.state;

    if (value) {
      return <div className="number-notify">{value > 10 ? '10+' : (value <= 0) ? '' : value}</div>;
    }

    return null;
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user
});

const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(NumberNotify);
