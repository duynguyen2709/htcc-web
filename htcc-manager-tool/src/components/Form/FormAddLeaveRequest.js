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
import { Input, Popconfirm, Select } from 'antd';
// import moment from 'moment';
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

    handleChangeUser = (val) => {
        const { value } = this.state;
        this.setState({
            value: {
                ...value,
                username: val,
            },
        });
    };

    componentDidMount() {
        const { data = {} } = this.props;
        const { canManageEmployees = [], leavingRequestCategories = [] } = data;

        this.setState({
            canManageEmployees,
            leavingRequestCategories,
            value: {
                ...this.state.value,
                username: _.isEmpty(canManageEmployees)
                    ? null
                    : _.get(canManageEmployees, '[0].username', ''),
                category: _.isEmpty(leavingRequestCategories)
                    ? null
                    : _.get(leavingRequestCategories, '[0]', ''),
            },
        });
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (!_.isEqual(nextProps.data, this.props.data)) {
            const { data } = nextProps;
            const {
                canManageEmployees = [],
                leavingRequestCategories = [],
            } = data;

            this.setState({
                canManageEmployees,
                leavingRequestCategories,
                value: {
                    ...this.state.value,
                    username: _.isEmpty(canManageEmployees)
                        ? null
                        : _.get(canManageEmployees, '[0].username', ''),
                    category: _.isEmpty(leavingRequestCategories)
                        ? null
                        : _.get(leavingRequestCategories, '[0]', ''),
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
            leaveRequestApi
                .createLeavingRequest(this.state.value)
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
                createNotify('warning', 'Bạn chưa nhập  lý do')
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

    decreaseDayOff = (index) => {
        let { value } = this.state;
        value['detail'] = _.omit(value.detail, `[${index}]`);

        this.setState({
            dayOff: this.state.dayOff - 1,
            value,
        });
    };

    handleDetailDayOff = (index, day) => {
        debugger;
        console.log('day', day);
        const { value } = this.state;

        _.set(value, `detail[${index}]`, day);

        this.setState({
            value,
        });
    };

    renderDetailDayOff = () => {
        const { dayOff } = this.state;
        const firtElem = (
            <Row key={1}>
                <RequestComponent
                    returnValue={this.handleDetailDayOff}
                    key={0}
                    index={0}
                />
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

        for (let index = 1; index < dayOff; index++) {
            const otherElem = (
                <Row key={index}>
                    <RequestComponent
                        returnValue={this.handleDetailDayOff}
                        key={index}
                        index={index}
                    />
                    <Col md={1}>
                        <div
                            className="float-right btn-new-small"
                            style={{ marginTop: 37 }}
                        >
                            <DeleteOutlined
                                style={{ color: '#EF534F' }}
                                onClick={() => this.decreaseDayOff(index)}
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
        const {
            value,
            leavingRequestCategories,
            canManageEmployees,
        } = this.state;

        console.log('value', value);

        return (
            <Form>
                <Row>
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
                            <label>Loại phép</label>
                            <Select
                                style={{ width: '100%' }}
                                className="bor-radius"
                                value={value.category}
                                onChange={(val) => this.handleChangeType(val)}
                                onCancel={() => this.clear()}
                            >
                                {_.map(leavingRequestCategories, (cate, i) => (
                                    <Option
                                        className=" bor-radius"
                                        value={cate}
                                        key={i}
                                    >
                                        {cate}
                                    </Option>
                                ))}
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
