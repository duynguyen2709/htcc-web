import React from 'react';
import { Button, CardFooter, Col, Form, FormGroup, Row } from 'reactstrap';
import * as _ from 'lodash';
import { checkinApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { DatePicker, Input, Popconfirm, Select } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

class FormAddCheckinRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                type: 1,
                username: '',
                reason: '',
                officeId: '',
                clientTime: moment(new Date()),
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

    componentWillReceiveProps(nextProps, nextState) {
        if (!_.isEqual(nextProps.data, this.props.data)) {
            const { data } = nextProps;
            const { canManageEmployees = [], canManageOffices = [] } = data;

            this.setState({
                canManageEmployees,
                canManageOffices,
                value: {
                    ...this.state.value,
                    username: _.isEmpty(canManageEmployees)
                        ? null
                        : _.get(canManageEmployees, '[0].username', ''),
                    officeId: _.isEmpty(canManageOffices)
                        ? null
                        : _.get(canManageOffices, '[0]', ''),
                },
            });
        }
    }

    handleOnChange = (e) => {
        const { value: valueInput, name } = e.target;
        let { value } = this.state;

        value[name] = valueInput;

        this.setState({
            value: { ...value },
        });
    };

    handleSubmit = (e) => {
        if (!_.isEmpty(this.state.value.reason)) {
            this.props.loading();
            let { value } = this.state;
            value = this.convertData(value);

            console.log('value', value);

            checkinApi
                .createCheckinRequest(value)
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
            this.props.stopLoading();
            store.addNotification(
                createNotify('warning', 'Bạn chưa nhập lý do')
            );
        }
    };

    clear = () => {
        this.setState({
            value: {
                ...this.state.value,
            },
        });
    };

    componentDidMount() {
        const { data = {} } = this.props;
        const { canManageEmployees = [], canManageOffices = [] } = data;

        this.setState({
            canManageEmployees,
            canManageOffices,
            value: {
                ...this.state.value,
                username: _.isEmpty(canManageEmployees)
                    ? null
                    : _.get(canManageEmployees, '[0].username', ''),
                officeId: _.isEmpty(canManageOffices)
                    ? null
                    : _.get(canManageOffices, '[0]', ''),
            },
        });
    }

    convertData = (data) => {
        _.set(data, 'clientTime', data['clientTime'].unix());

        return data;
    };

    handleChangeUser = (val) => {
        const { value } = this.state;
        this.setState({
            value: {
                ...value,
                username: val,
            },
        });
    };

    handleChangeOffice = (val) => {
        const { value } = this.state;
        this.setState({
            value: {
                ...value,
                officeId: val,
            },
        });
    };

    handleChangeType = (val) => {
        const { value } = this.state;
        this.setState({
            value: {
                ...value,
                type: val,
            },
        });
    };

    handleChangeDate = (val) => {
        const { value } = this.state;
        this.setState({
            value: {
                ...value,
                clientTime: val,
            },
        });
    };

    render() {
        const { value, canManageEmployees, canManageOffices } = this.state;

        return (
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Chi nhánh</label>
                            <Select
                                style={{ width: '100%' }}
                                className="bor-radius"
                                value={value.officeId}
                                onChange={(val) => this.handleChangeOffice(val)}
                                onCancel={() => this.clear()}
                            >
                                {_.map(canManageOffices, (office, i) => (
                                    <Option
                                        className=" bor-radius"
                                        value={office}
                                        key={i}
                                    >
                                        {office}
                                    </Option>
                                ))}
                            </Select>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Nhân viên</label>
                            <Select
                                style={{ width: '100%' }}
                                className="bor-radius"
                                value={value.username}
                                onChange={(val) => this.handleChangeUser(val)}
                                onCancel={() => this.clear()}
                            >
                                {_.map(canManageEmployees, (user, i) => (
                                    <Option
                                        className=" bor-radius"
                                        value={user.username}
                                        key={i}
                                    >
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Loại điểm danh</label>
                            <Select
                                style={{ width: '100%' }}
                                className="bor-radius"
                                defaultValue={1}
                                onChange={(val) => this.handleChangeType(val)}
                                onCancel={() => this.clear()}
                            >
                                <Option
                                    className=" bor-radius"
                                    value={1}
                                    key={1}
                                >
                                    Vào Ca
                                </Option>
                                <Option
                                    className=" bor-radius"
                                    value={2}
                                    key={2}
                                >
                                    Tan Ca
                                </Option>
                            </Select>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Thời gian điểm danh</label>
                            <DatePicker
                                className="form-control bor-radius"
                                format={'DD/MM/YYYY HH:mm'}
                                value={moment(value.clientTime)}
                                onChange={(val) => this.handleChangeDate(val)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="12">
                        <FormGroup>
                            <label>Lý do</label>
                            <TextArea
                                name="reason"
                                className="form-control bor-radius text-dark"
                                value={value.reason}
                                onChange={(e) => this.handleOnChange(e)}
                                rows={2}
                            />
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

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormAddCheckinRequest);
