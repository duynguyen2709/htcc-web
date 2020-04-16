import React from 'react';
import * as _ from 'lodash';
import { companyApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import { PlusSquareOutlined } from '@ant-design/icons';
import { buildColsBranch } from '../../constant/colTable';
import { Input, Tooltip, Table } from 'antd';
import AsyncModal from '../Modal/AsyncModal';
import FormEditBranch from '../Form/FormEditBranch';
import FormNewBranch from '../Form/FormNewBranch';

const { Search } = Input;

class Branch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      showModal: false,
      mode: 'new',
      curRecordEdit: null,
      isSubmit: false,
      loading: false
    };
    this.data = [];
  }

  componentDidMount() {
    companyApi
      .getAllOffices()
      .then(res => {
        if (res.returnCode === 1) {
          this.setState({
            data: res.data
          });
          this.data = res.data;
        } else {
          store.addNotification(createNotify('danger', res.returnMessage));
        }
      })
      .catch(err => {
        store.addNotification(createNotify('danger', JSON.stringify(err)));
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.state.data, prevState.data)) {
      companyApi
        .getAllOffices()
        .then(res => {
          if (res.returnCode === 1) {
            this.setState({
              data: res.data
            });
            this.data = res.data;
          } else {
            store.addNotification(createNotify('danger', res.returnMessage));
          }
        })
        .catch(err => {
          store.addNotification(createNotify('danger', JSON.stringify(err)));
        });
    }
  }

  handleEdit = record => {
    this.setState({
      showModal: true,
      curRecordEdit: record,
      mode: 'edit'
    });
  };

  handleDelete = record => {
    this.setState({
      loading: true
    });

    companyApi
      .deleteBranch(record)
      .then(res => {
        if (res.returnCode === 1) {
          this.setState({
            data: res.data,
            loading: false
          });

          this.data = res.data;
          store.addNotification(createNotify('default', 'Xoá thành công !'));
        } else {
          store.addNotification(createNotify('danger', res.returnMessage));
        }
      })
      .catch(err => {
        store.addNotification(createNotify('danger', JSON.stringify(err)));
      });
  };

  toggle = (submit = false) => {
    const { data } = this.state;
    this.setState({
      showModal: !this.state.showModal,
      curRecordEdit: null,
      data: submit ? null : data,
      isSubmit: submit
    });
  };

  mapData = data => {
    return _.map(data, item => ({
      key: item.officeId.toString(),
      ...item
    }));
  };

  onSearch = e => {
    const data = _.filter(this.data, ele =>
      JSON.stringify(ele).includes(e.target.value)
    );

    this.setState({
      data: data
    });
  };

  render() {
    const { data, showModal, curRecordEdit, mode, loading } = this.state;
    return (
      <React.Fragment>
        <div className="header-table clearfix">
          <div className="float-left">
            <Search
              className="form-control bor-radius"
              placeholder="Tìm kiếm nhanh"
              style={{ width: 300 }}
              onChange={this.onSearch}
            />
          </div>
          <div className="float-right btn-new">
            <Tooltip placement="left" title={'Thêm chi nhánh'}>
              <PlusSquareOutlined onClick={() => this.toggle(false)} />
            </Tooltip>
          </div>
        </div>
        <div className="table-edit">
          <div className="table-small table-branch">
            <Table
              columns={buildColsBranch(this.handleEdit, this.handleDelete)}
              dataSource={this.mapData(data)}
              scroll={{ x: 1300, y: 'calc(100vh - 355px)' }}
              loading={loading || data === null}
              pagination={{
                hideOnSinglePage: true,
                pageSize: 6
              }}
            />
          </div>
        </div>
        <div>
          <AsyncModal
            key={curRecordEdit}
            reload={false}
            CompomentContent={
              this.state.mode === 'new' ? FormNewBranch : FormEditBranch
            }
            visible={showModal}
            toggle={submit => this.toggle(submit)}
            title={
              mode === 'new' ? 'Thêm chi nhánh mới' : 'Chỉnh sửa chi nhánh'
            }
            data={curRecordEdit}
            mode={mode}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Branch;
