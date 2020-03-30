import React from 'react';
import { Modal } from 'antd';
import { SubmitLoader } from '../Loader';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';

class AsyncModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      this.props.toggle();
      store.addNotification(createNotify('default', 'Thêm mới thành công !'));
    }, 3000);
  };

  handleCancel = () => {
    this.props.toggle();
  };

  render() {
    const { loading } = this.state;
    const { CompomentContent = null, visible } = this.props;
    return (
      <Modal
        visible={visible}
        title="Thêm nhân viên mới"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
      >
        {loading && <SubmitLoader />}
        <CompomentContent onSubmit={this.handleOk} />
      </Modal>
    );
  }
}

export default AsyncModal;
