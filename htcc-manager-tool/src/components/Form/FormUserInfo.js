import React from 'react';
import {
  Button,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from 'reactstrap';

class FormUserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        companyId: '',
        username: '',
        employeeId: '',
        officeId: '',
        department: '',
        fullName: '',
        birthDate: '',
        email: '',
        identityCardNo: '',
        address: '',
        phoneNumber: '',
        avatar:
          'https://i.pinimg.com/originals/0d/36/e7/0d36e7a476b06333d9fe9960572b66b9.jpg'
      }
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.setState({
        value: { ...user }
      });
    }
  }

  handleOnChange = e => {
    const { value: valueInput, name } = e.target;
    let { value } = this.state;

    value[name] = valueInput;

    this.setState({
      value: { ...value }
    });
  };

  handleOnClick = e => {
    const { toggle } = this.props;
    toggle('modalProfile');
  };

  render() {
    const { value } = this.state;
    return (
      <Form>
        <Row>
          <Col md="3">
            <FormGroup>
              <label>Mã công ty</label>
              <Input
                value={value.companyId}
                readOnly
                placeholder="Công ty"
                type="text"
                className="bor-gray"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <label>Username</label>
              <Input
                value={value.username}
                readOnly
                placeholder="Username"
                type="text"
                className="bor-gray"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <label>Văn phòng</label>
              <Input
                value={value.officeId}
                readOnly
                placeholder="Văn phòng"
                type="text"
                className="bor-gray"
              />
            </FormGroup>
          </Col>
          <Col md="3">
            <FormGroup>
              <label>Phòng ban</label>
              <Input
                value={value.department}
                readOnly
                placeholder="Mã phòng ban"
                type="text"
                className="bor-gray"
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
                readOnly
                className="bor-gray"
              />
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
                readOnly
                className="bor-gray"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <FormGroup>
              <label>Số điện thoại</label>
              <Input
                placeholder="Nhập số điện thoại"
                type="text"
                onChange={this.handleOnChange}
                name="phone"
                value={value.phoneNumber}
                readOnly
                className="bor-gray"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <label>CMND</label>
              <Input
                placeholder="Chứng minh nhân dân"
                type="text"
                onChange={this.handleOnChange}
                name="phone"
                value={value.identityCardNo}
                readOnly
                className="bor-gray"
              />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup>
              <label>Ngày sinh</label>
              <Input
                placeholder="Ngày sinh"
                type="text"
                onChange={this.handleOnChange}
                name="phone"
                value={value.birthDate}
                readOnly
                className="bor-gray"
              />
            </FormGroup>
          </Col>
        </Row>
        {/* <CardFooter>
          <Button
            onClick={this.handleOnClick}
            id="cancel"
            className="btn-fill"
            color="primary"
            type="button"
          >
            Thoát
          </Button>
        </CardFooter> */}
      </Form>
    );
  }
}

export default FormUserInfo;
