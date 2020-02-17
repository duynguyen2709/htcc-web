import React from 'react';
import { Button, FormGroup, Input, Row, Col } from 'reactstrap';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { login } from '../../reducers/auth.reducer';

class FormLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        userCode: '',
        companyCode: '',
        password: ''
      },
      invalid: {
        userCode: false,
        companyCode: false,
        password: false
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
    const { value: valueInput, name } = e.target;
    const { value, invalid } = this.state;

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
    const { userCode, companyCode, password } = this.state.value;
    this.props.checkLogin();

    this.props
      .login(companyCode, userCode, password)
      .then(res => {
        this.props.checkLogin();
      })
      .catch(err => {
        alert(err);
      });
  };

  render() {
    const { invalid, value, loginImg } = this.state;
    return (
      <Row>
        <Col className="img-login" md={6}>
          <img alt="" src={require(`../../assets/img/${loginImg}`)} />
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
                  name="companyCode"
                  value={value.companyCode}
                  invalid={invalid.companyCode}
                  className="bor-gray text-dark"
                />
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <label className="text-dark">Mã nhân viên</label>
                <Input
                  placeholder="Nhập mã nhân viên"
                  type="text"
                  onChange={this.handleOnChange}
                  name="userCode"
                  value={value.userCode}
                  invalid={invalid.userCode}
                  className="bor-gray text-dark"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
                <label className="text-dark">Mật khẩu</label>
                <Input
                  placeholder="Nhập mật khẩu"
                  type="password"
                  name="password"
                  value={value.password}
                  onChange={this.handleOnChange}
                  invalid={invalid.password}
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
                Đăng nhập
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  login: (companyCode, userCode, password) =>
    dispatch(login(companyCode, userCode, password))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormLogin);
