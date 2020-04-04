import React from 'react';
import { Modal } from 'antd';
import { SubmitLoader } from '../Loader';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';

class AsyncModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      this.props.toggle(true);
      store.addNotification(createNotify('default', 'Thao tác thành công !'));
      window.location.reload();
    }, 3000);
  };

  handleCancel = () => {
    this.props.toggle();
  };

  render() {
    const { loading } = this.state;
    const {
      CompomentContent = null,
      visible,
      title,
      data = [],
      editURL,
      mode = 'create',
      currDate,
    } = this.props;
    return (
      <Modal
        visible={visible}
        title={title}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
      >
        {loading && <SubmitLoader />}
        <CompomentContent
          editURL={editURL}
          data={data}
          onSubmit={this.handleOk}
          currDate={currDate}
        />
      </Modal>
    );
  }
}

export default AsyncModal;
