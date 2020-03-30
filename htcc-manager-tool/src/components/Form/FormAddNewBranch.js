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
import { CheckCircleOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';

class FormAddNewBranch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        email: '',
        phone: '',
        address: '',
        identityCardNo: '',
        username: '',
        birthDate: moment(new Date(), dateFormat),
        department: '',
        officeId: ''
      },
      messageInvalid: {
        email: 'Email không hợp lệ',
        address: 'Địa chỉ không được rỗng',
        phone: 'Số điện thoại không hợp lệ',
        identityCardNo: 'CMND không hợp lệ',
        username: 'Username không được rỗng',
        officeId: 'Văn phòng không được rỗng',
        department: 'Phòng ban không được rỗng'
      }
    };
  }

  componentDidMount() {
    const { value } = this.state;
    this.setState({
      value: {
        ...value,
        email: 'testemail@gmail.com',
        phone: '0987654321',
        address: 'test address',
        identityCardNo: '234567890',
        username: 'test123',
        department: 'ABC',
        officeId: 'ASDFFF'
      }
    });
  }

  checkValidDataInput = () => {
    const {
      email,
      phone,
      address,
      username,
      identityCardNo,
      officeId,
      department
    } = this.state.value;

    return (
      checkValidEmail(email) &&
      checkValidPhoneNumber(phone) &&
      !_.isEmpty(username) &&
      !_.isEmpty(address) &&
      !_.isEmpty(identityCardNo) &&
      !_.isEmpty(department) &&
      !_.isEmpty(officeId)
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

  handleChangeBithDate = date => {
    const { value } = this.state;
    if (!_.isEmpty(date)) {
      this.setState({
        value: {
          ...value,
          birthDate: moment(date, dateFormat)
        }
      });
    }
  };

  handleSubmit = e => {
    if (this.checkValidDataInput()) {
      this.props.onSubmit();
    } else {
      store.addNotification(createNotify('warning', 'Thông tin chưa hợp lệ !'));
    }
  };

  render() {
    const { value, messageInvalid } = this.state;

    return (
      <Form>
        <Row>
          <Col md="6">
            <FormGroup>
              <label htmlFor="email">Username</label>
              <Input
                className="bor-gray text-dark"
                placeholder="Nhập username"
                type="text"
                onChange={this.handleOnChange}
                name="username"
                value={value.username}
                invalid={_.isEmpty(value.username)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.username}
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <label>Ngày sinh</label>
              <DatePicker
                className="form-control bor-radius"
                format={dateFormat}
                value={moment(value.birthDate, dateFormat)}
                onChange={this.handleChangeBithDate}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <FormGroup>
              <label>CMND</label>
              <Input
                placeholder="Nhập CMND"
                type="text"
                className="bor-gray text-dark"
                onChange={this.handleOnChange}
                name="identityCardNo"
                value={value.identityCardNo}
                invalid={_.isEmpty(value.identityCardNo)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.identityCardNo}
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
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
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.phone}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <FormGroup>
              <label> Văn phòng</label>
              <Input
                placeholder="Nhập văn phòng"
                type="text"
                className="bor-gray text-dark"
                onChange={this.handleOnChange}
                name="officeId"
                value={value.officeId}
                invalid={_.isEmpty(value.officeId)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.officeId}
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <label>Phòng ban</label>
              <Input
                placeholder="Nhập phòng ban"
                type="text"
                className="bor-gray text-dark"
                onChange={this.handleOnChange}
                name="department"
                value={value.department}
                invalid={_.isEmpty(value.department)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.department}
              </FormFeedback>
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
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.address}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <CardFooter className="text-right info">
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
        </CardFooter>
      </Form>
    );
  }
}

export default FormAddNewBranch;
