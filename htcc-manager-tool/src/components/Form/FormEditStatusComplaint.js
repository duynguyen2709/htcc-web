import React from 'react';
import { Button, CardFooter, FormGroup, Form, Row, Col } from 'reactstrap';
import * as _ from 'lodash';
import { complaintApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { DatePicker, Select, Input, Popconfirm } from 'antd';
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
        yyyyMM: moment(new Date()).format('yyyyMM'),
      },
    };
  }

  handleChangeStatus = (value) => {
    this.setState({
      value: {
        ...this.state.value,
        status: value,
      },
    });
  };

  componentDidMount() {
    const { data, currDate } = this.props;
    this.setState({
      value: {
        complaintId: data.complaintId,
        response: data.response,
        status: 1,
        yyyyMM: currDate,
      },
    });
  }

  handleOnChange = (e) => {
    const { value: valueInput, name } = e.target;
    let { value } = this.state;

    value[name] = valueInput;

    this.setState({
      value: { ...value },
    });
  };

  handleSubmit = (e) => {
    this.props.onSubmit();

    // if (!_.isEmpty(this.state.value.response)) {
    //   complaintApi
    //     .updateStatus(this.state.value)
    //     .then((res) => {
    //       if (res.returnCode === 1) {
    //         this.setState({
    //           value: {
    //             ...this.state.value,
    //             response: null,
    //           },
    //         });
    //         this.props.onSubmit();
    //       } else {
    //         store.addNotification(createNotify('danger', res.returnMessage));
    //       }
    //     })
    //     .catch((err) => {
    //       store.addNotification(createNotify('danger', JSON.stringify(err)));
    //     });
    // } else {
    //   store.addNotification(
    //     createNotify('warning', 'Bạn chưa nhập thông tin phản hồi')
    //   );
    // }
  };

  handleChangeDate = (date) => {
    const { value } = this.state;
    if (!_.isEmpty(date)) {
      this.setState({
        value: {
          ...value,
          yyyyMM: moment(date, 'YYYYMM'),
        },
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
              <label>ID</label>
              <Input
                className="form-control bor-radius bor-gray text-dark"
                type="text"
                name="complaintId"
                disabled
                value={value.complaintId}
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <label>Tháng</label>
              <DatePicker
                className="form-control bor-radius"
                format={'MM-YYYY'}
                value={moment(value.yyyyMM, 'YYYYMM')}
                onChange={() => this.handleChangeDate()}
                disabled
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
                onChange={(val) => this.handleChangeStatus(val)}
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
                className="form-control bor-radius text-dark"
                value={value.response}
                onChange={(e) => this.handleOnChange(e)}
                rows={4}
              />
            </FormGroup>
          </Col>
        </Row>
        <CardFooter className="text-right info">
          <Popconfirm
            title="Bạn chắc chắn thay đổi？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            okText="Đồng ý"
            cancelText="Huỷ"
            onConfirm={() => this.handleSubmit()}
          >
            <Button
              id="save"
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
        </CardFooter>
      </Form>
    );
  }
}

export default FormEditStatusComplaint;
