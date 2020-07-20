import React from 'react';
import {Button, Col, FormGroup, Input, Row} from 'reactstrap';
import * as _ from 'lodash';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {paymentApi} from '../../api';

class FormPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                companyId: '',
            },
            invalid: {
                companyId: false,
            },
            loginImg: 'login-bg-1.png',
            isLoading: false
        };
    }

    componentDidMount() {
        const number = _.random(1, 3);

        this.setState({
            loginImg: `login-bg-${number}.png`
        });
    }

    handleOnChange = e => {
        const {value: valueInput, name} = e.target;
        const {value, invalid} = this.state;

        this.setState({
            value: {
                ...value,
                [name]: valueInput
            },
            invalid: {
                ...invalid,
                [name]: _.isEmpty(valueInput)
            }
        });
    };

    handleSubmit = () => {
        const {companyId} = this.state.value;
        this.props.toggleLoader();

        paymentApi
            .payOrder(companyId)
            .then((res) => {
                store.addNotification(
                    createNotify('info', res.returnMessage)
                );
            })
            .catch((err) => {
                console.error(err);
                store.addNotification(
                    createNotify('danger', 'Hệ thống có lỗi. Vui lòng thử lại sau.')
                );
            })
            .finally(() => {
                this.props.toggleLoader();
            })
    };

    render() {
        const {invalid, value, loginImg} = this.state;
        return (
            <Row>
                <Col className="img-login" md={6}>
                    <img alt="login-img" src={require(`../../assets/img/${loginImg}`)}
                         style={{width: '90%', height: '110%'}}
                    />
                </Col>
                <Col md={6}>
                    <h3 className="title-login">Xin chào !</h3>
                    <Row>
                        <Col md="12">
                            <FormGroup>
                                <label className="text-dark">Mã công ty</label>
                                <Input
                                    placeholder="Nhập mã công ty"
                                    type="text"
                                    onChange={this.handleOnChange}
                                    name="companyId"
                                    value={value.companyId}
                                    invalid={invalid.companyId}
                                    className="bor-gray text-dark"
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center" md="12">
                            <Button
                                onClick={this.handleSubmit}
                                id="cancel"
                                className="btn-fill btn-login"
                                color="info"
                                type="button"
                            >
                                Thanh toán
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

export default FormPayment;
