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
import {
    checkValidEmail,
    checkValidPhoneNumber,
    checkValidCMND,
    checkValidNumber,
} from '../../utils/validate';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { DatePicker, Select, Popconfirm } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { userApi } from '../../api';

const { Option } = Select;

const dateFormat = 'DD/MM/YYYY';

const INITFORM = {
    email: '',
    phoneNumber: '',
    address: '',
    identityCardNo: '',
    username: '',
    birthDate: moment(new Date(), dateFormat),
    department: '',
    officeId: '',
    employeeId: '',
    fullName: '',
    gender: 1,
    level: 0,
    title: '',
    avatar: '',
};

const TOUCH = {
    email: false,
    phoneNumber: false,
    address: false,
    identityCardNo: false,
    username: false,
    employeeId: false,
    fullName: false,
    level: false,
    title: false,
};

class FormAddNewEmployee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                ...INITFORM,
            },
            messageInvalid: {
                email: 'Email không hợp lệ',
                address: 'Địa chỉ không được rỗng',
                phoneNumber: 'Số điện thoại không hợp lệ',
                identityCardNo: 'CMND không hợp lệ',
                username: 'Tên đăng nhập không được rỗng',
                title: 'Chức vụ không được rỗng',
                fullName: 'Họ tên không được rỗng',
                employeeId: 'Mã nhân viên không được rỗng',
            },
            touch: {
                ...TOUCH,
            },
        };
    }

    componentDidMount() {
        const { data = {} } = this.props;

        this.setState({
            value: {
                ...INITFORM,
                department: _.get(data.canManageDepartments, '[0]', ''),
                officeId: _.get(data.canManageOffices, '[0]', ''),
            },
        });
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (
            !_.isEmpty(nextProps.data) &&
            !_.isEmpty(this.props.data) &&
            !_.isEqual(nextProps.data, this.props.data)
        ) {
            const { value } = this.state;
            const { data = {} } = nextProps;

            this.setState({
                value: {
                    ...value,
                    department: _.get(data.canManageDepartments, '[0]', ''),
                    officeId: _.get(data.canManageOffices, '[0]', ''),
                },
            });
        }
    }

    checkValidDataInput = () => {
        const {
            email,
            phoneNumber,
            address,
            username,
            identityCardNo,
            officeId,
            department,
            level,
            fullName,
            title,
            employeeId,
        } = this.state.value;

        this.setState({
            touch: {
                email: true,
                phoneNumber: true,
                address: true,
                username: true,
                identityCardNo: true,
                fullName: true,
                title: true,
                employeeId: true,
            },
        });

        return (
            checkValidEmail(email) &&
            checkValidCMND(identityCardNo) &&
            checkValidPhoneNumber(phoneNumber) &&
            checkValidNumber(level) &&
            !_.isEmpty(username) &&
            !_.isEmpty(address) &&
            !_.isEmpty(department) &&
            !_.isEmpty(officeId) &&
            !_.isEmpty(title) &&
            !_.isEmpty(fullName) &&
            !_.isEmpty(employeeId)
        );
    };

    handleOnChange = (e) => {
        const { value: valueInput, name } = e.target;
        let { value, touch } = this.state;

        value[name] = valueInput;
        touch[name] = true;

        this.setState({
            value: { ...value },
        });
    };

    handleChangeBithDate = (date) => {
        const { value } = this.state;
        if (!_.isEmpty(date)) {
            this.setState({
                value: {
                    ...value,
                    birthDate: moment(date, dateFormat),
                },
            });
        }
    };

    handleSubmit = (e) => {
        if (this.checkValidDataInput()) {
            const { value } = this.state;
            const data = { ...value };
            data['birthDate'] = value['birthDate'].format('YYYY-MM-DD');
            this.props.loading();

            userApi
                .createEmployee(data)
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
        } else {
            store.addNotification(
                createNotify('warning', 'Thông tin chưa hợp lệ !')
            );
        }
    };

    handleChangeOption = (value, key) => {
        this.setState({
            value: {
                ...this.state.value,
                [key]: value,
            },
        });
    };

    clear = () => {
        this.setState({
            value: { ...INITFORM },
            touch: { ...TOUCH },
        });
    };

    render() {
        const { value, messageInvalid, touch } = this.state;
        const { data = {} } = this.props;
        return (
            <Form>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label htmlFor="email">Họ và tên</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập họ và tên"
                                type="text"
                                onChange={this.handleOnChange}
                                name="fullName"
                                value={value.fullName}
                                invalid={
                                    touch.fullName && _.isEmpty(value.fullName)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.fullName}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="12">
                        <FormGroup>
                            <label htmlFor="email">Email</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập email"
                                type="email"
                                onChange={this.handleOnChange}
                                name="email"
                                value={value.email}
                                invalid={
                                    touch.email && !checkValidEmail(value.email)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.email}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="12">
                        <FormGroup>
                            <label>Địa chỉ</label>
                            <Input
                                placeholder="Nhập địa chỉ hiện tại"
                                type="text"
                                className="bor-gray text-dark"
                                name="address"
                                value={value.address}
                                onChange={this.handleOnChange}
                                invalid={
                                    touch.address && _.isEmpty(value.address)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.address}
                            </FormFeedback>
                        </FormGroup>
                    </Col>

                    <Col md="6">
                        <FormGroup>
                            <label>Ngày sinh</label>
                            <DatePicker
                                className="form-control bor-radius"
                                format={dateFormat}
                                value={moment(value.birthDate, dateFormat)}
                                onChange={this.handleChangeBithDate}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Giới tính</label>
                            <Select
                                style={{ width: '100%' }}
                                className="bor-radius"
                                onChange={(val) =>
                                    this.handleChangeOption(val, 'gender')
                                }
                                onCancel={() => this.clear()}
                                value={value.gender}
                            >
                                <Option className=" bor-radius" value={0}>
                                    Nữ
                                </Option>
                                <Option className=" bor-radius" value={1}>
                                    Nam
                                </Option>
                            </Select>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>CMND</label>
                            <Input
                                placeholder="Nhập CMND"
                                type="text"
                                className="bor-gray text-dark"
                                onChange={this.handleOnChange}
                                name="identityCardNo"
                                value={value.identityCardNo}
                                invalid={
                                    touch.identityCardNo &&
                                    !checkValidCMND(value.identityCardNo)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.identityCardNo}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Số điện thoại</label>
                            <Input
                                placeholder="Nhập số điện thoại"
                                type="text"
                                className="bor-gray text-dark"
                                onChange={this.handleOnChange}
                                name="phoneNumber"
                                value={value.phoneNumber}
                                invalid={
                                    touch.phoneNumber &&
                                    !checkValidPhoneNumber(value.phoneNumber)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.phoneNumber}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label htmlFor="email">Mã nhân viên</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập mã nhân viên"
                                type="text"
                                onChange={this.handleOnChange}
                                name="employeeId"
                                value={value.employeeId}
                                invalid={
                                    touch.employeeId &&
                                    _.isEmpty(value.employeeId)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.employeeId}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label htmlFor="email">Tên đăng nhập</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập Tên đăng nhập"
                                type="text"
                                onChange={this.handleOnChange}
                                name="username"
                                value={value.username}
                                invalid={
                                    touch.username && _.isEmpty(value.username)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.username}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Chức vụ</label>
                            <Input
                                placeholder="Nhập chức danh"
                                type="text"
                                className="bor-gray text-dark"
                                onChange={this.handleOnChange}
                                name="title"
                                value={value.title}
                                invalid={touch.title && _.isEmpty(value.title)}
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.title}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Cấp bậc</label>
                            <Input
                                placeholder="Nhập cấp bậc"
                                type="number"
                                className="bor-gray text-dark"
                                onChange={this.handleOnChange}
                                name="level"
                                value={value.level}
                                invalid={
                                    touch.level &&
                                    !checkValidNumber(value.level)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.level}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label> Văn phòng</label>
                            <Select
                                style={{ width: '100%' }}
                                className="bor-radius"
                                onChange={(val) =>
                                    this.handleChangeOption(val, 'officeId')
                                }
                                onCancel={() => this.clear()}
                                value={value.officeId}
                            >
                                {_.map(data.canManageOffices, (d, i) => {
                                    return (
                                        <Option
                                            key={`of-${i}`}
                                            className=" bor-radius"
                                            value={d}
                                        >
                                            {d}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Phòng ban</label>
                            <Select
                                style={{ width: '100%' }}
                                className="bor-radius"
                                onChange={(val) =>
                                    this.handleChangeOption(val, 'department')
                                }
                                onCancel={() => this.clear()}
                                value={value.department}
                            >
                                {_.map(data.canManageDepartments, (d, i) => {
                                    return (
                                        <Option
                                            key={`de-${i}`}
                                            className=" bor-radius"
                                            value={d}
                                        >
                                            {d}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </FormGroup>
                    </Col>
                </Row>

                <CardFooter className="text-right info">
                    <Popconfirm
                        title="Bạn chắc chắn muốn lưu？"
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
                            <span className="btn-save-text"> LƯU</span>
                        </Button>
                    </Popconfirm>
                </CardFooter>
            </Form>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

export default connect(mapStateToProps)(FormAddNewEmployee);
