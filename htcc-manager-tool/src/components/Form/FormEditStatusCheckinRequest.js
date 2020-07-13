import React from 'react';
import { Button, CardFooter, Col, Form, FormGroup, Row } from 'reactstrap';
import { checkinApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { DatePicker, Input, Popconfirm, Select } from 'antd';
import moment from 'moment';
import { USER } from '../../constant/localStorageKey';

const { Option } = Select;

class FormEditStatusCheckinRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                approver: null,
                status: 1,
                yyyyMM: moment(new Date()).format('yyyyMM'),
                checkInId: '',
            },
        };
    }

    handleChangeStatus = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                status: value,
            },
        });
    };

    componentDidMount() {
        const { data } = this.props;
        const user = JSON.parse(localStorage.getItem(USER));

        this.setState({
            value: {
                ...this.state.value,
                status: 1,
                approver: user.username,
                checkInId: data.checkInId,
            },
        });
    }

    handleSubmit = (e) => {
        this.props.loading();
        checkinApi
            .updateStatusCheckinRequest(this.state.value)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.props.onSubmit();
                    this.clear();
                } else {
                    this.props.stopLoading();
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                this.props.stopLoading();
                store.addNotification(
                    createNotify('danger', JSON.stringify(err))
                );
            });
    };

    clear = () => {
        this.setState({
            value: {
                ...this.state.value,
                response: null,
            },
        });
    };

    render() {
        const { value } = this.state;
        const { data } = this.props;

        return (
            <Form>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>ID</label>
                            <Input
                                className="form-control bor-radius bor-gray text-dark"
                                type="text"
                                name="leavingRequestId"
                                disabled
                                value={value.checkInId}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Nhân viên</label>
                            <Input
                                className="form-control bor-radius bor-gray text-dark"
                                type="text"
                                name="username"
                                disabled
                                value={data.username}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Tháng</label>
                            <DatePicker
                                className="form-control bor-radius"
                                format={'MM-YYYY'}
                                value={moment(value.yyyyMM, 'YYYYMM')}
                                disabled
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Người duyệt</label>
                            <Input
                                className="form-control bor-radius bor-gray text-dark"
                                type="text"
                                name="approver"
                                disabled
                                value={value.approver}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Trạng thái</label>
                            <Select
                                style={{ width: '100%' }}
                                className="bor-radius"
                                value={value.status}
                                onChange={(val) => this.handleChangeStatus(val)}
                                onCancel={() => this.clear()}
                            >
                                <Option className=" bor-radius" value={1}>
                                    Chấp nhận
                                </Option>
                                <Option className=" bor-radius" value={0}>
                                    Từ chối
                                </Option>
                            </Select>
                        </FormGroup>
                    </Col>
                </Row>
                <CardFooter className="text-right info">
                    <Popconfirm
                        title="Bạn chắc chắn thay đổi？"
                        icon={<QuestionCircleOutlined />}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onConfirm={() => this.handleSubmit()}
                    >
                        <Button
                            id="save"
                            className="btn-custom"
                            color="primary"
                            type="button"
                        >
                            <CheckCircleOutlined
                                style={{
                                    display: 'inline',
                                    margin: '5px 10px 0 0',
                                }}
                            />{' '}
                            {'  '}
                            <span className="btn-save-text"> LƯU</span>
                        </Button>
                    </Popconfirm>
                </CardFooter>
            </Form>
        );
    }
}

export default FormEditStatusCheckinRequest;
