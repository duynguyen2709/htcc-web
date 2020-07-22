import React from 'react';
import * as _ from 'lodash';
import { userApi } from '../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../utils/notifier';
import { PlusSquareOutlined } from '@ant-design/icons';
import { buildColsEmployee } from '../constant/colTable';
import { Input, Table, Tooltip } from 'antd';
import AsyncModal from '../components/Modal/AsyncModal';
import FormEditEmployee from '../components/Form/FormEditEmployee';
import FormAddNewEmployee from '../components/Form/FormAddNewEmployee';
import { USER } from '../constant/localStorageKey';

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
            loading: false,
        };
        this.data = [];
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.data === null && this.state.loading === false) {
            this.getData();
        }
    }

    getData = () => {
        userApi
            .getAllUsers()
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        data: res.data,
                    });
                    this.data = res.data;
                } else {
                    this.setState({
                        loading: false,
                    });

                    debugger;
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                store.addNotification(
                    createNotify('danger', JSON.stringify(err))
                );
            });
    };

    handleEdit = (record) => {
        this.setState({
            showModal: true,
            curRecordEdit: record,
            mode: 'edit',
        });
    };

    handleUpdateStatus = (oldStatus) => {
        this.setState({
            loading: true,
        });

        const newStatus = oldStatus === 1 ? 0 : 1;

        userApi
            .updateStatusAccount(newStatus)
            .then((res) => {
                if (res.returnCode === 1) {
                    store.addNotification(
                        createNotify(
                            'default',
                            'Cập nhật trạng thái thành công !'
                        )
                    );

                    this.getData();
                } else {
                    store.addNotification(
                        createNotify('danger', res.returnMessage)
                    );
                }
            })
            .catch((err) => {
                store.addNotification(
                    createNotify('danger', JSON.stringify(err))
                );
            });
    };

    toggle = (submit = false) => {
        const { data } = this.state;
        this.setState({
            showModal: !this.state.showModal,
            curRecordEdit: null,
            data: submit ? null : data,
            isSubmit: submit,
        });
    };

    mapData = (data) => {
        return _.map(data, (item) => ({
            key: item.officeId.toString(),
            ...item,
        }));
    };

    onSearch = (e) => {
        const data = _.filter(this.data, (ele) =>
            JSON.stringify(ele)
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
        );

        this.setState({
            data: data,
        });
    };

    render() {
        const { data, showModal, curRecordEdit, mode, loading } = this.state;
        const user = JSON.parse(localStorage.getItem(USER));
        return (
            <div className="content">
                <div className="table-wrapper tabs-big">
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
                            <Tooltip placement="left" title={'Thêm nhân viên'}>
                                <PlusSquareOutlined
                                    onClick={() => {
                                        this.setState({
                                            mode: 'new',
                                        });
                                        this.toggle(false);
                                    }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                    <div className="table-edit">
                        <div className="table-small">
                            <Table
                                columns={buildColsEmployee(
                                    this.handleEdit,
                                    this.handleUpdateStatus,
                                    user.username
                                )}
                                dataSource={this.mapData(data)}
                                scroll={{ x: 1300, y: 'calc(100vh - 300px)' }}
                                loading={loading || data === null}
                                pagination={{
                                    hideOnSinglePage: true,
                                    pageSize: 5,
                                }}
                                bordered={true}
                            />
                        </div>
                    </div>
                    <div>
                        <AsyncModal
                            key={curRecordEdit}
                            reload={false}
                            CompomentContent={
                                mode === 'new'
                                    ? FormAddNewEmployee
                                    : FormEditEmployee
                            }
                            visible={showModal}
                            toggle={(submit) => this.toggle(submit)}
                            title={
                                mode === 'new'
                                    ? 'Thêm nhân viên mới'
                                    : 'Cập nhật thông tin nhân viên'
                            }
                            data={curRecordEdit}
                            mode={mode}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Branch;
