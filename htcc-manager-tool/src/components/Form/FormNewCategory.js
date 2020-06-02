import React from 'react';
import {Button, CardFooter, Col, Form, FormFeedback, FormGroup, Input, Row,} from 'reactstrap';
import * as _ from 'lodash';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {CheckCircleOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Popconfirm, Select} from 'antd';

const {Option} = Select;

const INITFORM = {
    category: '',
    useDayOff: false,
    hasSalary: false,
};

const RESET_TOUCH = {
    category: false,
};

class FormNewCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {...INITFORM},
            messageInvalid: {
                category: 'Tên danh mục không được rỗng',
            },
            touch: {
                category: false,
            },
        };
    }

    checkValidDataInput = () => {
        const {category} = this.state.value;
        const {listData} = this.props;

        if (_.isEmpty(category)) {
            store.addNotification(
                createNotify('warning', 'Chưa nhập tên danh mục !')
            );

            return false;
        }

        const index = _.findIndex(
            listData,
            (item) => item.category === category
        );

        if (index > -1) {
            store.addNotification(
                createNotify('warning', `Danh mục [ ${category} ] đã tồn tại !`)
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

            this.props.loading();
            this.props.onSubmit(true, value);
        }
    };

    handleChangeUseDayOff = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                useDayOff: value,
            },
        });
    };

    handleChangeHasSalary = (value) => {
        this.setState({
            value: {
                ...this.state.value,
                hasSalary: value,
            },
        });
    };

    render() {
        const {value, messageInvalid, touch} = this.state;

        return (
            <Form>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label htmlFor="email">Tên danh mục</label>
                            <Input
                                className="bor-gray text-dark"
                                placeholder="Nhập tên danh mục"
                                type="text"
                                onChange={this.handleOnChange}
                                name="category"
                                value={value.category}
                                invalid={
                                    touch.category && _.isEmpty(value.category)
                                }
                            />
                            <FormFeedback invalid={'true'}>
                                {messageInvalid.category}
                            </FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <FormGroup>
                            <label>Được hưởng lương ?</label>
                            <Select
                                style={{width: '100%'}}
                                className="bor-radius"
                                defaultValue={false}
                                onChange={(val) =>
                                    this.handleChangeHasSalary(val)
                                }
                                onCancel={() => this.clear()}
                                value={value.hasSalary}
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
                            <label>Trừ ngày phép ?</label>
                            <Select
                                style={{width: '100%'}}
                                className="bor-radius"
                                defaultValue={false}
                                onChange={(val) =>
                                    this.handleChangeUseDayOff(val)
                                }
                                onCancel={() => this.clear()}
                                value={value.useDayOff}
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

export default FormNewCategory;
