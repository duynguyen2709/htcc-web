import React from 'react';
import {
  Button,
  CardFooter,
  FormFeedback,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from 'reactstrap';
import * as _ from 'lodash';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import {
  checkValidEmail,
  checkValidPhoneNumber,
  checkValidNumber,
} from '../../utils/validate';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Select, Popconfirm } from 'antd';
import { companyApi } from '../../api';
import { USER } from '../../constant/localStorageKey';

const { Option } = Select;

const INITFORM = {
  email: '',
  phoneNumber: '',
  address: '',
  forceUseWifi: false,
  isHeadquarter: false,
  latitude: 0,
  longitude: 0,
  maxAllowDistance: 10,
  officeName: '',
  allowWifiIP: '',
  officeId: '',
};

const RESET_TOUCH = {
  email: false,
  phoneNumber: false,
  address: false,
  latitude: false,
  longitude: false,
  maxAllowDistance: false,
  officeName: false,
  officeId: false,
};

class FormNewBranch extends React.Component {
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
        officeName: 'Tên chi nhánh không được rỗng',
        officeId: 'Mã chi nhánh không được rỗng',
      },
      touch: {
        email: false,
        phoneNumber: false,
        address: false,
        latitude: false,
        longitude: false,
        maxAllowDistance: false,
        officeName: false,
        officeId: false,
      },
    };
  }

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem(USER));
    this.setState({
      value: {
        ...this.state.value,
        companyId: user.companyId,
        isHeadquarter: false,
        forceUseWifi: false,
      },
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
      officeId,
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
      value: { ...INITFORM },
      touch: { ...RESET_TOUCH },
    });
  };

  handleSubmit = (e) => {
    if (this.checkValidDataInput()) {
      const { value } = this.state;

      this.props.loading();
      companyApi
        .createBranch(value)
        .then((res) => {
          if (res.returnCode === 1) {
            this.clear();
            this.props.onSubmit(true);
          } else {
            this.props.stopLoading();
            store.addNotification(createNotify('danger', res.returnMessage));
          }
        })
        .catch((err) => {
          this.props.stopLoading();
          store.addNotification(createNotify('danger', JSON.stringify(err)));
        });
    } else {
      this.setState({
        touch: {
          email: true,
          phoneNumber: true,
          address: true,
          latitude: true,
          longitude: true,
          maxAllowDistance: true,
          officeName: true,
          officeId: true,
        },
      });
      store.addNotification(createNotify('warning', 'Thông tin chưa hợp lệ !'));
    }
  };

  handleChangeHeadquarter = (value) => {
    this.setState({
      value: {
        ...this.state.value,
        isHeadquarter: value,
      },
    });
  };

  handleChangeforceUseWifi = (value) => {
    this.setState({
      value: {
        ...this.state.value,
        forceUseWifi: value,
      },
    });
  };

  render() {
    const { value, messageInvalid, touch } = this.state;

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
                invalid={touch.officeName && _.isEmpty(value.officeName)}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.officeName}
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
                invalid={touch.officeId && _.isEmpty(value.officeId)}
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
                invalid={
                  touch.phoneNumber && !checkValidPhoneNumber(value.phoneNumber)
                }
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
                invalid={touch.email && !checkValidEmail(value.email)}
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
                invalid={touch.address && _.isEmpty(value.address)}
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
                invalid={touch.maxAllowDistance && value.maxAllowDistance <= 0}
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
                invalid={touch.longitude && !checkValidNumber(value.longitude)}
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
                invalid={touch.latitude && !checkValidNumber(value.latitude)}
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
                onChange={(val) => this.handleChangeHeadquarter(val)}
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
                onChange={(val) => this.handleChangeforceUseWifi(val)}
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

export default FormNewBranch;
