import React from 'react';
import { Button, CardFooter, FormGroup, Form, Row, Col } from 'reactstrap';
import { Popconfirm, Select, Input } from 'antd';
import * as _ from 'lodash';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import { SendOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { notiApi } from '../../api';
import ReactLoading from 'react-loading';
import { connect } from 'react-redux';

const { Option } = Select;
const { TextArea } = Input;

const INIT_VALUE = {
    content: '',
    title: '',
    iconId: '',
    officeId: '',
    receiverType: '',
    username: '',
};

const INIT_TOUCH = {
    content: false,
    title: false,
};

class SendNotification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                ...INIT_VALUE,
            },
            messageInvalid: {
                content: 'Nội dung không được rỗng',
                title: 'Tiêu đều không được rỗng',
            },
            isLoading: false,
            touched: {
                ...INIT_TOUCH,
            },
            type: [],
            sending: false,
        };
    }
    checkValidDataInput = () => {
        const { title, content } = this.state.value;

        return !_.isEmpty(title) && !_.isEmpty(content);
    };

    componentDidMount() {
        this.initField(_.get(this.props, 'data', {}));
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (
            !_.isEmpty(nextProps.data) &&
            !_.isEqual(nextProps.data, this.props.data)
        ) {
            this.initField(nextProps.data);
        }
    }

    initField = (data = {}) => {
        if (!_.isEmpty(data)) {
            const {
                iconList,
                canManageOfffices = [],
                isSuperAdmin = false,
                canManageEmployees = [],
            } = data;

            let username = '';
            let officeId = '';

            const type = [];

            if (isSuperAdmin) {
                type.push({
                    key: 1,
                    value: 'Toàn công ty',
                });
            }

            if (!_.isEmpty(canManageEmployees)) {
                type.push({
                    key: 2,
                    value: 'Nhân viên',
                });

                username = _.get(canManageEmployees[0], 'username', '');
            }

            if (!_.isEmpty(canManageOfffices)) {
                type.push({
                    key: 3,
                    value: 'Chi nhánh',
                });
                officeId = canManageOfffices[0] || '';
            }

            this.setState({
                value: {
                    ...this.state.value,
                    iconId: _.get(iconList[0], 'iconId', ''),
                    receiverType: _.get(type[0], 'key', ''),
                    username,
                    officeId,
                },
                type,
            });
        }
    };

    handleOnChange = (e) => {
        const { value: valueInput, name } = e.target;
        let { value, touched } = this.state;

        value[name] = valueInput;
        touched[name] = true;

        this.setState({
            value: { ...value },
            touched: { ...touched },
        });
    };

    handleSubmit = () => {
        if (this.checkValidDataInput()) {
            const { value } = this.state;

            switch (value.receiverType) {
                case 2: {
                    value['officeId'] = '';
                    break;
                }
                case 3: {
                    value['username'] = '';
                    break;
                }

                default: {
                    value['officeId'] = '';
                    value['username'] = '';
                    break;
                }
            }

            this.setState({
                sending: true,
            });

            notiApi
                .createNoti(this.state.value)
                .then((res) => {
                    if (res.returnCode === 1) {
                        this.setState({
                            value: {
                                ...value,
                                content: '',
                                title: '',
                            },
                            touched: INIT_TOUCH,
                            sending: false,
                        });
                        store.addNotification(
                            createNotify(
                                'default',
                                'Thông báo đang được gửi đi !'
                            )
                        );
                    } else {
                        store.addNotification(
                            createNotify('danger', res.returnMessage)
                        );

                        this.setState({
                            sending: false,
                        });
                    }
                })
                .catch((err) => {
                    store.addNotification(
                        createNotify('danger', JSON.stringify(err))
                    );
                    this.setState({
                        sending: false,
                    });
                });
        } else {
            store.addNotification(
                createNotify(
                    'warning',
                    'Cần điền đầy đủ thông tin trước khi gửi !'
                )
            );
        }
    };

    renderButton = () => {
        return (
            <Popconfirm
                title="Bạn chắc chắn gửi thông báo này？"
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
                    <SendOutlined
                        style={{ display: 'inline', margin: '5px 10px 0 0' }}
                    />{' '}
                    {'  '}
                    <span className="btn-save-text"> GỬI</span>
                </Button>
            </Popconfirm>
        );
    };

    handleChangeIcon = (val) => {
        const { value } = this.state;

        this.setState({
            value: {
                ...value,
                iconId: val,
            },
        });
    };

    renderSubOption = () => {
        const { value } = this.state;
        const {
            canManageEmployees = [],
            canManageOfffices = [],
        } = this.props.data;

        switch (value.receiverType) {
            case 2:
                return (
                    <Col md="6">
                        <FormGroup>
                            <label style={{ visibility: 'hidden' }}>
                                Nhân viên
                            </label>
                            <Select
                                style={{ width: '100%' }}
                                className="bor-radius"
                                onChange={(val) =>
                                    this.handleChangeOption('username', val)
                                }
                                value={value.username}
                            >
                                {_.map(canManageEmployees, (i) => {
                                    return (
                                        <Option
                                            className=" bor-radius"
                                            value={i.username}
                                            key={i.username}
                                        >
                                            {i.username}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </FormGroup>
                    </Col>
                );
            case 3:
                return (
                    <Col md="6">
                        <FormGroup>
                            <label style={{ visibility: 'hidden' }}>
                                Chi nhánh
                            </label>
                            <Select
                                style={{ width: '100%' }}
                                className="bor-radius"
                                onChange={(val) =>
                                    this.handleChangeOption('officeId', val)
                                }
                                value={value.officeId}
                            >
                                {_.map(canManageOfffices, (i) => {
                                    return (
                                        <Option
                                            className=" bor-radius"
                                            value={i}
                                            key={i}
                                        >
                                            {i}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </FormGroup>
                    </Col>
                );
            default:
                break;
        }
    };

    handleChangeOption = (name, val) => {
        this.setState({
            value: {
                ...this.state.value,
                [name]: val,
            },
        });
    };

    render() {
        const { value, sending, type } = this.state;
        const { data = {} } = this.props;

        return (
            <React.Fragment>
                {sending && (
                    <ReactLoading
                        type={'spinningBubbles'}
                        color={'#4caf50'}
                        className={'center-div'}
                        height={'10%'}
                        width={'10%'}
                    />
                )}
                <Form className="form-company-info">
                    {value.receiverType && (
                        <div>
                            <Row>
                                <Col md="12">
                                    <FormGroup>
                                        <label>Tiêu đề</label>
                                        <Input
                                            placeholder="Nhập tiêu đề"
                                            type="text"
                                            className="form-control bor-radius bor-gray text-dark"
                                            name="title"
                                            value={value.title}
                                            onChange={this.handleOnChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="12">
                                    <FormGroup>
                                        <label>Nội dung</label>
                                        <TextArea
                                            name="content"
                                            className="form-control bor-radius text-dark"
                                            value={value.content}
                                            onChange={(e) =>
                                                this.handleOnChange(e)
                                            }
                                            rows={4}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="12">
                                    <FormGroup>
                                        <label>Icon</label>
                                        <Select
                                            style={{ width: '100%' }}
                                            className="bor-radius"
                                            onChange={(val) =>
                                                this.handleChangeIcon(val)
                                            }
                                            value={value.iconId}
                                        >
                                            {_.map(data.iconList, (icon) => {
                                                return (
                                                    <Option
                                                        className=" bor-radius"
                                                        value={icon.iconId}
                                                        key={icon.iconId}
                                                    >
                                                        <div>
                                                            <img
                                                                className="mr-3"
                                                                width={20}
                                                                alt={
                                                                    icon.iconURL
                                                                }
                                                                src={
                                                                    icon.iconURL
                                                                }
                                                            />
                                                            {
                                                                icon.screenDescription
                                                            }
                                                        </div>
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </FormGroup>
                                </Col>
                                <Col className="pr-md-1" md="6">
                                    <FormGroup>
                                        <label>Gửi đến</label>
                                        <Select
                                            style={{ width: '100%' }}
                                            className="bor-radius"
                                            onChange={(val) =>
                                                this.handleChangeOption(
                                                    'receiverType',
                                                    val
                                                )
                                            }
                                            value={value.receiverType}
                                        >
                                            {_.map(type, (i) => {
                                                return (
                                                    <Option
                                                        className=" bor-radius"
                                                        value={i.key}
                                                        key={i.key}
                                                    >
                                                        {i.value}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </FormGroup>
                                </Col>
                                {this.renderSubOption()}
                            </Row>
                            <CardFooter className="text-right info">
                                {this.renderButton()}
                            </CardFooter>
                        </div>
                    )}
                </Form>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

export default connect(mapStateToProps)(SendNotification);
