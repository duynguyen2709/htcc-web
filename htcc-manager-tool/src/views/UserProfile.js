import React from 'react';
import { Card, CardHeader, CardBody, CardText, Row, Col } from 'reactstrap';

import FormUserInfo from '../components/Form/FormUserInfo';

class UserProfile extends React.Component {
  render() {
    const { toggle } = this.props;
    return (
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title text-dark">Thông tin cá nhân</h5>
              </CardHeader>
              <CardBody>
                <FormUserInfo toggle={toggle} />
              </CardBody>
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
                    <h5 className="title text-dark">Mike Andrew</h5>
                  </a>
                  <p className="description text-dark">Ceo/Co-Founder</p>
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
