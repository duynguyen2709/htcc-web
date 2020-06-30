import React from 'react';
import { Button, CardFooter, Col, Form, FormGroup, Row } from 'reactstrap';
import * as _ from 'lodash';
import { leaveRequestApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import {
    CheckCircleOutlined,
    QuestionCircleOutlined,
    PlusSquareOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { DatePicker, Input, Popconfirm, Select } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import RequestComponent from '../DetailDayOff/RequestComponent';

const { Option } = Select;
const { TextArea } = Input;

class FormAddLeaveRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                category: '',
                clientTime: new Date().getTime(),
                detail: [],
                reason: '',
                username: '',
            },
            dayOff: 1,
        };
    }

    handleChangeType = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                category: value,
            },
        });
    };

    componentDidMount() {
        this.setState({
            value: {
                category: '',
                clientTime: moment(new Date()),
                detail: [],
                reason: '',
                username: '',
            },
        });
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
        if (!_.isEmpty(this.state.value.response)) {
            this.props.loading();
            leaveRequestApi
                .updateStatus(this.state.value)
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
                createNotify('warning', 'Bạn chưa nhập thông tin phản hồi')
            );
        }
    };

    clear = () => {
        this.setState({
            value: {
                ...this.state.value,
                response: null,
            },
        });
    };

    increaseDayOff = () => {
        this.setState({
            dayOff: this.state.dayOff + 1,
        });
    };

    decreaseDayOff = () => {
        this.setState({
            dayOff: this.state.dayOff - 1,
        });
    };

    renderDetailDayOff = () => {
        const { dayOff } = this.state;
        const firtElem = (
            <Row>
                <RequestComponent key={1} />
                <Col md={{ size: 1, offset: 1 }}>
                    <div
                        className="float-right btn-new-small"
                        style={{ marginTop: 37 }}
                    >
                        <PlusSquareOutlined onClick={this.increaseDayOff} />
                    </div>
                </Col>
            </Row>
        );
        const list = [firtElem];

        for (let index = 2; index <= dayOff; index++) {
            const otherElem = (
                <Row>
                    <RequestComponent key={index} />
                    <Col md={1}>
                        <div
                            className="float-right btn-new-small"
                            style={{ marginTop: 37 }}
                        >
                            <DeleteOutlined
                                style={{ color: '#EF534F' }}
                                onClick={this.decreaseDayOff}
                            />
                        </div>
                    </Col>
                    <Col md={1}>
                        <div
                            className="float-right btn-new-small"
                            style={{ marginTop: 37 }}
                        >
                            <PlusSquareOutlined onClick={this.increaseDayOff} />
                        </div>
                    </Col>
                </Row>
            );
            list.push(otherElem);
        }

        return (
            <React.Fragment>
                <label>Chi tiết ngày nghỉ</label>
                <hr />
                {list}
                <hr />
            </React.Fragment>
        );
    };

    render() {
        const { value } = this.state;
        const { data = {} } = this.props;

        console.log('data', data);

        return (
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Nhân viên</label>
                            <Input
                                className="form-control bor-radius bor-gray text-dark"
                                type="text"
                                name="leavingRequestId"
                                value={value.leavingRequestId}
                                placeholder="Nhập tên nhân viên"
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Loại phép</label>
                            <Select
                                style={{ width: '100%' }}
                                className="bor-radius"
                                defaultValue={
                                    data.leavingRequestCategories
                                        ? data.leavingRequestCategories[0]
                                        : null
                                }
                                onChange={(val) => this.handleChangeType(val)}
                                onCancel={() => this.clear()}
                            >
                                {_.map(
                                    data.leavingRequestCategories,
                                    (cate, i) => (
                                        <Option
                                            className=" bor-radius"
                                            value={cate}
                                            key={i}
                                        >
                                            {cate}
                                        </Option>
                                    )
                                )}
                            </Select>
                        </FormGroup>
                    </Col>
                </Row>
                {this.renderDetailDayOff()}
                <Row>
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
)(FormAddLeaveRequest);
