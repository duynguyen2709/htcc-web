import React from 'react';
import {Button, CardFooter, Col, Form, FormFeedback, FormGroup, Input, Row,} from 'reactstrap';
import * as _ from 'lodash';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {CheckCircleOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {DatePicker, Popconfirm, Select} from 'antd';
import {workScheduleApi} from '../../api';
import moment from 'moment';

const {Option} = Select;
const INITFORM = {
    session: 0,
    date: moment(new Date()).format('YYYYMMDD'),
    type: 1,
    weekDay: 1,
    isWorking: true,
    extraInfo: '',
};

const RESET_TOUCH = {
    extraInfo: false,
};

class FormNewWorkingDay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {...INITFORM},
            messageInvalid: {
                session: 'Chưa chọn buổi làm',
                date: 'Chưa chọn ngày',
                weekDay: 'Chưa chọn thứ',
                extraInfo: 'Cần mô tả lý do cho ngày đặc biệt',
            },
            touch: {
                ...RESET_TOUCH,
            },
        };
    }

    checkValidDataInput = () => {
        return this.checkExtraInfo();
    };

    handleOnChange = (e) => {
        const {value: valueInput, name, type} = e.target;
        let {value, touch} = this.state;

        value[name] = type === 'number' ? parseInt(valueInput) : valueInput;
        touch[name] = true;

        this.setState({
            value: {...value},
            touch: {...touch},
        });
    };

    clear = () => {
        this.setState({
            value: {...INITFORM},
            touch: {...RESET_TOUCH},
        });
    };

    handleSubmit = (e) => {
        if (this.checkValidDataInput()) {
            const {value} = this.state;
            value['officeId'] = this.props.officeId;
            value.date = String(moment(value.date).format("YYYYMMDD"));

            this.props.loading();
            workScheduleApi
                .createWorkingDay(value)
                .then((res) => {
                    if (res.returnCode === 1) {
                        this.props.stopLoading();
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
                    extraInfo: true,
                },
            });
            store.addNotification(
                createNotify('warning', 'Thông tin chưa hợp lệ !')
            );
        }
    };

    handleChangeDate = (dateInput) => {
        const {value} = this.state;
        if (!_.isEmpty(dateInput)) {
            this.setState({
                value: {
                    ...value,
                    date: moment(dateInput, 'YYYYMMDD'),
                },
            });
        }
    };

    handleChangeWeekDay = (weekDay) => {
        this.setState({
            value: {
                ...this.state.value,
                weekDay: weekDay,
            },
        });
    };

    handleChangeIsWorking = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                isWorking: value,
            },
        });
    };

    handleChangeSession = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                session: value,
            },
        });
    };

    handleChangeType = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                type: value,
            },
        });
    };

    checkExtraInfo = () => {
        const {type, extraInfo} = this.state.value;
        return type === 1 || (type === 2 && !_.isEmpty(extraInfo));
    };

    render() {
        const {value, messageInvalid, touch} = this.state;

        return (
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Loại ngày</label>
                            <Select
                                style={{width: '100%'}}
                                className="bor-radius"
                                value={value.type}
                                onChange={(val) => this.handleChangeType(val)}
                                onCancel={() => this.clear()}
                            >
                                <Option className=" bor-radius" value={1}>
                                    Ngày thường
                                </Option>
                                <Option className=" bor-radius" value={2}>
                                    Ngày đặc biệt
                                </Option>
                            </Select>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        {value.type === 2 ?
                            <FormGroup>
                                <label>Ngày</label>
                                <DatePicker
                                    className="form-control bor-radius"
                                    format={'DD-MM-YYYY'}
                                    value={moment(value.date)}
                                    onChange={(val) => this.handleChangeDate(val)}
                                />
                            </FormGroup> :
                            <FormGroup>
                                <label>Thứ</label>
                                <Select
                                    style={{width: '100%'}}
                                    className="bor-radius"
                                    value={value.weekDay}
                                    onChange={(val) =>
                                        this.handleChangeWeekDay(val)
                                    }
                                    onCancel={() => this.clear()}
                                >
                                    <Option className=" bor-radius" value={1}>
                                        Chủ nhật
                                    </Option>
                                    <Option className=" bor-radius" value={2}>
                                        Thứ 2
                                    </Option>
                                    <Option className=" bor-radius" value={3}>
                                        Thứ 3
                                    </Option>
                                    <Option className=" bor-radius" value={4}>
                                        Thứ 4
                                    </Option>
                                    <Option className=" bor-radius" value={5}>
                                        Thứ 5
                                    </Option>
                                    <Option className=" bor-radius" value={6}>
                                        Thứ 6
                                    </Option>
                                    <Option className=" bor-radius" value={7}>
                                        Thứ 7
                                    </Option>
                                </Select>
                            </FormGroup>}
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Buổi làm</label>
                            <Select
                                style={{width: '100%'}}
                                className="bor-radius"
                                value={value.session}
                                onChange={(val) =>
                                    this.handleChangeSession(val)
                                }
                                onCancel={() => this.clear()}
                            >
                                <Option className=" bor-radius" value={0}>
                                    Cả ngày
                                </Option>
                                <Option className=" bor-radius" value={1}>
                                    Sáng
                                </Option>
                                <Option className=" bor-radius" value={2}>
                                    Chiều
                                </Option>
                            </Select>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Có đi làm không ?</label>
                            <Select
                                style={{width: '100%'}}
                                className="bor-radius"
                                value={value.isWorking}
                                onChange={(val) =>
                                    this.handleChangeIsWorking(val)
                                }
                                onCancel={() => this.clear()}
                            >
                                <Option className=" bor-radius" value={true}>
                                    Có
                                </Option>
                                <Option className=" bor-radius" value={false}>
                                    Không
                                </Option>
                            </Select>
                        </FormGroup>
                    </Col>
                </Row>
                {value.type === 2 ?
                    <Row>
                        <Col md="12">
                            <FormGroup>
                                <label>Mô tả</label>
                                <Input
                                    className="bor-gray text-dark"
                                    placeholder="Nhập lý do thêm cho ngày nghỉ / ngày làm việc (VD : nghỉ lễ...)"
                                    type="text"
                                    name="extraInfo"
                                    value={value.extraInfo}
                                    onChange={this.handleOnChange}
                                    invalid={
                                        touch.extraInfo && !this.checkExtraInfo()
                                    }
                                />
                                <FormFeedback invalid={'true'}>
                                    {messageInvalid.extraInfo}
                                </FormFeedback>
                            </FormGroup>
                        </Col>
                    </Row> : null}
                <CardFooter className="text-right info">
                    <Popconfirm
                        title="Bạn chắc chắn thêm mới？"
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

export default FormNewWorkingDay;
