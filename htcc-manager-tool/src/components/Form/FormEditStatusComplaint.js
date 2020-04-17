import React from 'react';
import { Button, CardFooter, FormGroup, Form, Row, Col } from 'reactstrap';
import * as _ from 'lodash';
import { complaintApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import {
  CheckCircleOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { DatePicker, Select, Input, Popconfirm, Table } from 'antd';
import moment from 'moment';
import { columnsHistoryResponse } from '../../constant/colTable';

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
      onlyView: props.onlyView,
      response: [],
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
        response: null,
        status: 1,
        yyyyMM: currDate,
      },
      response: [
        'nội dung',
        'phan hoi ne',
        'nội dung tiếp nè',
        'phan hoi ne',
        'nội dung tiếp nè',
        'phan hoi ne',
        'nội dung tiếp nè',
        'phan hoi ne',
        'nội dung tiếp nè',
        'phan hoi ne',
        'nội dung tiếp nè',
      ], //data.response
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
    const { value, response } = this.state;
    if (!_.isEmpty(value.response)) {
      const data = _.cloneDeep(value);

      response.push(value.response);
      data.response = [...response];

      this.props.loading();
      complaintApi
        .updateStatus(data)
        .then((res) => {
          if (res.returnCode === 1) {
            this.props.onSubmit();
            this.clear();
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
      this.props.stopLoading();
      store.addNotification(
        createNotify('warning', 'Bạn chưa nhập thông tin phản hồi')
      );
    }
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

  clear = () => {
    this.setState({
      value: {
        ...this.state.value,
        response: null,
      },
    });
  };

  mapDataResponse = (data) => {
    const result = [];
    let k = -1;

    for (let i = 0; i < _.size(data); i += 1) {
      if (i % 2 === 0) {
        k++;
        result.push({});
        result[k].content = data[i];
      } else {
        result[k].response = data[i];
      }
    }

    return result;
  };

  render() {
    const { value, onlyView, response } = this.state;

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
        {_.size(response) > 2 && (
          <Row>
            <Col md="12">
              <FormGroup>
                <label>Lịch sử phản hồi</label>
                <Table
                  columns={columnsHistoryResponse}
                  dataSource={this.mapDataResponse(response)}
                  bordered
                  pagination={false}
                  scroll={{ y: 150 }}
                />
              </FormGroup>
            </Col>
          </Row>
        )}
        <Row style={{ display: onlyView ? 'none' : '' }}>
          <Col md="12">
            <FormGroup>
              <label>Trạng thái</label>
              <Select
                style={{ width: '100%' }}
                className="bor-radius"
                defaultValue={1}
                onChange={(val) => this.handleChangeStatus(val)}
                onCancel={() => this.clear()}
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
        <Row style={{ display: onlyView ? 'none' : '' }}>
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
          {onlyView ? (
            <Button
              className="btn-custom"
              color="primary"
              type="button"
              onClick={() => this.setState({ onlyView: false })}
            >
              <EditOutlined
                style={{ display: 'inline', margin: '5px 10px 0 0' }}
              />{' '}
              {'  '}
              <span className="btn-save-text">Thêm phản hồi</span>
            </Button>
          ) : (
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
          )}
        </CardFooter>
      </Form>
    );
  }
}

export default FormEditStatusComplaint;
