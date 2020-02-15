import React from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from 'reactstrap';
import * as _ from 'lodash';
import { store } from 'react-notifications-component';
import { createNotify } from '../utils/notifier';

class UserProfile extends React.Component {
  checkValid = () => {
    return true;
  };

  handOnClick = e => {
    const { id } = e.target;
    const { handleShowProfile } = this.props;

    if (_.isEqual(id, 'cancel')) {
      handleShowProfile();
    } else {
      if (this.checkValid()) {
        store.addNotification(createNotify('success', 'Cập nhật thành công !'));
        handleShowProfile();
      } else {
        store.addNotification(
          createNotify('warning', 'Thông tin chưa hợp lệ !')
        );
      }
    }
  };

  render() {
    return (
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Thông tin cá nhân</h5>
              </CardHeader>
              <CardBody>
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
                          defaultValue="mail@gmail.com"
                          placeholder="...@email.com"
                          type="email"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <label>Họ và Tên</label>
                        <Input
                          defaultValue="Mike"
                          placeholder="Nhập họ và tên"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Địa chỉ</label>
                        <Input
                          defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                          placeholder="Nhập địa chỉ"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Số điện thoại</label>
                        <Input
                          defaultValue="0987654321"
                          placeholder="Nhập số điện thoại"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button
                  id="save"
                  onClick={this.handOnClick}
                  className="btn-fill"
                  color="primary"
                  type="submit"
                >
                  Lưu
                </Button>
                <Button
                  onClick={this.handOnClick}
                  id="cancel"
                  className="btn-fill"
                  color="primary"
                  type="submit"
                >
                  Thoát
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar"
                      src={require('../assets/img/avatar.png')}
                    />
                    <h5 className="title">Mike Andrew</h5>
                  </a>
                  <p className="description">Ceo/Co-Founder</p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UserProfile;
