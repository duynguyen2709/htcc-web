import React from 'react';
import {Button, CardFooter, Col, Form, FormFeedback, FormGroup, Input, Row,} from 'reactstrap';
import * as _ from 'lodash';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {CheckCircleOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Popconfirm, Select, TimePicker} from 'antd';
import {workScheduleApi} from '../../api';
import {checkValidNumber} from '../../utils/validate';

const {RangePicker} = TimePicker;

const INITFORM = {
    allowLateMinutes: 0,
    shiftId: '',
    shiftName: '',
    allowDiffTime: false,
    startTime: '',
    endTime: '',
    timeRange: [],
    dayCount: 0,
};

const RESET_TOUCH = {
    allowLateMinutes: false,
    shiftId: false,
    shiftName: false,
    allowDiffTime: false,
    dayCount: false,
    timeRange: false,
    startTime: false,
    endTime: false,
};

class FormNewShiftTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {...INITFORM},
            messageInvalid: {
                allowLateMinutes: 'Vui lòng nhập số phút',
                allowDiffTime: 'Vui lòng nhập cho phép điểm danh khác giờ hay không',
                shiftId: 'Vui lòng nhập mã ca',
                shiftName: 'Vui lòng nhập tên ca',
                dayCount: 'Vui lòng nhập số ngày công',
                timeRange: 'Vui lòng nhập thời gian bắt đầu và kết thúc ca',
            },
            touch: {
                ...RESET_TOUCH,
            },
            timeRange: [null, null],
        };
    }

    checkValidDataInput = () => {
        const {value, timeRange} = this.state;

        return (
            !_.isEmpty(value.shiftId) &&
            !_.isEmpty(value.shiftName) &&
            checkValidNumber(value.dayCount) &&
            checkValidNumber(value.allowLateMinutes) &&
            this.checkTimeRange(timeRange)
        );
    };

    handleOnChange = (e) => {
        const {value: valueInput, name, type} = e.target;
        let {value, touch} = this.state;

        value[name] = type === 'number' ? parseFloat(valueInput) : valueInput;
        touch[name] = true;

        this.setState({
            value: {...value},
            touch: {...touch},
        });
    };

    handleChangeAllowDiffTime = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                allowDiffTime: value,
            },
        });
    };

    clear = () => {
        this.setState({
            value: {...INITFORM},
            touch: {...RESET_TOUCH},
            timeRange: [null, null],
        });
    };

    handleSubmit = (e) => {
        if (this.checkValidDataInput()) {
            const {value} = this.state;
            value['officeId'] = this.props.officeId;

            this.props.loading();
            workScheduleApi
                .createShiftTime(value)
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
                    shiftName: true,
                    allowDiffTime: true,
                    dayCount: true,
                    timeRange: true,
                    startTime: true,
                    endTime: true,
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
        const {value, messageInvalid, touch, timeRange} = this.state;

        return (
            <Form>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Mã ca</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập mã ca..."
                                name="shiftId"
                                type="text"
                                value={value.shiftId}
                                onChange={this.handleOnChange}
                                invalid={touch.shiftId && _.isEmpty(value.shiftId)}
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
                            <label>Tên ca</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập tên ca..."
                                name="shiftName"
                                type="text"
                                value={value.shiftName}
                                onChange={this.handleOnChange}
                                invalid={touch.shiftName && _.isEmpty(value.shiftName)}
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.shiftName}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Thời gian bắt đầu và kết thúc ca</label>
                            <RangePicker
                                value={timeRange}
                                allowClear={false}
                                onChange={this.onChangeTime}
                                format="HH:mm"
                                placeholder={['Bắt đầu', 'Kết thúc']}
                                className="form-control bor-radius"
                                minuteStep={5}
                            />
                            {touch.timeRange &&
                            !this.checkTimeRange(timeRange) && (
                                <div
                                    style={{
                                        color: '#EF5350',
                                        fontSize: 11,
                                    }}
                                >
                                    {messageInvalid.timeRange}
                                </div>
                            )}
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Số ngày công</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập số ngày công"
                                type="number"
                                name="dayCount"
                                onChange={this.handleOnChange}
                                value={value.dayCount}
                                invalid={
                                    touch.dayCount &&
                                    !checkValidNumber(value.dayCount)
                                }
                                min={0}
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.dayCount}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Thời gian trễ (phút)</label>
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
                                min={0}
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.allowLateMinutes}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Cho phép điểm danh khác giờ</label>
                            <Select
                                allowClear={false}
                                style={{width: '100%'}}
                                className="bor-radius"
                                defaultValue={false}
                                onChange={(val) => this.handleChangeAllowDiffTime(val)}
                                value={value.allowDiffTime}
                            >
                                <Select.Option className=" bor-radius" value={true}>
                                    Cho phép
                                </Select.Option>
                                <Select.Option className=" bor-radius" value={false}>
                                    Không cho phép
                                </Select.Option>
                            </Select>
                        </FormGroup>
                    </Col>
                </Row>
                <CardFooter className="text-right info">
                    <Popconfirm
                        title="Bạn chắc chắn thay đổi？"
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

export default FormNewShiftTime;
