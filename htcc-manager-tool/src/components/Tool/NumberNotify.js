import React from 'react';
import * as _ from 'lodash';
import { complaintApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import { connect } from 'react-redux';

class NumberNotify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '5+'
    };
  }

  componentDidMount() {
    complaintApi
      .getTotal()
      .then(res => {
        if (res.returnCode === 1) {
          this.setState({
            value: res.data.pendingComplaint
          });
        } else {
          store.addNotification(createNotify('danger', res.returnMessage));
        }
      })
      .catch(err => {
        store.addNotification(createNotify('danger', JSON.stringify(err)));
      });
  }

  render() {
    const { value } = this.state;
    return <div className="number-notify">{value}</div>;
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user
});

const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(NumberNotify);
