import React from 'react';
import {Button, CardFooter, Col, Form, FormGroup, Row} from 'reactstrap';
import {Input, Popconfirm, Select, Spin} from 'antd';
import * as _ from 'lodash';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {QuestionCircleOutlined, SendOutlined} from '@ant-design/icons';
import {notiApi} from '../../api';
import {connect} from 'react-redux';

const {Option} = Select;
const {TextArea} = Input;

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

class FormSendNotification extends React.Component {
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
        const {title, content} = this.state.value;

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
                canManageOffices = [],
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

            if (!_.isEmpty(canManageOffices)) {
                type.push({
                    key: 3,
                    value: 'Chi nhánh',
                });
                officeId = canManageOffices[0] || '';
            }

            if (!_.isEmpty(canManageEmployees)) {
                type.push({
                    key: 2,
                    value: 'Nhân viên',
                });

                username = _.get(canManageEmployees[0], 'username', '');
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

    clear = () => {
        this.setState({
            value: {...INIT_VALUE},
            touch: {...INIT_TOUCH},
        }, () => this.initField(_.get(this.props, 'data', {})));
    };

    handleOnChange = (e) => {
        const {value: valueInput, name} = e.target;
        let {value, touched} = this.state;

        value[name] = valueInput;
        touched[name] = true;

        this.setState({
            value: {...value},
            touched: {...touched},
        });
    };

    handleSubmit = () => {
        if (this.checkValidDataInput()) {
            const {value} = this.state;

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
                        });
                        store.addNotification(
                            createNotify(
                                'default',
                                'Thông báo đang được gửi đi !'
                            )
                        );

                        this.props.onSubmit(true);
                    } else {
                        store.addNotification(
                            createNotify('danger', res.returnMessage)
                        );
                    }
                })
                .catch((err) => {
                    store.addNotification(
                        createNotify('danger', JSON.stringify(err))
                    );

                })
                .finally(() => {
                    this.setState({
                        sending: false,
                    });

                    this.clear();
                })
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
                icon={<QuestionCircleOutlined/>}
                okText="Đồng ý"
                cancelText="Huỷ"
                onConfirm={() => this.handleSubmit()}
            >
                <Button
                    id="save"
                    className="btn-custom"
                    color="primary"
                    type="button"
                    disabled={this.state.sending}
                >
                    <SendOutlined
                        style={{display: 'inline', margin: '5px 10px 0 0'}}
                    />{' '}
                    {'  '}
                    <span className="btn-save-text"> GỬI</span>
                </Button>
            </Popconfirm>
        );
    };

    handleChangeIcon = (val) => {
        const {value} = this.state;

        this.setState({
            value: {
                ...value,
                iconId: val,
            },
        });
    };

    renderSubOption = () => {
        const {value} = this.state;
        const {
            canManageEmployees = [],
            canManageOffices = [],
        } = this.props.data;

        switch (value.receiverType) {
            case 2:
                return (
                    <Col md="6">
                        <FormGroup>
                            <label style={{visibility: 'hidden'}}>
                                Nhân viên
                            </label>
                            <Select
                                style={{width: '100%'}}
                                className="bor-radius"
                                onChange={(val) =>
                                    this.handleChangeOption('username', val)
                                }
                                value={value.username}
                                disabled={this.state.sending}
                            >
                                {_.map(canManageEmployees, (i) => {
                                    return (
                                        <Option
                                            className=" bor-radius"
                                            value={i.username}
                                            key={i.username}
                                        >
                                            {i.fullName} ({i.username})
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
                            <label style={{visibility: 'hidden'}}>
                                Chi nhánh
                            </label>
                            <Select
                                style={{width: '100%'}}
                                className="bor-radius"
                                onChange={(val) =>
                                    this.handleChangeOption('officeId', val)
                                }
                                value={value.officeId}
                                disabled={this.state.sending}
                            >
                                {_.map(canManageOffices, (i) => {
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
        const {value, sending, type} = this.state;
        const {data = {}} = this.props;

        return (
            <Form>
                <div
                    style={{position: 'absolute', left: '50%', top: '50%', display: sending ? 'inline-block' : 'none'}}>
                    <Spin size={"large"}/>
                </div>
                <div style={{opacity: sending ? '0.5' : '1'}}>
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
                                    disabled={sending}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <FormGroup>
                                <label>Nội dung</label>
                                <TextArea
                                    placeholder="Nhập nội dung thông báo..."
                                    name="content"
                                    className="form-control bor-radius text-dark"
                                    value={value.content}
                                    onChange={(e) =>
                                        this.handleOnChange(e)
                                    }
                                    rows={4}
                                    disabled={sending}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            <FormGroup>
                                <label>Icon</label>
                                <Select
                                    style={{width: '100%'}}
                                    className="bor-radius"
                                    onChange={(val) =>
                                        this.handleChangeIcon(val)
                                    }
                                    value={value.iconId}
                                    disabled={sending}
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
                                                        alt={icon.iconURL}
                                                        src={icon.iconURL}
                                                    />
                                                    {icon.screenDescription}
                                                </div>
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="pr-md-1" md={value.receiverType === 1 ? "12" : "6"}>
                            <FormGroup>
                                <label>Gửi đến</label>
                                <Select
                                    style={{width: '100%'}}
                                    className="bor-radius"
                                    onChange={(val) =>
                                        this.handleChangeOption(
                                            'receiverType',
                                            val
                                        )
                                    }
                                    value={value.receiverType}
                                    disabled={sending}
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
                </div>
                <CardFooter className="text-right info">
                    {this.renderButton()}
                </CardFooter>
            </Form>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

export default connect(mapStateToProps)(FormSendNotification);
