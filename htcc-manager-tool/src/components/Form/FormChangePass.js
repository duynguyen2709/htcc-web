import React from 'react';
import {
    Button,
    CardFooter,
    Col,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Row,
} from 'reactstrap';
import * as _ from 'lodash';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { userApi } from '../../api';

const INITFORM = {
    newPassword: '',
    oldPassword: '',
    confirmPassword: '',
};

const RESET_TOUCH = {
    newPassword: false,
    oldPassword: false,
};

class FormChangePass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: { ...INITFORM },
            messageInvalid: {
                newPassword: 'Mật khẩu ít nhất 6 kí tự',
                confirmPassword: 'Mật khẩu mới nhập không trùng khớp',
                oldPassword: 'Mật khẩu hiện tại không được để trống',
            },
            touch: {
                ...RESET_TOUCH,
            },
            eye: {
                newPassword: false,
                oldPassword: false,
                confirmPassword: false,
            },
        };
    }

    componentDidMount() {
        this.setState({
            value: {
                ...this.state.value,
            },
        });
    }

    checkValidDataInput = () => {
        const { newPassword, confirmPassword } = this.state.value;

        return (
            newPassword.length >= 6 && _.isEqual(newPassword, confirmPassword)
        );
    };

    handleOnChange = (e) => {
        const { value: valueInput, name } = e.target;
        let { value, touch } = this.state;
        debugger;

        value[name] = valueInput;
        touch[name] = true;
        this.setState({
            value: { ...value },
            touch: { ...touch },
        });
    };

    clear = () => {
        this.setState({
            value: { ...INITFORM },
            touch: { ...RESET_TOUCH },
            eye: {
                newPassword: false,
                oldPassword: false,
                confirmPassword: false,
            },
        });
    };

    handleSubmit = (e) => {
        if (this.checkValidDataInput()) {
            const { value } = this.state;

            this.props.loading();
            userApi
                .updatePassword(value)
                .then((res) => {
                    if (res.returnCode === 1) {
                        this.props.onSubmit(true);
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
        } else {
            this.setState({
                touch: {
                    newPassword: true,
                    oldPassword: true,
                    confirmPassword: true,
                },
            });

            store.addNotification(
                createNotify('warning', 'Thông tin chưa hợp lệ !')
            );
        }
    };

    toggleEye = (key) => {
        this.setState({
            eye: {
                ...this.state.eye,
                [key]: !this.state.eye[key],
            },
        });
    };

    render() {
        const { value, messageInvalid, touch, eye } = this.state;

        return (
            <Form>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label htmlFor="email">Mật khẩu hiện tại</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập mật khẩu hiện tại"
                                type={`${
                                    eye.oldPassword ? 'text' : 'password'
                                }`}
                                onChange={this.handleOnChange}
                                name="oldPassword"
                                value={value.oldPassword}
                                invalid={
                                    touch.oldPassword &&
                                    _.isEmpty(value.oldPassword)
                                }
                                maxLength={30}
                            />
                            <i
                                onClick={() => this.toggleEye('oldPassword')}
                                class={`eye-password fa ${
                                    eye.oldPassword ? 'fa-eye' : 'fa-eye-slash'
                                }`}
                                aria-hidden="true"
                            ></i>
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.oldPassword}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="12">
                        <FormGroup>
                            <label>Mật khẩu mới</label>
                            <Input
                                placeholder="Nhập mật khẩu mới"
                                type={`${
                                    eye.newPassword ? 'text' : 'password'
                                }`}
                                className="bor-gray text-dark"
                                onChange={this.handleOnChange}
                                name="newPassword"
                                value={value.newPassword}
                                invalid={
                                    touch.newPassword &&
                                    value.newPassword.length < 6
                                }
                                maxLength={30}
                            />
                            <i
                                class={`eye-password fa ${
                                    eye.newPassword ? 'fa-eye' : 'fa-eye-slash'
                                }`}
                                aria-hidden="true"
                                onClick={() => this.toggleEye('newPassword')}
                            ></i>

                            <FormFeedback invalid={'true'}>
                                {messageInvalid.newPassword}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="12">
                        <FormGroup>
                            <label>Xác nhận mật khẩu mới</label>
                            <Input
                                placeholder="Nhập lại mật khẩu mới"
                                type={`${
                                    eye.confirmPassword ? 'text' : 'password'
                                }`}
                                className="bor-gray text-dark"
                                onChange={this.handleOnChange}
                                name="confirmPassword"
                                value={value.confirmPassword}
                                invalid={
                                    touch.confirmPassword &&
                                    !_.isEqual(
                                        value.confirmPassword,
                                        value.newPassword
                                    )
                                }
                                maxLength={30}
                            />
                            <i
                                class={`eye-password fa ${
                                    eye.confirmPassword
                                        ? 'fa-eye'
                                        : 'fa-eye-slash'
                                }`}
                                aria-hidden="true"
                                onClick={() =>
                                    this.toggleEye('confirmPassword')
                                }
                            ></i>

                            <FormFeedback invalid={'true'}>
                                {messageInvalid.confirmPassword}
                            </FormFeedback>
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
                            <span className="btn-save-text"> Cập nhật </span>
                        </Button>
                    </Popconfirm>
                </CardFooter>
            </Form>
        );
    }
}

export default FormChangePass;
