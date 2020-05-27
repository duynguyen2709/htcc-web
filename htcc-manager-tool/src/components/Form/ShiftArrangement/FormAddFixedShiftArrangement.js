import React from 'react';
import {Button, CardFooter, Col, Form, FormFeedback, FormGroup, Input, Row,} from 'reactstrap';
import * as _ from 'lodash';
import {store} from 'react-notifications-component';
import {createNotify} from '../../../utils/notifier';
import {CheckCircleOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Popconfirm, Select} from 'antd';
import {shiftArrangement} from '../../../api';

const RESET_TOUCH = {
    officeId: false,
    shiftId: false,
    weekDay: false,
    username: false,
    type: false,
};

const WEEK_DAYS = {
    0: '',
    1: "Chủ nhật",
    2: "Thứ hai",
    3: "Thứ ba",
    4: "Thứ tư",
    5: "Thứ năm",
    6: "Thứ sáu",
    7: "Thứ bảy",
};

class FormAddFixedShiftArrangement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                officeId: '',
                shiftId: '',
                weekDay: 0,
                username: this.props.employeeList[0].username,
                type: 0
            },
            messageInvalid: {
                officeId: 'Vui lòng nhập mã văn phòng',
                weekDay: 'Vui lòng nhập thứ',
                shiftId: 'Vui lòng nhập mã ca',
                username: 'Vui lòng nhập tên nhân viên',
                type: 'Vui lòng chọn loại ca',
            },
            touch: {
                ...RESET_TOUCH,
            },
        };
    }

    componentDidMount() {
        const {data = {}} = this.props;

        this.setState({
            value: {
                ...data,
            },
        });
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (!_.isEqual(nextProps.data, prevState.value)) {
            return {
                value: {
                    ...prevState.value,
                    ...nextProps.data,
                },
            };
        }

        return null;
    };

    checkValidDataInput = () => {
        const {value} = this.state;

        return (
            !_.isEmpty(value.username) &&
            !_.isEmpty(value.officeId) &&
            !_.isEmpty(value.shiftId) &&
            (value.type === 1 || value.type === 2) &&
            (WEEK_DAYS[value.weekDay] !== null)
        );
    };

    clear = () => {
        this.setState({
            value: {
                officeId: '',
                shiftId: '',
                weekDay: 0,
                username: this.props.employeeList[0].username,
                type: 0
            },
            touch: {...RESET_TOUCH},
        });
    };

    handleSubmit = (e) => {
        if (this.checkValidDataInput()) {
            const {value} = this.state;

            this.props.loading();
            shiftArrangement
                .createShiftArrangement(value)
                .then((res) => {
                    if (res.returnCode === 1) {
                        this.clear();
                        this.props.onSubmit(true);
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
                    officeId: true,
                    shiftId: true,
                    weekDay: true,
                    username: true,
                    type: true,
                },
            });
            store.addNotification(
                createNotify('warning', 'Thông tin chưa hợp lệ !')
            );
        }
    };

    handleOnChangeUsername = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                username: value,
            },
        }, () => console.log(this.state));
    };

    render() {
        const {value, messageInvalid, touch} = this.state;
        const {employeeList} = this.props;

        return (
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Mã chi nhánh</label>
                            <Input
                                className="bor-gray text-dark form-input-disabled"
                                name="shiftId"
                                type="text"
                                value={value.officeId}
                                disabled
                                invalid={
                                    touch.officeId &&
                                    _.isEmpty(value.officeId)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.officeId}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Mã ca</label>
                            <Input
                                className="bor-gray text-dark"
                                name="shiftId"
                                type="text"
                                value={value.shiftId}
                                disabled
                                invalid={
                                    touch.shiftId &&
                                    _.isEmpty(value.shiftId)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.shiftId}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Loại ca</label>
                            <Input
                                className="bor-gray text-dark"
                                name="type"
                                type="text"
                                value={value.type === 1 ? "Ca cố định" : (value.type === 2 ? "Ca linh động" : '')}
                                disabled
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.type}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Thứ</label>
                            <Input
                                className="bor-gray text-dark"
                                name="weekDay"
                                type="text"
                                value={WEEK_DAYS[value.weekDay]}
                                disabled
                                invalid={
                                    touch.weekDay && (value.weekDay < 1 || value.weekDay > 7)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.weekDay}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Tên Nhân Viên</label>
                            <Select
                                allowClear={false}
                                autoFocus
                                style={{width: '100%'}}
                                className="bor-radius"
                                onChange={(val) => this.handleOnChangeUsername(val)}
                                value={value.username}
                            >
                                {_.map(employeeList, (item) => (
                                    <Select.Option className=" bor-radius"
                                                   value={item.username}
                                                   key={item.username}
                                    >
                                        {item.fullName} ({item.username})
                                    </Select.Option>
                                ))}
                            </Select>
                        </FormGroup>
                    </Col>
                </Row>
                <CardFooter className="text-right info">
                    <Popconfirm
                        title="Bạn chắc chắn xếp ca？"
                        icon={<QuestionCircleOutlined/>}
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

export default FormAddFixedShiftArrangement;
