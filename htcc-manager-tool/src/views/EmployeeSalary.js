import React, {Component} from 'react';
import {
    Button as AntButton,
    Card,
    Checkbox,
    DatePicker,
    Empty,
    Input,
    InputNumber,
    Popconfirm,
    Select,
    Tooltip
} from 'antd';
import {connect} from 'react-redux';
import {salaryApi} from '../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../utils/notifier';
import ReactLoading from 'react-loading';
import {
    CaretLeftOutlined,
    EditOutlined,
    MinusCircleOutlined,
    PlusSquareOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import {Button, CardFooter, Col, Form, FormGroup, Row} from 'reactstrap';
import {canDoAction} from '../utils/permission';
import {ACTION, ROLE_GROUP_KEY} from '../constant/constant';
import * as _ from "lodash";
import moment from "moment";

const {Option} = Select;

class EmployeeSalary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            isLoading: false,
            showModal: false,
            mode: 'view'
        };
    }

    toggle = (submit = false) => {
        this.setState({
            showModal: !this.state.showModal,
        });

        if (submit) {
            this.getConfig();
        }
    };

    componentDidMount() {
        this.getConfig();
    }

    getConfig = () => {
        const {username} = this.props;
        if (!username || username === '') {
            this.setState({
                data: null,
            });
            return;
        }

        this.setState({
            isLoading: true,
            data: null,
        });

        salaryApi
            .getSalaryFormula(username)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        data: res.data,
                    });
                } else {
                    store.addNotification(
                        createNotify('danger', 'Hệ thống có lỗi. Vui lòng thử lại sau.')
                    );
                }
            })
            .catch((err) => {
                store.addNotification(
                    createNotify('danger', JSON.stringify(err))
                );
            })
            .finally(() => {
                this.setState({isLoading: false});
            });
    };

    handleCalculateSalary = () => {
        const {username} = this.props;
        this.setState({
            isLoading: true,
        });

        salaryApi
            .calculateSalary(username)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.getConfig();

                    store.addNotification(
                        createNotify('default', res.returnMessage)
                    );
                } else {
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                store.addNotification(
                    createNotify('danger', 'Hệ thống có lỗi. Vui lòng thử lại sau.')
                );
            })
            .finally(() => {
                this.setState({
                    isLoading: false
                });
            })
    };

    handleSubmit = () => {
        const {username} = this.props;
        const {data} = this.state;

        if (!_.isEmpty(data.lastPaymentDate) && !_.isEmpty(data.nextPaymentDate)) {
            if (parseInt(data.nextPaymentDate) <= parseInt(data.lastPaymentDate)) {
                store.addNotification(
                    createNotify('warning', 'Ngày trả lương tiếp theo phải sau ngày trả lương trước')
                );
                return;
            }
        }

        for (let ele of data.additionalIncome) {
            if (_.isEmpty(ele.formulaId)) {
                store.addNotification(
                    createNotify('warning', 'Mã công thức không được rỗng')
                );
                return;
            }
            if (ele.type === 2 && _.isEmpty(ele.idBasedOn)) {
                store.addNotification(
                    createNotify('warning', 'Mã công thức để tính theo % không được rỗng')
                );
                return;
            }
        }

        for (let ele of data.additionalPenalty) {
            if (_.isEmpty(ele.formulaId)) {
                store.addNotification(
                    createNotify('warning', 'Mã công thức không được rỗng')
                );
                return;
            }
            if (ele.type === 2 && _.isEmpty(ele.idBasedOn)) {
                store.addNotification(
                    createNotify('warning', 'Mã công thức để tính theo % không được rỗng')
                );
                return;
            }
        }

        this.setState({
            isLoading: true,
        });

        salaryApi
            .updateSalaryFormula(data, username)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.getConfig();

                    store.addNotification(
                        createNotify('default', res.returnMessage)
                    );
                } else {
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                store.addNotification(
                    createNotify('danger', 'Hệ thống có lỗi. Vui lòng thử lại sau.')
                );
            })
            .finally(() => {
                this.setState({
                    isLoading: false,
                    mode: 'view'
                });
            })
    };

    onChangeCycleType = (value) => {
        const {data} = this.state;
        data.cycleType = value;
        this.setState({
            data
        })
    };

    onChangeInputNumberValue = (key, value) => {
        const data = this.state.data[key];
        data.value = value;
        this.setState({
            data: {
                [key]: data,
                ...this.state.data
            }
        })
    };

    onChangeBaseSalaryType = (value) => {
        const {baseSalary} = this.state.data;
        baseSalary.type = value;
        this.setState({
            data: {
                baseSalary,
                ...this.state.data
            }
        })
    };

    onChangeLastPaymentDate = (value) => {
        const {data} = this.state;
        data.lastPaymentDate = value ? value.format('YYYYMMDD') : '';
        this.setState({
            data
        })
    };

    onChangeNextPaymentDate = (value) => {
        const {data} = this.state;
        data.nextPaymentDate = value ? value.format('YYYYMMDD') : '';
        this.setState({
            data
        })
    };

    onChangeAdditionalIncome = (index, key, value) => {
        const {additionalIncome, additionalPenalty} = this.state.data;
        const oldValue = additionalIncome[index][key];
        additionalIncome[index][key] = value;

        if (key === 'formulaId') {
            for (let ele of additionalIncome) {
                if (ele.type === 2) {
                    if (ele.idBasedOn === oldValue) {
                        ele.idBasedOn = value;
                    }
                }
            }
            for (let ele of additionalPenalty) {
                if (ele.type === 2) {
                    if (ele.idBasedOn === oldValue) {
                        ele.idBasedOn = value;
                    }
                }
            }
        }

        this.setState({
            data: {
                additionalIncome,
                additionalPenalty,
                ...this.state.data
            }
        }, () => {
            if (key === 'description') {
                this.forceUpdate();
            }
        })
    };

    removeAdditionalIncome = (index) => {
        let {additionalIncome} = this.state.data;
        additionalIncome = additionalIncome.splice(index, 1);
        this.setState({
            data: {
                additionalIncome,
                ...this.state.data
            }
        })
    };

    onChangeAdditionalPenalty = (index, key, value) => {
        const {additionalIncome, additionalPenalty} = this.state.data;
        const oldValue = additionalPenalty[index][key];
        additionalPenalty[index][key] = value;

        if (key === 'formulaId') {
            for (let ele of additionalIncome) {
                if (ele.type === 2) {
                    if (ele.idBasedOn === oldValue) {
                        ele.idBasedOn = value;
                    }
                }
            }
            for (let ele of additionalPenalty) {
                if (ele.type === 2) {
                    if (ele.idBasedOn === oldValue) {
                        ele.idBasedOn = value;
                    }
                }
            }
        }

        this.setState({
            data: {
                additionalIncome,
                additionalPenalty,
                ...this.state.data
            }
        }, () => {
            if (key === 'description') {
                this.forceUpdate();
            }
        })
    };

    removeAdditionalPenalty = (index) => {
        let {additionalPenalty} = this.state.data;
        additionalPenalty = additionalPenalty.splice(index, 1);
        this.setState({
            data: {
                additionalPenalty,
                ...this.state.data
            }
        })
    };

    onClickAddIncome = () => {
        const {additionalIncome} = this.state.data;
        for (let ele of additionalIncome) {
            if (_.isEmpty(ele.formulaId)) {
                store.addNotification(
                    createNotify('warning', 'Mã công thức trước đó không được rỗng')
                );
                return;
            }
        }

        const newObj = {
            formulaId: '',
            description: '',
            type: 1,
            value: 0,
            idBasedOn: '',
            calcTax: false,
        };
        additionalIncome.push(newObj);

        this.setState({
            data: {
                additionalIncome,
                ...this.state.data
            }
        })
    };

    onClickAddPenalty = () => {
        const {additionalPenalty} = this.state.data;
        for (let ele of additionalPenalty) {
            if (_.isEmpty(ele.formulaId)) {
                store.addNotification(
                    createNotify('warning', 'Mã công thức trước đó không được rỗng')
                );
                return;
            }
        }
        const newObj = {
            formulaId: '',
            description: '',
            type: 1,
            value: 0,
            idBasedOn: '',
            calcTax: false,
        };
        additionalPenalty.push(newObj);

        this.setState({
            data: {
                additionalPenalty,
                ...this.state.data
            }
        })
    };

    toggleMode = (mode) => {
        this.setState({
            mode
        })
    };

    renderButton = () => {
        const {mode} = this.state;
        if (mode === 'view') {
            return <Button
                id="save"
                className="btn-custom"
                color="primary"
                type="button"
                onClick={() => this.toggleMode('edit')}
            >
                <EditOutlined
                    style={{display: 'inline', margin: '5px 10px 0 0'}}
                />{' '}
                {'  '}
                <span className="btn-save-text"> Chỉnh sửa</span>
            </Button>
        }

        return (<>
                <div className={"flex-row"}>
                    <Button
                        id="cancel"
                        color="info"
                        onClick={() => this.toggleMode('view')}
                    >
                        <span className="btn-save-text"> Hủy</span>
                    </Button>
                    <Popconfirm
                        title={"Bạn chắc chắn cập nhật bảng lương của nhân viên?"}
                        icon={<QuestionCircleOutlined/>}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onConfirm={this.handleSubmit}
                    >
                        <Button
                            id="save"
                            className="btn-custom"
                            color="primary"
                            type="button"
                        >
                            <EditOutlined
                                style={{display: 'inline', margin: '5px 10px 0 0'}}
                            />{' '}
                            {'  '}
                            <span className="btn-save-text"> Lưu</span>
                        </Button>
                    </Popconfirm>
                </div>
                <h5 style={{marginTop: 15}} className="text-right">
                    <i>Nếu có thay đổi xin hãy bấm LƯU để cập nhật</i>
                </h5>
            </>
        );
    };

    renderHeader = () => {
        const canUpdate = canDoAction(
            this.props.data,
            ROLE_GROUP_KEY.SALARY,
            ACTION.UPDATE
        );

        const {mode} = this.state;

        return (
            <Row justify={'space-between'}>
                <div style={{margin: 'auto 20px'}}>
                    <AntButton
                        type="primary"
                        style={{margin: 10}}
                        icon={<CaretLeftOutlined/>}
                        onClick={this.props.handleClickBack}
                    >
                        Quay lại
                    </AntButton>
                </div>
                <h4 style={{margin: 'auto'}}>
                    Công thức tính lương cho nhân viên {this.props.username}
                </h4>
                <CardFooter
                    className="text-right info"
                    style={{marginRight: 20}}
                >
                    {canUpdate && (mode === 'view') ?
                        <>
                            {this.renderButton()}
                        </> : null}
                </CardFooter>
            </Row>
        )
    };

    renderCycleType = () => {
        const {data, mode} = this.state;
        return <Row style={{justifyContent: 'center'}}>
            <Col md="3">
                <FormGroup>
                    <label>Loại bảng lương</label>
                    <Select value={data.cycleType}
                            allowClear={false}
                            disabled={mode === 'view'}
                            onChange={(value) => this.onChangeCycleType(value)}
                            style={{display: 'block'}}
                    >
                        <Select.Option value={1}>
                            Theo tháng
                        </Select.Option>
                        <Select.Option value={2}>
                            Theo tuần
                        </Select.Option>
                    </Select>
                </FormGroup>
            </Col>
            <Col md="3">
                <FormGroup>
                    <label>Ngày bắt đầu kì lương</label>
                    <DatePicker style={{display: 'block'}}
                                format={"DD-MM-YYYY"}
                                allowClear={false}
                                disabled={mode === 'view'}
                                value={data.lastPaymentDate ?
                                    new moment(data.lastPaymentDate, "YYYYMMDD") :
                                    null
                                }
                                onChange={this.onChangeLastPaymentDate}
                    />
                </FormGroup>
            </Col>
            <Col md="3">
                <FormGroup>
                    <label>Ngày kết thúc kì lương</label>
                    <DatePicker style={{display: 'block'}}
                                format={"DD-MM-YYYY"}
                                allowClear={false}
                                disabled={mode === 'view'}
                                value={data.nextPaymentDate ?
                                    new moment(data.nextPaymentDate, "YYYYMMDD") :
                                    null
                                }
                                onChange={this.onChangeNextPaymentDate}
                    />
                </FormGroup>
            </Col>
        </Row>
    };

    renderCardBaseSalary = () => {
        const {data, mode} = this.state;
        return (<>
            <h4>I. Lương cố định</h4>
            <Card type={"inner"}>
                <Row>
                    <Col md={"2"}>
                        <label>Mã công thức</label>
                    </Col>
                    <Col md={"3"}>
                        <label>Tên công thức</label>
                    </Col>
                    <Col md={"2"}>
                        <label>Hình thức tính</label>
                    </Col>
                    <Col md={"2"}>
                        <label>Giá trị</label>
                    </Col>
                </Row>
                {/*Base Salary Row*/}
                <Row>
                    <Col md={"2"}>
                        <Input value={data.baseSalary.formulaId}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"3"}>
                        <Input value={data.baseSalary.description}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <Select value={data.baseSalary.type}
                                style={{width: '100%'}}
                                allowClear={false}
                                disabled={mode === 'view'}
                                onChange={(e) => this.onChangeBaseSalaryType(e)}
                        >
                            <Option value={1}>
                                Theo tháng
                            </Option>
                            <Option value={2}>
                                Theo giờ công
                            </Option>
                        </Select>
                    </Col>
                    <Col md={"2"}>
                        <InputNumber style={{width: '100%'}}
                                     disabled={mode === 'view'}
                                     value={data.baseSalary.value} min={0}
                                     onChange={(e) => this.onChangeInputNumberValue('baseSalary', e)}
                                     formatter={value => (data.baseSalary.type === 1) ? `${value} đ` : `${value} đ/h`}
                                     parser={value => (data.baseSalary.type === 1) ? value.replace(' đ', '') : value.replace(' đ/h', '')}
                        />
                    </Col>
                </Row>
                {/*Extra Row*/}
                <Row>
                    <Col md={"2"}>
                        <Input value={data.extraSalary.formulaId}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"3"}>
                        <Input value={data.extraSalary.description}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <Input value={"Cộng thẳng"}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <InputNumber style={{width: '100%'}}
                                     disabled={mode === 'view'}
                                     value={data.extraSalary.value} min={0}
                                     onChange={(e) => this.onChangeInputNumberValue('extraSalary', e)}
                                     formatter={value => `${value} đ`}
                                     parser={value => value.replace(' đ', '')}
                        />
                    </Col>
                </Row>
            </Card>
        </>)
    };

    renderCardIncome = () => {
        const {data, mode} = this.state;

        const plusButton = (<div
            className="float-right btn-new-small"
        >
            <Tooltip title={"Thêm khoản cộng mới"}>
                <PlusSquareOutlined onClick={this.onClickAddIncome}/>
            </Tooltip>
        </div>);

        return (<>
            <h4 style={{marginTop: 20}}>
                II. Các khoản cộng thêm
            </h4>
            <Card type={"inner"} extra={(mode === 'view') ? null : plusButton}>
                <Row>
                    <Col md={"2"}>
                        <label>Mã công thức</label>
                    </Col>
                    <Col md={"3"}>
                        <label>Tên công thức</label>
                    </Col>
                    <Col md={"2"}>
                        <label>Hình thức tính</label>
                    </Col>
                    <Col md={"2"}>
                        <label>Giá trị</label>
                    </Col>
                    <Col md={"2"}>
                        <label>Dựa trên</label>
                    </Col>
                    <Col md={"1"}>
                        <label>Tính thuế</label>
                    </Col>
                </Row>
                {/*Meal Money Row*/}
                <Row>
                    <Col md={"2"}>
                        <Input value={data.mealMoney.formulaId}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"3"}>
                        <Input value={data.mealMoney.description}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <Input value={"Cộng thẳng"}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <InputNumber style={{width: '100%'}}
                                     disabled={mode === 'view'}
                                     value={data.mealMoney.value} min={0}
                                     onChange={(e) => this.onChangeInputNumberValue('mealMoney', e)}
                                     formatter={value => `${value} đ`}
                                     parser={value => value.replace(' đ', '')}
                        />
                    </Col>
                    <Col md={"2"}/>
                    <Col md={"1"}>
                        <Checkbox checked={data.mealMoney.calcTax}
                                  disabled
                        />
                    </Col>
                </Row>
                {/*Overtime Row*/}
                <Row style={{marginTop: 20}}>
                    <Col md={"2"}>
                        <Input value={data.overtimeMoney.formulaId}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"3"}>
                        <Input value={data.overtimeMoney.description}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <Input value={"Theo số giờ công"}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <InputNumber style={{width: '100%'}}
                                     disabled={mode === 'view'}
                                     value={data.overtimeMoney.value} min={0}
                                     onChange={(e) => this.onChangeInputNumberValue('overtimeMoney', e)}
                                     formatter={value => `${value} đ/h`}
                                     parser={value => value.replace(' đ/h', '')}
                        />
                    </Col>
                    <Col md={"2"}/>
                    <Col md={"1"}>
                        <Checkbox checked={data.overtimeMoney.calcTax}
                                  disabled
                        />
                    </Col>
                </Row>
                {/*Additional Income Rows*/}
                {_.map(data.additionalIncome, (item, index) => {
                    const {type} = item;
                    return <>
                        <Row style={index === 0 ?
                            {marginTop: 20} : null
                        }
                             key={`income_${index}`}>
                            <Col md={"2"}>
                                <Input value={item.formulaId}
                                       onChange={(e) => this.onChangeAdditionalIncome(index, 'formulaId', e.target.value)}
                                       className={"salary-input"}
                                />
                            </Col>
                            <Col md={"3"}>
                                <Input value={item.description}
                                       className={"salary-input"}
                                       onChange={(e) => this.onChangeAdditionalIncome(index, 'description', e.target.value)}
                                />
                            </Col>
                            <Col md={"2"}>
                                <Select value={item.type}
                                        style={{width: '100%'}}
                                        allowClear={false}
                                        onChange={(value) => this.onChangeAdditionalIncome(index, 'type', value)}
                                >
                                    <Option value={1}>
                                        Cộng thẳng
                                    </Option>
                                    <Option value={2}>
                                        Cộng theo %
                                    </Option>
                                </Select>
                            </Col>
                            <Col md={"2"}>
                                <InputNumber style={{width: '100%'}}
                                             value={item.value}
                                             min={0}
                                    // max={(type === 2) ? 100 : Number.MAX_VALUE}
                                             onChange={(value) => this.onChangeAdditionalIncome(index, 'value', value)}
                                             formatter={value => (type === 1) ? `${value} đ` : `${value} %`}
                                             parser={value => (type === 1) ? value.replace(' đ', '') : value.replace(' %', '')}
                                />
                            </Col>
                            <Col md={"2"}>
                                {type === 2 ?
                                    <Select value={item.idBasedOn}
                                            style={{width: '100%'}}
                                            allowClear={false}
                                            onChange={(value) => this.onChangeAdditionalIncome(index, 'idBasedOn', value)}
                                    >
                                        <Option value={"TOTAL_BASE_SALARY"}>
                                            Tổng lương cố định
                                        </Option>
                                        <Option value={data.baseSalary.formulaId}>
                                            {data.baseSalary.description}
                                        </Option>
                                        <Option value={data.extraSalary.formulaId}>
                                            {data.extraSalary.description}
                                        </Option>
                                        <Option value={data.mealMoney.formulaId}>
                                            {data.mealMoney.description}
                                        </Option>
                                        <Option value={data.overtimeMoney.formulaId}>
                                            {data.overtimeMoney.description}
                                        </Option>
                                        {_.map(data.additionalIncome, (ele, ind) => {
                                            if (item.formulaId !== ele.formulaId && !_.isEmpty(ele.formulaId)) {
                                                return <Option value={ele.formulaId}>
                                                    {ele.description}
                                                </Option>
                                            }
                                        })}
                                    </Select>
                                    : null}
                            </Col>
                            <Col md={"1"}>
                                <div className={"flex-row"} style={{justifyContent: 'space-between'}}>
                                    <Checkbox checked={item.calcTax}
                                              onChange={(e) => this.onChangeAdditionalIncome(index, 'calcTax', e.target.checked)}/>
                                    <div className="btn-new-small">
                                        <MinusCircleOutlined style={{color: '#EF534F'}}
                                                             onClick={() => this.removeAdditionalIncome(index)}
                                        />
                                    </div>
                                </div>
                            </Col>

                        </Row>
                    </>
                })}
            </Card>
        </>)
    };

    renderCardDeduction = () => {
        const {data, mode} = this.state;

        const plusButton = (<div
            className="float-right btn-new-small"
        >
            <Tooltip title={"Thêm khoản khấu trừ mới"}>
                <PlusSquareOutlined onClick={this.onClickAddPenalty}/>
            </Tooltip>
        </div>);

        return (<>
            <h4 style={{marginTop: 20}}>
                III. Các khoản khấu trừ
            </h4>
            <Card type={"inner"} extra={(mode === 'view') ? null : plusButton}>
                <Row>
                    <Col md={"2"}>
                        <label>Mã công thức</label>
                    </Col>
                    <Col md={"3"}>
                        <label>Tên công thức</label>
                    </Col>
                    <Col md={"2"}>
                        <label>Hình thức tính</label>
                    </Col>
                    <Col md={"2"}>
                        <label>Giá trị</label>
                    </Col>
                    <Col md={"2"}>
                        <label>Dựa trên</label>
                    </Col>
                    <Col md={"1"}>
                        <label>Trừ trước thuế</label>
                    </Col>
                </Row>
                {/*Late Penalty Row*/}
                <Row>
                    <Col md={"2"}>
                        <Input value={data.latePenalty.formulaId}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"3"}>
                        <Input value={data.latePenalty.description}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <Input value={"Theo số lần vi phạm"}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <InputNumber style={{width: '100%'}}
                                     disabled={mode === 'view'}
                                     value={data.latePenalty.value} min={0}
                                     onChange={(e) => this.onChangeInputNumberValue('latePenalty', e)}
                                     formatter={value => `${value} đ/lần`}
                                     parser={value => value.replace(' đ/lần', '')}
                        />
                    </Col>
                </Row>
                {/*Non Permission Off Row*/}
                <Row style={{marginTop: 20}}>
                    <Col md={"2"}>
                        <Input value={data.nonPermissionOff.formulaId}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"3"}>
                        <Input value={data.nonPermissionOff.description}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <Input value={"Theo số ngày nghỉ"}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <InputNumber style={{width: '100%'}}
                                     disabled={mode === 'view'}
                                     value={data.nonPermissionOff.value} min={0}
                                     onChange={(e) => this.onChangeInputNumberValue('nonPermissionOff', e)}
                                     formatter={value => `${value} đ/ngày`}
                                     parser={value => value.replace(' đ/ngày', '')}

                        />
                    </Col>
                </Row>
                {/*Insurance Money Row*/}
                <Row style={{marginTop: 20}}>
                    <Col md={"2"}>
                        <Input value={data.insuranceMoney.formulaId}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"3"}>
                        <Input value={data.insuranceMoney.description}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <Input value={"% trên lương cơ bản"}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <InputNumber style={{width: '100%'}}
                                     disabled={mode === 'view'}
                                     value={data.insuranceMoney.value} min={0}
                                     onChange={(e) => this.onChangeInputNumberValue('insuranceMoney', e)}
                                     formatter={value => `${value} %`}
                                     parser={value => value.replace(' %', '')}
                        />
                    </Col>
                </Row>
                {/*Tax Money Row*/}
                <Row style={{marginTop: 20}}>
                    <Col md={"2"}>
                        <Input value={data.taxMoney.formulaId}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"3"}>
                        <Input value={data.taxMoney.description}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <Input value={"% trên tổng thu nhập"}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <InputNumber style={{width: '100%'}}
                                     disabled={mode === 'view'}
                                     value={data.taxMoney.value} min={0}
                                     onChange={(e) => this.onChangeInputNumberValue('taxMoney', e)}
                                     formatter={value => `${value} %`}
                                     parser={value => value.replace(' %', '')}
                        />
                    </Col>
                </Row>
                {/*Additional Penalty Rows*/}
                {_.map(data.additionalPenalty, (item, index) => {
                    const {type} = item;
                    return <>
                        <Row style={index === 0 ?
                            {marginTop: 20} : null
                        }
                             key={`income_${index}`}>
                            <Col md={"2"}>
                                <Input value={item.formulaId}
                                       onChange={(e) => this.onChangeAdditionalPenalty(index, 'formulaId', e.target.value)}
                                       className={"salary-input"}
                                />
                            </Col>
                            <Col md={"3"}>
                                <Input value={item.description}
                                       className={"salary-input"}
                                       onChange={(e) => this.onChangeAdditionalPenalty(index, 'description', e.target.value)}
                                />
                            </Col>
                            <Col md={"2"}>
                                <Select value={item.type}
                                        style={{width: '100%'}}
                                        allowClear={false}
                                        onChange={(value) => this.onChangeAdditionalPenalty(index, 'type', value)}
                                >
                                    <Option value={1}>
                                        Trừ thẳng
                                    </Option>
                                    <Option value={2}>
                                        Trừ theo %
                                    </Option>
                                </Select>
                            </Col>
                            <Col md={"2"}>
                                <InputNumber style={{width: '100%'}}
                                             value={item.value}
                                             min={0}
                                             onChange={(value) => this.onChangeAdditionalPenalty(index, 'value', value)}
                                             formatter={value => (type === 1) ? `${value} đ` : `${value} %`}
                                             parser={value => (type === 1) ? value.replace(' đ', '') : value.replace(' %', '')}
                                />
                            </Col>
                            <Col md={"2"}>
                                {type === 2 ?
                                    <Select value={item.idBasedOn}
                                            style={{width: '100%'}}
                                            allowClear={false}
                                            onChange={(value) => this.onChangeAdditionalPenalty(index, 'idBasedOn', value)}
                                    >
                                        <Option value={"TOTAL_BASE_SALARY"}>
                                            Tổng lương cố định
                                        </Option>
                                        <Option value={data.baseSalary.formulaId}>
                                            {data.baseSalary.description}
                                        </Option>
                                        <Option value={data.extraSalary.formulaId}>
                                            {data.extraSalary.description}
                                        </Option>
                                        <Option value={data.mealMoney.formulaId}>
                                            {data.mealMoney.description}
                                        </Option>
                                        <Option value={data.overtimeMoney.formulaId}>
                                            {data.overtimeMoney.description}
                                        </Option>
                                        {_.map(data.additionalIncome, (ele, ind) => {
                                            if (item.formulaId !== ele.formulaId && !_.isEmpty(ele.formulaId)) {
                                                return <Option value={ele.formulaId}>
                                                    {ele.description}
                                                </Option>
                                            }
                                        })}
                                    </Select>
                                    : null}
                            </Col>
                            <Col md={"1"}>
                                <div className={"flex-row"} style={{justifyContent: 'space-between'}}>
                                    <Checkbox checked={item.calcTax}
                                              onChange={(e) => this.onChangeAdditionalPenalty(index, 'calcTax', e.target.checked)}/>
                                    <div className="btn-new-small">
                                        <MinusCircleOutlined style={{color: '#EF534F'}}
                                                             onClick={() => this.removeAdditionalPenalty(index)}
                                        />
                                    </div>
                                </div>
                            </Col>

                        </Row>
                    </>
                })}
            </Card>
        </>)
    };

    renderCardExtra = () => {
        const {data, mode} = this.state;
        return (<>
            <h4 style={{marginTop: 20}}>
                IV. Các khoản phụ
            </h4>
            <Card type={"inner"}>
                <Row>
                    <Col md={"2"}>
                        <label>Mã công thức</label>
                    </Col>
                    <Col md={"3"}>
                        <label>Tên công thức</label>
                    </Col>
                    <Col md={"2"}>
                        <label>Hình thức tính</label>
                    </Col>
                    <Col md={"2"}>
                        <label>Giá trị</label>
                    </Col>
                </Row>
                {/*Pre Tax Dependency Reduction Row*/}
                <Row>
                    <Col md={"2"}>
                        <Input value={data.preTaxDependencyReduction.formulaId}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"3"}>
                        <Input value={data.preTaxDependencyReduction.description}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <Input value={"Trừ trước thuế"}
                               className={"salary-input"}
                               disabled
                        />
                    </Col>
                    <Col md={"2"}>
                        <InputNumber style={{width: '100%'}}
                                     disabled={mode === 'view'}
                                     value={data.preTaxDependencyReduction.value} min={0}
                                     onChange={(e) => this.onChangeInputNumberValue('preTaxDependencyReduction', e)}
                                     formatter={value => `${value} đ`}
                                     parser={value => value.replace(' đ', '')}
                        />
                    </Col>
                </Row>
            </Card>
        </>)
    };

    render() {
        const {isLoading, data, mode} = this.state;

        if (isLoading) {
            return (
                <ReactLoading
                    type={'spinningBubbles'}
                    color={'#4caf50'}
                    className={'center-div'}
                    height={'10%'}
                    width={'10%'}
                />
            );
        }

        const canView = canDoAction(
            this.props.data,
            ROLE_GROUP_KEY.SALARY,
            ACTION.READ
        );

        const canAdd = canDoAction(
            this.props.data,
            ROLE_GROUP_KEY.SALARY,
            ACTION.CREATE
        );

        if (data === null || !canView) {
            return (
                <div className={"center-div"}>
                    <Empty
                        description={
                            <span style={{color: 'rgba(0, 0, 0, 0.65)'}}>
                            Không có dữ liệu
                        </span>
                        }
                    />
                    <AntButton
                        type="primary"
                        style={{marginTop: 10, left: '20%'}}
                        icon={<CaretLeftOutlined/>}
                        onClick={this.props.handleClickBack}
                    >
                        Quay lại
                    </AntButton>
                </div>
            );
        }

        return (
            <div className="content">
                <div className="table-wrapper tabs-big">
                    {this.renderHeader()}
                    <Form>
                        {this.renderCycleType()}

                        <Card title={"Chi tiết"} className={"card-salary-detail"}>
                            <div className={"card-salary-body"}>
                                {this.renderCardBaseSalary()}
                                {this.renderCardIncome()}
                                {this.renderCardDeduction()}
                                {this.renderCardExtra()}
                            </div>
                        </Card>
                        {canAdd && (mode === 'view') ?
                            <div style={{margin: 'auto 20px', float: 'right'}}>
                                <Popconfirm
                                    title={"Bạn chắc chắn tính lương cho nhân viên?"}
                                    icon={<QuestionCircleOutlined/>}
                                    okText="Đồng ý"
                                    cancelText="Huỷ"
                                    onConfirm={this.handleCalculateSalary}
                                >
                                    <AntButton
                                        type="primary"
                                        style={{margin: 15}}
                                        shape="round"
                                        size={"large"}
                                    >
                                        Tính lương cho nhân viên
                                    </AntButton>
                                </Popconfirm>
                            </div> : null}
                    </Form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

export default connect(mapStateToProps, null)(EmployeeSalary);
