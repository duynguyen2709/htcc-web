import React from 'react';
import {Button, CardFooter, Col, Form, FormGroup, Row,} from 'reactstrap';
import * as _ from 'lodash';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {CheckCircleOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Empty, Popconfirm, Select} from 'antd';
import {companyApi} from '../../api';

const {Option} = Select;

const INITFORM = {
    lineManager: '',
    subManagers: [],
    canManageOffices: [],
    canManageDepartments: [],
};

const RESET_TOUCH = {
    lineManager: false,
    subManagers: false,
    subordinates: false,
    canManageOffices: false,
    canManageDepartments: false,
};

class FormEditEmployeePermission extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            touch: {
                lineManager: false,
                subManagers: false,
                canManageOffices: false,
                canManageDepartments: false,
            },
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (!_.isEqual(nextProps.data.dataEdit, this.state.value)) {
            this.setState({
                value: nextProps.data.dataEdit,
            });
        }
    }

    componentDidMount() {
        this.setState({
            value: {
                ...this.props.data.dataEdit,
            },
        });
    }

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
        const {value} = this.state;

        this.props.loading();
        companyApi
            .updateInfoBranch(value)
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
                console.error(err);
                store.addNotification(createNotify('danger', 'Hệ thống có lỗi. Vui lòng thử lại sau'));
            });
    };

    handleChangeLineManager = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                lineManager: value,
            },
        });
    };

    renderLineManagerOptions = () => {
        const {canManageEmployees} = this.props.data;
        return _.map(canManageEmployees, (employee, index) => (
            <Option className=" bor-radius" value={employee.username} key={`LM_${employee.username}`}>
                {employee.fullName} ({employee.username})
            </Option>
        ))
    };

    render() {
        const {value, touch, messageInvalid} = this.state;
        if (!value) {
            return (
                <Empty
                    className={'center-div'}
                    style={{marginTop: '20px'}}
                    description={
                        <span style={{color: 'rgba(0, 0, 0, 0.65)'}}>
                            Không có dữ liệu
                        </span>
                    }
                />
            );
        }

        return (
            <Form>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Cấp trên trực tiếp</label>
                            <Select
                                style={{width: '100%'}}
                                className="bor-radius"
                                onChange={(val) => this.handleChangeLineManager(val)}
                                value={value.lineManager}
                            >
                                {this.renderLineManagerOptions()}
                            </Select>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Chi nhánh quản lý</label>
                        </FormGroup>
                    </Col>
                    <Col md="6">
                        <FormGroup>
                            <label>Phòng ban quản lý</label>
                        </FormGroup>
                    </Col>
                </Row>
                {/*<Row>*/}
                {/*    <Col md="12">*/}
                {/*        <FormGroup>*/}
                {/*            <label>Wifi</label>*/}
                {/*            <Select*/}
                {/*                style={{width: '100%'}}*/}
                {/*                className="bor-radius"*/}
                {/*                defaultValue={false}*/}
                {/*                onChange={(val) => this.handleChangeforceUseWifi(val)}*/}
                {/*                onCancel={() => this.clear()}*/}
                {/*                value={value.forceUseWifi}*/}
                {/*            >*/}
                {/*                <Option className=" bor-radius" value={true}>*/}
                {/*                    Bắt buộc sử dụng wifi khi điểm danh*/}
                {/*                </Option>*/}
                {/*                <Option className=" bor-radius" value={false}>*/}
                {/*                    Không bắt buộc sử dụng wifi khi điểm danh*/}
                {/*                </Option>*/}
                {/*            </Select>*/}
                {/*        </FormGroup>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                {/*<Row>*/}
                {/*    <Col md="12">*/}
                {/*        <FormGroup>*/}
                {/*            <label>Địa chỉ IP subnet cho phép điểm danh</label>*/}
                {/*            <Input*/}
                {/*                placeholder="Nhập địa chỉ IP"*/}
                {/*                type="text"*/}
                {/*                className="bor-gray text-dark"*/}
                {/*                onChange={this.handleOnChange}*/}
                {/*                name="allowWifiIP"*/}
                {/*                value={value.allowWifiIP}*/}
                {/*            />*/}
                {/*        </FormGroup>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
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

export default FormEditEmployeePermission;
