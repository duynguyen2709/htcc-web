import React, { Component } from 'react';
import { Tabs, Table, Input } from 'antd';
import { WarningOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { complaintApi } from '../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../utils/notifier';
import * as _ from 'lodash';
import { buildColsComplaint } from '../constant/colTable';
import moment from 'moment';
import CalendarTool from '../components/Tool/CalendarTool';
import FormEditStatusComplaint from '../components/Form/FormEditStatusComplaint';
import AsyncModal from '../components/Modal/AsyncModal';

const { Search } = Input;
const { TabPane } = Tabs;

class Complaint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataResolved: null,
      dataNotResolve: null,
      showFormEdit: false,
      curRecordEdit: null,
      currDate: moment(new Date()).format('YYYYMM'),
      isLoading: true,
    };
  }

  toggle = (isLoading = false) => {
    this.setState({
      showFormEdit: !this.state.showFormEdit,
      isLoading,
    });
  };

  handleEditStatus = (record) => {
    this.setState({
      showFormEdit: true,
      curRecordEdit: record,
    });
  };

  updateData = (value) => {
    if (!_.isEqual(value.format('YYYYMM'), this.state.currDate)) {
      this.setState(
        {
          dataNotResolve: null,
          dataResolved: null,
          currDate: value.format('YYYYMM'),
        },
        () => {
          this.getListComplaint(value.format('YYYYMM'));
        }
      );
    }
  };

  componentDidMount() {
    this.getListComplaint(this.state.currDate);
  }

  getListComplaint = (month) => {
    console.log('month', month);
    complaintApi
      .getList(month)
      .then((res) => {
        if (res.returnCode === 1) {
          this.setState({
            dataNotResolve: _.filter(res.data, (item) => item.status === 2),
            dataResolved: _.filter(res.data, (item) => item.status !== 2),
            isLoading: false,
          });
        } else {
          store.addNotification(createNotify('danger', res.returnMessage));
        }
      })
      .catch((err) => {
        store.addNotification(createNotify('danger', JSON.stringify(err)));
      });
  };

  onSearch = (e) => {
    let { data } = this.state;
    data = _.filter(this.data, (ele) => ele.code.includes(e.target.value));
    this.setState({
      data,
    });
  };

  mapData = (data) => {
    return _.map(data, (item) => ({
      key: item.complaintId.toString(),
      ...item,
    }));
  };

  render() {
    const {
      dataResolved,
      dataNotResolve,
      showFormEdit,
      curRecordEdit,
      currDate,
    } = this.state;

    return (
      <div className="content">
        <div className="table-wrapper tabs-small">
          <div className="header-table clearfix">
            <div className="float-left">
              <Search
                className="form-control bor-radius"
                placeholder="Tìm kiếm"
                style={{ width: 300 }}
                onChange={this.onSearch}
              />
            </div>
            <div className="tool-calendar float-right">
              <CalendarTool update={this.updateData} />
            </div>
          </div>
          <Tabs key={this.state.isLoading} defaultActiveKey="yet">
            <TabPane
              tab={
                <span>
                  <WarningOutlined />
                  Chưa xử lý
                </span>
              }
              key="yet"
            >
              <div className="table-edit">
                <div className="table-small">
                  <Table
                    pagination={{ pageSize: 6 }}
                    columns={buildColsComplaint(this.handleEditStatus)}
                    dataSource={dataNotResolve}
                    scroll={{ x: 1300 }}
                    loading={dataResolved === null}
                  />
                </div>
              </div>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <CheckSquareOutlined />
                  Đã sử lý
                </span>
              }
              key="already"
            >
              <div className="table-edit">
                <div className="table-small">
                  <Table
                    pagination={{ pageSize: 6 }}
                    columns={buildColsComplaint(this.handleEditStatus)}
                    dataSource={dataResolved}
                    scroll={{ x: 1300 }}
                    loading={dataResolved === null}
                  />
                </div>
              </div>
            </TabPane>
          </Tabs>
          <div>
            <AsyncModal
              CompomentContent={FormEditStatusComplaint}
              visible={showFormEdit}
              toggle={this.toggle}
              title={'Cập nhật trạng thái khiếu nại'}
              data={curRecordEdit}
              mode={'edit'}
              currDate={currDate}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Complaint;
