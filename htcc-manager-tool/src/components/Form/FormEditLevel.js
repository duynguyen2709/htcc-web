import React from 'react';
import {Button, CardFooter, Col, Form, FormFeedback, FormGroup, Input, Row,} from 'reactstrap';
import * as _ from 'lodash';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {CheckCircleOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Popconfirm} from 'antd';

const INITFORM = {
    level: '',
    totalDayOff: '',
};

const RESET_TOUCH = {
    level: false,
    totalDayOff: false,
};

class FormEditLevel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {...INITFORM},
            messageInvalid: {
                level: 'Cấp bậc là số',
                totalDayOff: 'Ngày nghỉ là số',
            },
            touch: {
                ...RESET_TOUCH,
            },
        };
    }

    componentDidMount() {
        const {data} = this.props;

        this.setState({
            value: {
                ...data,
            },
        });
    }

    checkValidDataInput = () => {
        const {level, totalDayOff} = this.state.value;
        const {listData} = this.props;

        if (_.isEmpty(level) && _.isEmpty(totalDayOff)) {
            store.addNotification(
                createNotify('warning', 'Thông tin chưa hợp lệ !')
            );

            return false;
        }

        const index = _.findIndex(
            listData,
            (item) => parseFloat(item.level) === parseFloat(level)
        );

        if (index > -1) {
            store.addNotification(
                createNotify('warning', `Cấp bậc [ ${level} ] đã tồn tại !`)
            );

            return false;
        }

        return true;
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
            value.level = parseFloat(value.level);
            value.totalDayOff = parseFloat(value.totalDayOff);

            this.props.loading();
            this.props.onSubmit(true, value);
        }
    };

    render() {
        const {value, messageInvalid, touch} = this.state;

        return (
            <Form>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label htmlFor="email">Cấp bậc</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập cấp bậc"
                                type="number"
                                name="level"
                                value={value.level}
                                disabled
                                min={0}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label htmlFor="email">Số ngày nghỉ</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập số ngày nghỉ"
                                type="number"
                                onChange={this.handleOnChange}
                                name="totalDayOff"
                                value={value.totalDayOff}
                                invalid={
                                    touch.totalDayOff &&
                                    _.isEmpty(value.totalDayOff)
                                }
                                min={0}
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.totalDayOff}
                            </FormFeedback>
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

export default FormEditLevel;
