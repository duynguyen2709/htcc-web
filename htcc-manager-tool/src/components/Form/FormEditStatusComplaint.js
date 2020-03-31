import React from 'react';
import { Button, CardFooter, FormGroup, Form, Row, Col } from 'reactstrap';
import * as _ from 'lodash';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import { CheckCircleOutlined } from '@ant-design/icons';
import { DatePicker, Select, Input } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

class FormEditStatusComplaint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        complaintId: null,
        response: null,
        status: 1,
        yyyyMM: moment(new Date()).format('yyyyMM')
      }
    };
  }

  handleChangeStatus(value) {
    console.log(`selected ${value}`);
  }

  componentDidMount() {
    const { data } = this.props;
    this.setState({
      value: {
        complaintId: data.complaintId,
        response: data.response,
        status: 1,
        yyyyMM: moment(new Date()).format('yyyyMM')
      }
    });
  }

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
      this.props.onSubmit();
    } else {
      store.addNotification(createNotify('warning', 'Thông tin chưa hợp lệ !'));
    }
  };

  handleChangeDate = date => {
    const { value } = this.state;
    if (!_.isEmpty(date)) {
      this.setState({
        value: {
          ...value,
          yyyyMM: moment(date, 'yyyyMM')
        }
      });
    }
  };

  render() {
    const { value } = this.state;

    return (
      <Form>
        <Row>
          <Col md="6">
            <FormGroup>
              <label htmlFor="email">ID</label>
              <Input
                className="form-control bor-radius bor-gray text-dark"
                placeholder="Nhập username"
                type="text"
                name="complaintId"
                disabled
                defaultValue={value.complaintId}
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <label>Ngày thay đổi</label>
              <DatePicker
                className="form-control bor-radius"
                format={'yyyyMM'}
                value={moment(value.yyyyMM, 'yyyyMM')}
                onChange={this.handleChangeDate}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Trạng thái</label>
              <Select
                style={{ width: '100%' }}
                className="bor-radius"
                defaultValue={1}
                onChange={this.handleChangeStatus}
              >
                <Option className=" bor-radius" value={1}>
                  Đã xử lý
                </Option>
                <Option className=" bor-radius" value={0}>
                  Từ chối
                </Option>
              </Select>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Nội dung phản hồi</label>
              <TextArea
                name="response"
                className="form-control bor-radius"
                value={value.response}
                onChange={this.handleOnChange}
                rows={4}
              />
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

export default FormEditStatusComplaint;
