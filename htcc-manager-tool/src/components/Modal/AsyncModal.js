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

  handleOk = (submit = true) => {
    const { reload = true } = this.props;
    this.setState({ loading: false });
    this.props.toggle(submit);
    store.addNotification(createNotify('default', 'Thao tác thành công !'));

    if (reload) {
      window.location.reload();
    }
  };

  handleCancel = () => {
    this.props.toggle();
  };

  render() {
    const { loading } = this.state;
    const {
      CompomentContent,
      visible,
      title,
      data,
      currDate,
      mode,
      onlyView = false,
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
          data={data}
          onSubmit={this.handleOk}
          currDate={currDate}
          loading={() => this.setState({ loading: true })}
          stopLoading={() => this.setState({ loading: false })}
          mode={mode}
          onlyView={onlyView}
        />
      </Modal>
    );
  }
}

export default AsyncModal;
