import React from 'react';
import { Button, FormGroup, Input, Row, Col } from 'reactstrap';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { login } from '../../reducers/auth.reducer';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';

class FormLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        username: '',
        companyId: '',
        password: ''
      },
      invalid: {
        username: false,
        companyId: false,
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
    const { username, companyId, password } = this.state.value;
    this.props.toggleLoader();

    this.props
      .login(companyId, username, password)
      .then(res => {
        this.props.toggleLoader();
      })
      .catch(err => {
        store.addNotification(
          createNotify('danger', 'Phiên đăng nhập hết hạn. Mời đăng nhập lại !')
        );
        this.props.toggleLoader();
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
                  name="companyId"
                  value={value.companyId}
                  invalid={invalid.companyId}
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
                  name="username"
                  value={value.username}
                  invalid={invalid.username}
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
  login: (companyId, username, password) =>
    dispatch(login(companyId, username, password))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormLogin);
