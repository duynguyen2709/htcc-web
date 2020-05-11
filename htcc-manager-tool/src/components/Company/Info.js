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
import { Popconfirm } from 'antd';
import * as _ from 'lodash';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import { checkValidEmail, checkValidPhoneNumber } from '../../utils/validate';
import {
  CheckCircleOutlined,
  EditOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { companyApi } from '../../api';
import ReactLoading from "react-loading";

class CompayInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        email: '',
        phoneNumber: '',
        address: '',
        companyName: '',
        companyId: ''
      },
      messageInvalid: {
        email: 'Email không hợp lệ',
        address: 'Địa chỉ không được rỗng',
        phoneNumber: 'Số điện thoại không hợp lệ'
      },
      readOnly: true,
      isLoading: true
    };
  }

  componentDidMount() {
    companyApi
      .getInfoCompany()
      .then(res => {
        if (res.returnCode === 1) {
          this.setState({
            value: {
              email: res.data.email,
              phoneNumber: res.data.phoneNumber,
              address: res.data.address,
              companyName: res.data.companyName,
              companyId: res.data.companyId,
              status: res.data.status
            }
          });
        } else {
          store.addNotification(createNotify('danger', res.returnMessage));
        }
      })
      .catch(err => {
        store.addNotification(createNotify('danger', JSON.stringify(err)));
      }).finally(() => {
        this.setState({
          isLoading: false
        })
    })
  }

  checkValidDataInput = () => {
    const {
      email,
      phoneNumber,
      address,
      companyId,
      companyName
    } = this.state.value;

    return (
      checkValidEmail(email) &&
      checkValidPhoneNumber(phoneNumber) &&
      !_.isEmpty(companyId) &&
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
      companyApi
        .updateInfoCompany(this.state.value)
        .then(res => {
          if (res.returnCode === 1) {
            this.setState({
              readOnly: true
            });
            store.addNotification(
              createNotify('default', 'Cập nhật thành công !')
            );
          } else {
            store.addNotification(createNotify('danger', res.returnMessage));
          }
        })
        .catch(err => {
          store.addNotification(createNotify('danger', JSON.stringify(err)));
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
          <span className="btn-save-text"> Chỉnh sửa</span>
        </Button>
      );
    }

    return (
      <Popconfirm
        title="Bạn chắc chắn thay đổi？"
        icon={<QuestionCircleOutlined />}
        okText="Đồng ý"
        cancelText="Huỷ"
        onConfirm={() => this.handleSubmit()}
      >
        <Button
          id="save"
          // onClick={this.handleSubmit}
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
      </Popconfirm>
    );
  };

  render() {
    const { value, messageInvalid, readOnly, isLoading } = this.state;
    if (isLoading) {
      return <ReactLoading type={"spinningBubbles"}
                           color={"#4caf50"}
                           className={"center-div"}
                           height={'10%'}
                           width={'10%'}/>
    }

    return (
      <Form className="form-company-info">
        <Row>
          <Col md="5">
            <FormGroup>
              <label>ID</label>
              <Input
                placeholder="Id cty"
                type="text"
                className="bor-gray text-dark"
                name="companyId"
                value={value.companyId}
                readOnly={readOnly}
                disabled
              />
            </FormGroup>
          </Col>
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
                name="phoneNumber"
                value={value.phoneNumber}
                invalid={!checkValidPhoneNumber(value.phoneNumber)}
                readOnly={readOnly}
              />
              <FormFeedback invalid={'true'}>
                {messageInvalid.phoneNumber}
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
