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
      data: [],
      showModal: false,
      mode: 'new',
      curRecordEdit: null,
      isSubmit: false
    };
  }

  componentDidMount() {
    companyApi
      .getAllOffices()
      .then(res => {
        if (res.returnCode === 1) {
          this.setState({
            data: res.data
          });
        } else {
          store.addNotification(createNotify('danger', res.returnMessage));
        }
      })
      .catch(err => {
        store.addNotification(createNotify('danger', JSON.stringify(err)));
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      // !_.isEqual(this.state.showModal, prevState.showModal) ||
      !_.isEqual(this.state.isSubmit, prevState.isSubmit)
    ) {
      this.setState(
        {
          data: null
        },
        () => {
          companyApi
            .getAllOffices()
            .then(res => {
              if (res.returnCode === 1) {
                this.setState({
                  data: res.data
                });
              } else {
                store.addNotification(
                  createNotify('danger', res.returnMessage)
                );
              }
            })
            .catch(err => {
              store.addNotification(
                createNotify('danger', JSON.stringify(err))
              );
            });
        }
      );
    }
  }

  toggleNew = (submit = false) => {
    this.setState({
      showModal: !this.state.showModal,
      curRecordEdit: null,
      mode: 'new',
      isSubmit: submit
    });
  };

  toggleEdit = (record, submit = false) => {
    this.setState({
      showModal: !this.state.showModal,
      curRecordEdit: _.isEmpty(this.state.curRecordEdit) ? record : null,
      mode: 'edit',
      isSubmit: submit
    });
  };

  mapData = data => {
    return _.map(data, item => ({
      key: item.officeId.toString(),
      ...item
    }));
  };

  render() {
    const { data, showModal, curRecordEdit, mode } = this.state;
    return (
      <React.Fragment>
        <div className="header-table clearfix">
          <div className="float-left">
            <Search
              className="form-control bor-radius"
              placeholder="Tìm mã chi nhánh"
              style={{ width: 300 }}
              onChange={this.onSearch}
            />
          </div>
          <div className="float-right btn-new">
            <Tooltip placement="left" title={'Thêm chi nhánh'}>
              <PlusSquareOutlined onClick={this.toggleNew} />
            </Tooltip>
          </div>
        </div>
        <div className="table-edit">
          <div className="table-small table-branch">
            <Table
              pagination={{ pageSize: 6 }}
              columns={buildColsBranch(this.toggleEdit)}
              dataSource={this.mapData(data)}
              scroll={{ x: 1300, y: 'calc(100vh - 355px)' }}
              loading={data === null}
            />
          </div>
        </div>
        <div>
          <AsyncModal
            reload={false}
            CompomentContent={
              this.state.mode === 'new' ? FormNewBranch : FormEditBranch
            }
            visible={showModal}
            toggle={
              this.state.mode === 'new'
                ? submit => this.toggleNew(submit)
                : submit => this.toggleEdit(curRecordEdit, submit)
            }
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
