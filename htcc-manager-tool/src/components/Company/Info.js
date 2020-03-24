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
import { CheckCircleOutlined, EditOutlined } from '@ant-design/icons';

class CompayInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        email: '',
        phone: '',
        address: '',
        companyName: '',
        website: ''
      },
      messageInvalid: {
        email: 'Email không hợp lệ',
        address: 'Địa chỉ không được rỗng',
        phone: 'Số điện thoại không hợp lệ'
      },
      readOnly: true
    };
  }

  componentDidMount() {
    this.setState({
      value: {
        email: 'testemail@gmail.com',
        phone: '0987654321',
        address: 'test address',
        companyName: 'ABC CBA XXX YYY',
        website: 'http://abc.com.vn'
      }
    });
  }

  checkValidDataInput = () => {
    const { email, phone, address, website, companyName } = this.state.value;

    return (
      checkValidEmail(email) &&
      checkValidPhoneNumber(phone) &&
      !_.isEmpty(website) &&
      !_.isEmpty(address) &&
      !_.isEmpty(companyName)
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

  handleSubmit = e => {
    if (this.checkValidDataInput()) {
      store.addNotification(createNotify('default', 'Cập nhật thành công !'));
      this.setState({
        readOnly: true
      });
    } else {
      store.addNotification(createNotify('warning', 'Thông tin chưa hợp lệ !'));
    }
  };

  handleOnEdit = () => {
    this.setState({
      readOnly: false
    });
  };

  renderButton = () => {
    const { readOnly } = this.state;

    if (readOnly) {
      return (
        <Button
          id="save"
          onClick={this.handleOnEdit}
          className="btn-custom"
          color="primary"
          type="button"
        >
          <EditOutlined style={{ display: 'inline', margin: '5px 10px 0 0' }} />{' '}
          {'  '}
          <span className="btn-save-text"> Edit</span>
        </Button>
      );
    }

    return (
      <Button
        id="save"
        onClick={this.handleSubmit}
        className="btn-custom"
        color="primary"
        type="button"
      >
        <CheckCircleOutlined
          style={{ display: 'inline', margin: '5px 10px 0 0' }}
        />{' '}
        {'  '}
        <span className="btn-save-text"> LƯU</span>
      </Button>
    );
  };

  render() {
    const { value, messageInvalid, readOnly } = this.state;
    return (
      <Form className="form-company-info">
        <Row>
          <Col className="pr-md-1" md="7">
            <FormGroup>
              <label>Tên Công ty</label>
              <Input
                onChange={this.handleOnChange}
                value={value.companyName}
                placeholder="Nhập tên công ty"
                type="text"
                className="bor-gray text-dark"
                readOnly={readOnly}
                name="companyName"
              />
            </FormGroup>
          </Col>
          <Col md="5">
            <FormGroup>
              <label>Website</label>
              <Input
                onChange={this.handleOnChange}
                placeholder="Nhập website công ty"
                type="text"
                className="bor-gray text-dark"
                name="website"
                value={value.website}
                readOnly={readOnly}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label htmlFor="email">Email</label>
              <Input
                className="bor-gray text-dark"
                placeholder="Nhập email"
                type="email"
                onChange={this.handleOnChange}
                name="email"
                value={value.email}
                invalid={!checkValidEmail(value.email)}
                readOnly={readOnly}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.email}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Địa chỉ</label>
              <Input
                placeholder="Nhập địa chỉ trụ sở chính"
                type="text"
                className="bor-gray text-dark"
                name="address"
                value={value.address}
                onChange={this.handleOnChange}
                invalid={_.isEmpty(value.address)}
                readOnly={readOnly}
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
                className="bor-gray text-dark"
                onChange={this.handleOnChange}
                name="phone"
                value={value.phone}
                invalid={!checkValidPhoneNumber(value.phone)}
                readOnly={readOnly}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.phone}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <CardFooter className="text-right info">
          {this.renderButton()}
        </CardFooter>
      </Form>
    );
  }
}

export default CompayInfo;
