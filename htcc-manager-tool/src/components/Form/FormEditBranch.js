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
import {
  checkValidEmail,
  checkValidPhoneNumber,
  checkValidNumber
} from '../../utils/validate';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Select, Popconfirm } from 'antd';
import { companyApi } from '../../api';

const { Option } = Select;

const INITFORM = {
  email: '',
  phoneNumber: '',
  address: '',
  forceUseWifi: false,
  isHeadquarter: false,
  latitude: null,
  longitude: null,
  maxAllowDistance: null,
  officeName: '',
  allowWifiIP: '',
  officeId: ''
};

class FormAddNewBranch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: { ...INITFORM },
      messageInvalid: {
        email: 'Email không hợp lệ',
        address: 'Địa chỉ không được rỗng',
        phoneNumber: 'Số điện thoại không hợp lệ',
        latitude: 'Vĩ độ là số thực',
        longitude: 'Kinh độ là số thực',
        maxAllowDistance: 'Khoảng cách là số lớn hơn 0',
        officeId: 'Mã chi nhánh không được rỗng',
        officeName: 'Mã chi nhánh không được rỗng'
      }
    };
  }

  componentDidMount() {
    this.setState({
      value: {
        ...this.props.data
      }
    });
  }

  checkValidDataInput = () => {
    const {
      email,
      phoneNumber,
      address,
      maxAllowDistance,
      latitude,
      longitude,
      officeName,
      officeId
    } = this.state.value;

    return (
      checkValidEmail(email) &&
      checkValidPhoneNumber(phoneNumber) &&
      checkValidNumber(maxAllowDistance) &&
      checkValidNumber(longitude) &&
      checkValidNumber(latitude) &&
      !_.isEmpty(address) &&
      !_.isEmpty(officeName) &&
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

  clear = () => {
    this.setState({
      value: { ...INITFORM }
    });
  };

  handleSubmit = e => {
    if (this.checkValidDataInput()) {
      const { value } = this.state;

      this.props.loading();
      companyApi
        .updateInfoBranch(value)
        .then(res => {
          if (res.returnCode === 1) {
            this.props.onSubmit(true);
            this.clear();
          } else {
            this.props.loading();
            store.addNotification(createNotify('danger', res.returnMessage));
          }
        })
        .catch(err => {
          this.props.loading();
          store.addNotification(createNotify('danger', JSON.stringify(err)));
        });
    } else {
      this.props.loading();
      store.addNotification(createNotify('warning', 'Thông tin chưa hợp lệ !'));
    }
  };

  handleChangeHeadquarter = value => {
    this.setState({
      value: {
        ...this.state.value,
        isHeadquarter: value
      }
    });
  };

  handleChangeforceUseWifi = value => {
    this.setState({
      value: {
        ...this.state.value,
        forceUseWifi: value
      }
    });
  };

  render() {
    const { value, messageInvalid } = this.state;

    return (
      <Form>
        <Row>
          <Col md="12">
            <FormGroup>
              <label htmlFor="email">Tên chi nhánh</label>
              <Input
                className="bor-gray text-dark"
                placeholder="Nhập tên chi nhánh"
                type="text"
                onChange={this.handleOnChange}
                name="officeName"
                value={value.officeName}
                invalid={_.isEmpty(value.officeName)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.username}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <FormGroup>
              <label>Mã chi nhánh</label>
              <Input
                placeholder="Nhập mã chi nhánh"
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
              <label>Số điện thoại</label>
              <Input
                placeholder="Nhập số điện thoại"
                type="text"
                className="bor-gray text-dark"
                onChange={this.handleOnChange}
                name="phoneNumber"
                value={value.phoneNumber}
                invalid={!checkValidPhoneNumber(value.phoneNumber)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.phoneNumber}
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
                placeholder="Nhập địa chỉ chi nhánh"
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
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Khoảng cách tối đa cho phép điểm danh (m)</label>
              <Input
                placeholder="Nhập số mét"
                type="number"
                className="bor-gray text-dark"
                onChange={this.handleOnChange}
                name="maxAllowDistance"
                value={value.maxAllowDistance}
                invalid={!checkValidNumber(value.maxAllowDistance)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.maxAllowDistance}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <FormGroup>
              <label>Kinh độ</label>
              <Input
                placeholder="Nhập kinh độ"
                type="number"
                className="bor-gray text-dark"
                onChange={this.handleOnChange}
                name="longitude"
                value={value.longitude}
                invalid={!checkValidNumber(value.longitude)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.longitude}
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <label>Vĩ độ</label>
              <Input
                placeholder="Nhập vĩ độ"
                type="number"
                className="bor-gray text-dark"
                onChange={this.handleOnChange}
                name="latitude"
                value={value.latitude}
                invalid={!checkValidNumber(value.latitude)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.latitude}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Loại chi nhánh</label>
              <Select
                style={{ width: '100%' }}
                className="bor-radius"
                defaultValue={false}
                onChange={val => this.handleChangeHeadquarter(val)}
                onCancel={() => this.clear()}
                value={value.isHeadquarter}
              >
                <Option className=" bor-radius" value={true}>
                  Trụ sở chính
                </Option>
                <Option className=" bor-radius" value={false}>
                  Không là trụ sở chính
                </Option>
              </Select>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Wifi</label>
              <Select
                style={{ width: '100%' }}
                className="bor-radius"
                defaultValue={false}
                onChange={val => this.handleChangeforceUseWifi(val)}
                onCancel={() => this.clear()}
                value={value.forceUseWifi}
              >
                <Option className=" bor-radius" value={true}>
                  Bắt buộc sử dụng wifi khi điểm danh
                </Option>
                <Option className=" bor-radius" value={false}>
                  Không bắt buộc sử dụng wifi khi điểm danh
                </Option>
              </Select>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Địa chỉ IP subnet cho phép điểm danh</label>
              <Input
                placeholder="Nhập địa chỉ IP"
                type="text"
                className="bor-gray text-dark"
                onChange={this.handleOnChange}
                name="allowWifiIP"
                value={value.allowWifiIP}
              />
            </FormGroup>
          </Col>
        </Row>
        <CardFooter className="text-right info">
          <Popconfirm
            title="Bạn chắc chắn thay đổi？"
            icon={<QuestionCircleOutlined />}
            okText="Đồng ý"
            cancelText="Huỷ"
            onConfirm={() => this.handleSubmit()}
          >
            <Button className="btn-custom" color="primary" type="button">
              <CheckCircleOutlined
                style={{ display: 'inline', margin: '5px 10px 0 0' }}
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

export default FormAddNewBranch;
