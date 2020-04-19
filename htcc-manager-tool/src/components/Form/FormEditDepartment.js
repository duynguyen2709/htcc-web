import React from 'react';
import {Button, CardFooter, Col, Form, FormFeedback, FormGroup, Input, Row,} from 'reactstrap';
import * as _ from 'lodash';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {CheckCircleOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Popconfirm, Select} from 'antd';
import {companyApi} from '../../api';

const {Option} = Select;

const INITFORM = {
    department: '',
    departmentName: '',
    headManager: ''
};

const RESET_TOUCH = {
    department: false,
    departmentName: false,
    headManager: false
};

class FormEditDepartment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {...INITFORM},
            messageInvalid: {
                department: 'Mã phòng ban không được rỗng',
                departmentName: 'Tên phòng ban không được rỗng',
                headManager: 'Tên người quản lý không được rỗng'
            },
            touch: {
                department: false,
                departmentName: false,
                headManager: false
            },
            headManagerList: this.props.data.headManagerList
        };
    }

    componentDidMount() {
        this.setState({
            value: {
                ...this.props.data,
            },
        });
    }

    checkValidDataInput = () => {
        const {
            department,
            departmentName,
            headManager
        } = this.state.value;

        return (
            !_.isEmpty(department) &&
            !_.isEmpty(departmentName) &&
            !_.isEmpty(headManager)
        );
    };

    handleOnChange = (e) => {
        const {value: valueInput, name} = e.target;
        let {value, touch} = this.state;

        value[name] = valueInput;
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

            this.props.loading();
            companyApi
                .updateDepartment(value)
                .then((res) => {
                    if (res.returnCode === 1) {
                        this.props.onSubmit(true);
                        this.clear();
                    } else {
                        this.props.stopLoading();
                        store.addNotification(createNotify('danger', res.returnMessage));
                    }
                })
                .catch((err) => {
                    this.props.stopLoading();
                    store.addNotification(createNotify('danger', JSON.stringify(err)));
                });
        } else {
            this.props.stopLoading();
            this.setState({
                touch: {
                    department: true,
                    departmentName: true,
                    headManager: true
                },
            });
            store.addNotification(createNotify('warning', 'Thông tin chưa hợp lệ !'));
        }
    };

    handleChangeHeadManager = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                headManager: value,
            },
        });
    };

    render() {
        const {value, touch, messageInvalid, headManagerList} = this.state;

        return (
            <Form>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Mã phòng ban</label>
                            <Input
                                placeholder="Nhập mã phòng ban"
                                type="text"
                                className="bor-gray text-dark"
                                onChange={this.handleOnChange}
                                name="department"
                                value={value.department}
                                invalid={touch.department && _.isEmpty(value.department)}
                                disabled
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.department}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label htmlFor="email">Tên phòng ban</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập tên phòng ban"
                                type="text"
                                onChange={this.handleOnChange}
                                name="departmentName"
                                value={value.departmentName}
                                invalid={touch.departmentName && _.isEmpty(value.departmentName)}
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.departmentName}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Người quản lý</label>
                            <Select
                                style={{width: '100%'}}
                                className="bor-radius"
                                placeholder="Chọn người quản lý"
                                defaultValue={value.headManager}
                                onChange={(val) => this.handleChangeHeadManager(val)}
                                onCancel={() => this.clear()}
                                allowClear={true}
                                showArrow={false}
                                value={value.headManager}
                            >
                                {headManagerList.map((entity) => {
                                    return <Option className=" bor-radius" key={entity} value={entity}>
                                        {entity}
                                    </Option>
                                })}
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
                        <Button className="btn-custom" color="primary" type="button">
                            <CheckCircleOutlined
                                style={{display: 'inline', margin: '5px 10px 0 0'}}
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

export default FormEditDepartment;
