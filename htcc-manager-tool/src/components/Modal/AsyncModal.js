import React from 'react';
import {Modal} from 'antd';
import {SubmitLoader} from '../Loader';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';

class AsyncModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    handleOk = (submit = true, data = {}) => {
        const {reload = true} = this.props;
        this.setState({loading: false});
        this.props.toggle(submit, data);
        store.addNotification(createNotify('default', 'Thao tác thành công !'));

        if (reload) {
            window.location.reload();
        }
    };

    handleCancel = () => {
        this.props.toggle(false);
    };

    render() {
        const {loading} = this.state;
        const {
            CompomentContent,
            visible,
            title,
            data,
            currDate,
            mode,
            onlyView = false,
            listData = [],
            prop = {},
        } = this.props;

        return (
            <Modal
                visible={visible}
                title={title ? title : ''}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
            >
                {loading && <SubmitLoader/>}
                {CompomentContent ?
                    <CompomentContent
                        data={data ? data : {}}
                        onSubmit={this.handleOk}
                        currDate={currDate}
                        loading={() => this.setState({loading: true})}
                        stopLoading={() => this.setState({loading: false})}
                        mode={mode}
                        onlyView={onlyView}
                        listData={listData}
                        {...prop}
                    /> : null}
            </Modal>
        );
    }
}

export default AsyncModal;
