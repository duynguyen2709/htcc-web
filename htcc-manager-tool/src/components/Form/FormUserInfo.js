import React from 'react';
import {
  Button,
  CardFooter,
  FormFeedback,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from 'reactstrap';
import * as _ from 'lodash';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import { checkValidEmail, checkValidPhoneNumber } from '../../utils/validate';

class FormUserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        email: '',
        phone: '',
        name: '',
        address: ''
      },
      messageInvalid: {
        email: 'Email không hợp lệ',
        name: 'Họ tên không được rỗng',
        address: 'Địa chỉ không được rỗng',
        phone: 'Số điện thoại không hợp lệ'
      }
    };
  }

  componentDidMount() {
    this.setState({
      value: {
        email: 'testemail@gmail.com',
        phone: '0987654321',
        name: 'test name',
        address: 'test address'
      }
    });
  }

  checkValidDataInput = () => {
    const { email, phone, name, address } = this.state.value;

    return (
      checkValidEmail(email) &&
      checkValidPhoneNumber(phone) &&
      !_.isEmpty(name) &&
      !_.isEmpty(address)
    );
  };

  handleOnChange = e => {
    const { value: valueInput, name } = e.target;
    let { value } = this.state;

    value[name] = valueInput;

    this.setState({
      value: { ...value }
    });
  };

  handleOnClick = e => {
    const { id } = e.target;
    const { toggle } = this.props;

    if (_.isEqual(id, 'cancel')) {
      toggle('modalProfile');
    } else {
      if (this.checkValidDataInput()) {
        store.addNotification(createNotify('success', 'Cập nhật thành công !'));
        toggle('modalProfile');
      } else {
        store.addNotification(
          createNotify('warning', 'Thông tin chưa hợp lệ !')
        );
      }
    }
  };

  render() {
    const { value, messageInvalid } = this.state;
    return (
      <Form>
        <Row>
          <Col className="pr-md-1" md="5">
            <FormGroup>
              <label>Công ty</label>
              <Input
                defaultValue="Creative Code Inc."
                disabled
                placeholder="Company"
                type="text"
              />
            </FormGroup>
          </Col>
          <Col md="7">
            <FormGroup>
              <label>Tên đăng nhập</label>
              <Input
                defaultValue="michael23"
                disabled
                placeholder="Username"
                type="text"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label htmlFor="email">Email</label>
              <Input
                placeholder="Nhập email"
                type="email"
                onChange={this.handleOnChange}
                name="email"
                value={value.email}
                invalid={!checkValidEmail(value.email)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.email}
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col md="12">
            <FormGroup>
              <label>Họ và Tên</label>
              <Input
                placeholder="Nhập họ và tên"
                type="text"
                onChange={this.handleOnChange}
                name="name"
                value={value.name}
                invalid={_.isEmpty(value.name)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.name}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Địa chỉ</label>
              <Input
                placeholder="Nhập địa chỉ"
                type="text"
                name="address"
                value={value.address}
                onChange={this.handleOnChange}
                invalid={_.isEmpty(value.address)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.address}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Số điện thoại</label>
              <Input
                placeholder="Nhập số điện thoại"
                type="text"
                onChange={this.handleOnChange}
                name="phone"
                value={value.phone}
                invalid={!checkValidPhoneNumber(value.phone)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.phone}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <CardFooter>
          <Button
            id="save"
            onClick={this.handleOnClick}
            className="btn-fill"
            color="primary"
            type="button"
          >
            Lưu
          </Button>
          <Button
            onClick={this.handleOnClick}
            id="cancel"
            className="btn-fill"
            color="primary"
            type="button"
          >
            Thoát
          </Button>
        </CardFooter>
      </Form>
    );
  }
}

export default FormUserInfo;
