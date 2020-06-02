import React from 'react';
import {Button, CardFooter, Col, Form, FormFeedback, FormGroup, Input, Row,} from 'reactstrap';
import * as _ from 'lodash';
import {store} from 'react-notifications-component';
import {createNotify} from '../../../utils/notifier';
import {CheckCircleOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Popconfirm, Select} from 'antd';
import {shiftArrangement} from '../../../api';
import moment from 'moment';

const RESET_TOUCH = {
    officeId: false,
    shiftId: false,
    arrangeDate: false,
    username: false,
    type: false,
};

class FormAddShiftByDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                officeId: '',
                shiftId: '',
                arrangeDate: '',
                username: this.props.employeeList[0].username,
                type: 0
            },
            messageInvalid: {
                officeId: 'Vui lòng nhập mã văn phòng',
                arrangeDate: 'Vui lòng nhập ngày',
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
            !_.isEmpty(value.arrangeDate) &&
            (value.type === 1 || value.type === 2)
        );
    };

    clear = () => {
        this.setState({
            value: {
                officeId: '',
                shiftId: '',
                arrangeDate: '',
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

                        value.arrangeId = res.data;
                        this.props.onSubmit(true, value);
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
                    arrangeDate: true,
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
        });
    };

    isBeforeToday = () => {
        const arrangeDateNum = parseInt(this.state.value.arrangeDate);
        const current = new Date().getTime();
        const todayNum = parseInt(String(moment(current).format("YYYYMMDD")));
        return arrangeDateNum < todayNum;
    };

    render() {
        const {value, messageInvalid, touch} = this.state;
        const {employeeList} = this.props;
        const isBeforeToday = this.isBeforeToday();

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
                            <label>Ngày</label>
                            <Input
                                className="bor-gray text-dark"
                                name="weekDay"
                                type="text"
                                value={String(moment(value.arrangeDate, 'YYYYMMDD').format('DD-MM-YYYY'))}
                                disabled
                                invalid={
                                    touch.arrangeDate &&
                                    _.isEmpty(value.arrangeDate)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.arrangeDate}
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
                    {isBeforeToday ?
                        <h4 style={{marginTop: '10px'}}>
                            <i style={{color: '#d9534f'}}>
                                Không thể xếp ca trước ngày hôm nay
                            </i>
                        </h4> :
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
                    }
                </CardFooter>
            </Form>
        );
    }
}

export default FormAddShiftByDate;
