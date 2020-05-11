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
import { Popconfirm, TimePicker } from 'antd';
import { workScheduleApi } from '../../api';
import { checkValidNumber } from '../../utils/validate';
import moment from 'moment';

const { RangePicker } = TimePicker;

const INITFORM = {
    allowLateMinutes: '',
    shiftId: '',
};

const RESET_TOUCH = {
    allowLateMinutes: false,
    shiftId: false,
    timeRange: false,
};

class FormEditShiftTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: { ...INITFORM },
            messageInvalid: {
                allowLateMinutes: 'Chưa nhập số phút',
                shiftId: 'ID là số và duy nhất',
                timeRange: 'Chưa nhập thời gian',
            },
            touch: {
                ...RESET_TOUCH,
            },
            timeRange: null,
        };
    }

    componentDidMount() {
        const { data = {} } = this.props;

        this.setState({
            value: {
                ...data,
            },

            timeRange: [
                new moment(`2020-01-01 ${data.startTime}`),
                new moment(`2020-01-01 ${data.endTime}`),
            ],
        });
    }

    checkValidDataInput = () => {
        const { value, timeRange } = this.state;

        return (
            checkValidNumber(value.allowLateMinutes) &&
            this.checkTimeRange(timeRange)
        );
    };

    handleOnChange = (e) => {
        const { value: valueInput, name, type } = e.target;
        let { value, touch } = this.state;

        value[name] = type === 'number' ? parseInt(valueInput) : valueInput;
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
            timeRange: [null, null],
        });
    };

    handleSubmit = (e) => {
        if (this.checkValidDataInput()) {
            const { value } = this.state;
            value['officeId'] = this.props.officeId;

            this.props.loading();
            workScheduleApi
                .updateShiftTime(value)
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
                    allowLateMinutes: true,
                    shiftId: true,
                    timeRange: true,
                },
            });
            store.addNotification(
                createNotify('warning', 'Thông tin chưa hợp lệ !')
            );
        }
    };

    onChangeTime = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                startTime: _.isEmpty(value) ? null : value[0].format('HH:mm'),
                endTime: _.isEmpty(value) ? null : value[1].format('HH:mm'),
            },
            timeRange: value,
            touch: {
                ...this.state.touch,
                timeRange: true,
            },
        });
    };

    checkTimeRange = (timeRange = []) => {
        return (
            !_.isEmpty(timeRange) &&
            !_.isEmpty(timeRange[0]) &&
            !_.isEmpty(timeRange[1])
        );
    };

    render() {
        const { value, messageInvalid, touch, timeRange } = this.state;

        return (
            <Form>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>ID</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập ID"
                                type="number"
                                name="shiftId"
                                value={value.shiftId}
                                disabled
                                min={0}
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.shiftId}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Thời gian</label>
                            <RangePicker
                                value={timeRange}
                                onChange={this.onChangeTime}
                                format="HH:mm"
                                placeholder={['Bắt đầu', 'Kết thúc']}
                                className="form-control bor-radius"
                                minuteStep={5}
                            />
                            {touch.timeRange &&
                                !this.checkTimeRange(timeRange) && (
                                    <FormFeedback>
                                        {messageInvalid.timeRange}
                                    </FormFeedback>
                                )}
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label htmlFor="email">Thời gian trễ (phút)</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập số phút"
                                type="number"
                                name="allowLateMinutes"
                                onChange={this.handleOnChange}
                                value={value.allowLateMinutes}
                                invalid={
                                    touch.allowLateMinutes &&
                                    !checkValidNumber(value.allowLateMinutes)
                                }
                                min={1}
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.allowLateMinutes}
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
                            <span className="btn-save-text"> LƯU</span>
                        </Button>
                    </Popconfirm>
                </CardFooter>
            </Form>
        );
    }
}

export default FormEditShiftTime;
