import React from 'react';
import {
    Button,
    CardFooter,
    Col,
    Form,
    FormGroup,
    Input,
    Row,
} from 'reactstrap';
import * as _ from 'lodash';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Select } from 'antd';
import { workScheduleApi } from '../../api';
import { checkValidNumber } from '../../utils/validate';

const { Option } = Select;
const INITFORM = {
    session: 0,
    id: '',
    date: '',
    type: 1,
    isWorking: true,
    extraInfo: '',
};

class FormEditNormalDay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: { ...INITFORM },
        };
    }

    componentDidMount() {
        const { data } = this.props;
        if (!_.isEmpty(data)) {
            this.setState({
                value: {
                    ...this.state.value,
                    ...data,
                },
            });
        }
    }

    checkValidDataInput = () => {
        const { value } = this.state;

        return checkValidNumber(value.id);
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
        });
    };

    handleSubmit = (e) => {
        if (this.checkValidDataInput()) {
            const { value } = this.state;
            value['officeId'] = this.props.officeId;

            this.props.loading();
            workScheduleApi
                .updateWorkingDay(value)
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
            store.addNotification(
                createNotify('warning', 'Thông tin chưa hợp lệ !')
            );
        }
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

    render() {
        const { value } = this.state;

        console.log('value', value);

        return (
            <Form>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>ID</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập ID"
                                type="number"
                                name="id"
                                defaultValue={value.id}
                                disabled
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Buổi làm</label>
                            <Select
                                style={{ width: '100%' }}
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
                                style={{ width: '100%' }}
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
                    <Col md="6">
                        <FormGroup>
                            <label>Loại ngày</label>
                            <Select
                                style={{ width: '100%' }}
                                className="bor-radius"
                                value={value.type}
                                onChange={(val) => this.handleChangeType(val)}
                                onCancel={() => this.clear()}
                                disabled
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
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Mô tả</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập mô tả cho ngày làm việc"
                                type="text"
                                name="extraInfo"
                                value={value.extraInfo}
                                onChange={this.handleOnChange}
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

export default FormEditNormalDay;
