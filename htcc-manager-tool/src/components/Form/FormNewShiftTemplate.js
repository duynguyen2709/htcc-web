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
import {
    CheckCircleOutlined,
    MinusCircleOutlined,
    PlusSquareOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { Card, Collapse, Empty, Popconfirm, Select, Tooltip } from 'antd';
import { shiftTemplate } from '../../api';
import { WEEK_DAYS } from '../../constant/constant';

const { Panel } = Collapse;
const { Option } = Select;

const RESET_TOUCH = {
    templateName: false,
};

class FormNewShiftTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                templateName: '',
                shiftDetailMap: {
                    1: [],
                    2: [],
                    3: [],
                    4: [],
                    5: [],
                    6: [],
                    7: [],
                },
            },
            messageInvalid: {
                templateName: 'Vui lòng nhập tên ca',
            },
            touch: {
                ...RESET_TOUCH,
            },
            isLoading: false,
        };
    }

    handleOnChange = (e) => {
        const { value: valueInput, name } = e.target;
        let { value, touch } = this.state;

        value[name] = valueInput;
        touch[name] = true;

        this.setState({
            value: { ...value },
            touch: { ...touch },
        });
    };

    clear = () => {
        this.setState({
            value: {
                templateName: '',
                shiftDetailMap: {
                    1: [],
                    2: [],
                    3: [],
                    4: [],
                    5: [],
                    6: [],
                    7: [],
                },
            },
            touch: { ...RESET_TOUCH },
        });
    };

    convertDataList = () => {
        const { value } = this.state;
        const { shiftDetailMap } = value;
        const result = [];

        for (let entry in shiftDetailMap) {
            const list = shiftDetailMap[entry];
            for (let detail of list) {
                const obj = {
                    weekDay: entry,
                    shiftId: detail.shiftId,
                    officeId: detail.officeId,
                };

                result.push(obj);
            }
        }

        return result;
    };

    handleSubmit = (e) => {
        const { value } = this.state;
        if (_.isEmpty(value.templateName)) {
            store.addNotification(
                createNotify('warning', 'Tên ca không được rỗng')
            );
            return;
        }

        const dataList = this.convertDataList();
        if (_.isEmpty(dataList)) {
            store.addNotification(
                createNotify('warning', 'Chi tiết ca không được rỗng')
            );
            return;
        }

        const data = {
            templateName: value.templateName,
            shiftTimeList: dataList,
        };

        this.props.loading();
        this.setState({
            isLoading: true,
        });

        shiftTemplate
            .createShiftTemplate(data)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.props.stopLoading();
                    this.clear();
                    this.props.onSubmit(true);
                } else {
                    this.props.stopLoading();

                    this.setState({
                        isLoading: false,
                    });
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                this.props.stopLoading();

                this.setState({
                    isLoading: false,
                });

                console.error(err);
                store.addNotification(
                    createNotify(
                        'danger',
                        'Hệ thống có lỗi. Vui lòng thử lại sau.'
                    )
                );
            });
    };

    renderButtonAddShift = (weekDay, firstOfficeId) => {
        return (
            <Tooltip placement="bottomLeft" title={'Thêm ca'}>
                <PlusSquareOutlined
                    onClick={(event) => {
                        event.stopPropagation();
                        this.addShiftDetailRow(weekDay, firstOfficeId);
                    }}
                />
            </Tooltip>
        );
    };

    addShiftDetailRow = (weekDay, firstOfficeId) => {
        const { value } = this.state;
        const { shiftDetailMap } = value;
        const { officeShiftTimeMap } = this.props.data;
        const key = new Date().getTime();
        let shiftId = '';

        for (let office in officeShiftTimeMap) {
            if (_.isEqual(office, firstOfficeId)) {
                shiftId = officeShiftTimeMap[office][0].shiftId;
            }
        }
        shiftDetailMap[weekDay].push({
            key: key,
            officeId: firstOfficeId,
            shiftId: shiftId,
        });

        this.setState({
            value: {
                ...value,
                shiftDetailMap: shiftDetailMap,
            },
        });
    };

    getListShiftByOffice = (weekDay, rowKey) => {
        const { value } = this.state;
        const { officeShiftTimeMap } = this.props.data;
        const { shiftDetailMap } = value;
        const list = shiftDetailMap[weekDay];
        for (let shift of list) {
            if (_.isEqual(shift.key, rowKey)) {
                const shiftList = officeShiftTimeMap[shift.officeId];
                return shiftList ? shiftList : [];
            }
        }
        return [];
    };

    deleteRow = (weekDay, rowKey) => {
        const { value } = this.state;
        const { shiftDetailMap } = value;
        shiftDetailMap[weekDay] = _.filter(
            shiftDetailMap[weekDay],
            (ele) => !_.isEqual(ele.key, rowKey)
        );

        this.setState({
            value: {
                ...value,
                shiftDetailMap: shiftDetailMap,
            },
        });
    };

    onChangeOffice = (weekDay, rowKey, officeId) => {
        const { value } = this.state;
        const { shiftDetailMap } = value;
        const { officeShiftTimeMap } = this.props.data;

        const list = shiftDetailMap[weekDay];
        for (let shift of list) {
            if (_.isEqual(shift.key, rowKey)) {
                shift.officeId = officeId;

                for (let office in officeShiftTimeMap) {
                    if (_.isEqual(office, officeId)) {
                        shift.shiftId = officeShiftTimeMap[office][0].shiftId;
                    }
                }
            }
        }

        this.setState({
            value: {
                ...value,
                shiftDetailMap: shiftDetailMap,
            },
        });
    };

    onChangeShift = (weekDay, rowKey, shiftId) => {
        const { value } = this.state;
        const { shiftDetailMap } = value;

        const list = shiftDetailMap[weekDay];
        for (let shift of list) {
            if (_.isEqual(shift.key, rowKey)) {
                shift.shiftId = shiftId;
            }
        }

        this.setState({
            value: {
                ...value,
                shiftDetailMap: shiftDetailMap,
            },
        });
    };

    getShiftValue = (weekDay, rowKey) => {
        const { value } = this.state;
        const { shiftDetailMap } = value;
        const list = shiftDetailMap[weekDay];
        for (let shift of list) {
            if (_.isEqual(shift.key, rowKey)) {
                return shift.shiftId;
            }
        }
    };

    render() {
        const { value, messageInvalid, touch } = this.state;
        const { officeShiftTimeMap } = this.props.data;
        if (_.isEmpty(officeShiftTimeMap)) {
            return (
                <Empty
                    style={{ marginTop: '20px' }}
                    description={
                        <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                            Không có dữ liệu
                        </span>
                    }
                />
            );
        }

        let firstOfficeId = '';
        for (let office in officeShiftTimeMap) {
            firstOfficeId = office;
            break;
        }

        return (
            <Form>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label>Tên ca</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập tên ca mẫu"
                                type="text"
                                name="templateName"
                                value={value.templateName}
                                onChange={this.handleOnChange}
                                invalid={
                                    touch.templateName &&
                                    _.isEmpty(value.templateName)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.templateName}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <Card
                                title={'Chi tiết ca'}
                                className={'card-add-shift-template'}
                            >
                                {_.map(value.shiftDetailMap, (val, key) => {
                                    return (
                                        <Collapse
                                            key={key}
                                            defaultActiveKey={`panel__${key}`}
                                            style={{ marginTop: 8 }}
                                        >
                                            <Panel
                                                key={`panel__${key}`}
                                                extra={this.renderButtonAddShift(
                                                    key,
                                                    firstOfficeId
                                                )}
                                                header={WEEK_DAYS[key]}
                                            >
                                                {_.map(
                                                    value.shiftDetailMap[key],
                                                    (item, index) => {
                                                        const rowKey = item.key;

                                                        return (
                                                            <Row
                                                                key={`${key}_${index}`}
                                                            >
                                                                <Col
                                                                    md={2}
                                                                    style={{
                                                                        marginTop: 10,
                                                                        marginRight: -20,
                                                                    }}
                                                                >
                                                                    <span>
                                                                        Chi
                                                                        nhánh
                                                                    </span>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <Select
                                                                        allowClear={
                                                                            false
                                                                        }
                                                                        defaultValue={
                                                                            firstOfficeId
                                                                        }
                                                                        style={{
                                                                            width:
                                                                                '100%',
                                                                        }}
                                                                        className="bor-radius"
                                                                        onChange={(
                                                                            officeId
                                                                        ) =>
                                                                            this.onChangeOffice(
                                                                                key,
                                                                                rowKey,
                                                                                officeId
                                                                            )
                                                                        }
                                                                    >
                                                                        {_.map(
                                                                            officeShiftTimeMap,
                                                                            (
                                                                                shiftList,
                                                                                officeId
                                                                            ) => {
                                                                                return (
                                                                                    <Option
                                                                                        key={`${key}_${index}_${officeId}}`}
                                                                                        className=" bor-radius"
                                                                                        value={
                                                                                            officeId
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            officeId
                                                                                        }
                                                                                    </Option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </Select>
                                                                </Col>
                                                                <Col
                                                                    md={1}
                                                                    style={{
                                                                        marginTop: 10,
                                                                        marginRight: -20,
                                                                    }}
                                                                >
                                                                    <span>
                                                                        Ca
                                                                    </span>
                                                                </Col>
                                                                <Col
                                                                    md={6}
                                                                    style={{
                                                                        display:
                                                                            'flex',
                                                                    }}
                                                                >
                                                                    <Col
                                                                        md={11}
                                                                    >
                                                                        <Select
                                                                            allowClear={
                                                                                false
                                                                            }
                                                                            value={this.getShiftValue(
                                                                                key,
                                                                                rowKey
                                                                            )}
                                                                            onChange={(
                                                                                shiftId
                                                                            ) =>
                                                                                this.onChangeShift(
                                                                                    key,
                                                                                    rowKey,
                                                                                    shiftId
                                                                                )
                                                                            }
                                                                            style={{
                                                                                width:
                                                                                    '100%',
                                                                            }}
                                                                            className="bor-radius"
                                                                        >
                                                                            {_.map(
                                                                                this.getListShiftByOffice(
                                                                                    key,
                                                                                    rowKey
                                                                                ),
                                                                                (
                                                                                    shift,
                                                                                    subIndex
                                                                                ) => {
                                                                                    return (
                                                                                        <Option
                                                                                            key={`${key}_${index}_${shift.shiftId}}`}
                                                                                            className=" bor-radius"
                                                                                            value={
                                                                                                shift.shiftId
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                shift.shiftName
                                                                                            }{' '}
                                                                                            (
                                                                                            {
                                                                                                shift.shiftId
                                                                                            }

                                                                                            )
                                                                                            _{' '}
                                                                                            {
                                                                                                shift.startTime
                                                                                            }

                                                                                            -
                                                                                            {
                                                                                                shift.endTime
                                                                                            }
                                                                                        </Option>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </Select>
                                                                    </Col>
                                                                    <Col md={1}>
                                                                        <MinusCircleOutlined
                                                                            style={{
                                                                                margin: 10,
                                                                            }}
                                                                            onClick={() =>
                                                                                this.deleteRow(
                                                                                    key,
                                                                                    rowKey
                                                                                )
                                                                            }
                                                                        />
                                                                    </Col>
                                                                </Col>
                                                            </Row>
                                                        );
                                                    }
                                                )}
                                            </Panel>
                                        </Collapse>
                                    );
                                })}
                            </Card>
                        </FormGroup>
                    </Col>
                </Row>
                <CardFooter className="text-right info">
                    <Popconfirm
                        title="Bạn chắc chắn thêm mới？"
                        icon={<QuestionCircleOutlined />}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onConfirm={() => this.handleSubmit()}
                    >
                        <Button
                            className="btn-custom"
                            color="primary"
                            type="button"
                            disabled={this.state.isLoading}
                        >
                            <CheckCircleOutlined
                                style={{
                                    display: 'inline',
                                    margin: '5px 10px 0 0',
                                }}
                            />{' '}
                            {'  '}
                            <span className="btn-save-text"> THÊM</span>
                        </Button>
                    </Popconfirm>
                </CardFooter>
            </Form>
        );
    }
}

export default FormNewShiftTemplate;
