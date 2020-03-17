import React from 'react';
import { Card, CardHeader, CardBody, CardText, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import FormUserInfo from '../components/Form/FormUserInfo';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    const { user } = this.props;
    this.setState({
      user
    });
  }

  render() {
    const { toggle, user } = this.props;
    return (
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title text-dark">Thông tin cá nhân</h5>
              </CardHeader>
              <CardBody>
                <FormUserInfo toggle={toggle} user={user} />
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
                      src={user ? user.avatar : ''}
                    />
                    <h5 className="title text-dark">
                      {user ? user.fullName : ''}
                    </h5>
                  </a>
                  <p className="description text-dark">{user.employeeId}</p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authReducer.user
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
