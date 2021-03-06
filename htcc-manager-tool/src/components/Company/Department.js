import React from 'react';
import * as _ from 'lodash';
import {companyApi} from '../../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {PlusSquareOutlined} from '@ant-design/icons';
import {buildColsDepartment} from '../../constant/colTable';
import {Input, Table, Tooltip} from 'antd';
import AsyncModal from '../Modal/AsyncModal';
import {connect} from 'react-redux';
import FormNewDepartment from '../Form/FormNewDepartment';
import FormEditDepartment from '../Form/FormEditDepartment';
import {canDoAction} from "../../utils/permission";
import {ACTION, ROLE_GROUP_KEY} from "../../constant/constant";

const {Search} = Input;

class Department extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            showModal: false,
            mode: 'new',
            curRecordEdit: null,
            isSubmit: false,
            loading: false,
            headManagerList: [],
        };
        this.data = [];
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.state.data === null && this.state.loading === false) {
            this.getData();
        }
    }

    toggleLoading() {
        const {loading} = this.state;
        this.setState({
            loading: !loading,
        });
    }

    getData = () => {
        this.toggleLoading();

        companyApi
            .getAllDepartment()
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        data: res.data.departmentList,
                        headManagerList: res.data.headManagerList,
                    });
                    this.data = res.data.departmentList;
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
            })
            .finally(() => {
                this.toggleLoading();
            });
    };

    handleEdit = (record) => {
        this.setState({
            showModal: true,
            curRecordEdit: record,
            mode: 'edit',
        });
    };

    handleDelete = (record) => {
        this.toggleLoading();

        companyApi
            .deleteDepartment(record)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        data: res.data,
                    });

                    this.data = res.data;
                    store.addNotification(
                        createNotify('default', 'Xoá thành công !')
                    );
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
            })
            .finally(() => this.toggleLoading());
    };

    toggle = (submit = false) => {
        const {data} = this.state;
        this.setState({
            showModal: !this.state.showModal,
            curRecordEdit: null,
            data: submit ? null : data,
            isSubmit: submit,
        });
    };

    mapData = (data) => {
        return _.map(data, (item) => ({
            key: item.department.toString(),
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
        const {
            data,
            showModal,
            curRecordEdit,
            mode,
            loading,
            headManagerList,
        } = this.state;

        const canAdd = canDoAction(this.props.data, ROLE_GROUP_KEY.DEPARTMENT, ACTION.CREATE);
        const canUpdate = canDoAction(this.props.data, ROLE_GROUP_KEY.DEPARTMENT, ACTION.UPDATE);
        const canDelete = canDoAction(this.props.data, ROLE_GROUP_KEY.DEPARTMENT, ACTION.DELETE);

        return (
            <React.Fragment>
                <div className="header-table clearfix">
                    <div className="float-left">
                        <Search
                            className="form-control bor-radius"
                            placeholder="Tìm kiếm nhanh"
                            style={{width: 300}}
                            onChange={this.onSearch}
                        />
                    </div>
                    {canAdd ?
                        <div className="float-right btn-new">
                            <Tooltip placement="left" title={'Thêm phòng ban'}>
                                <PlusSquareOutlined
                                    onClick={() => {
                                        this.setState({
                                            mode: 'new'
                                        });
                                        this.toggle(false)
                                    }}
                                />
                            </Tooltip>
                        </div> : null}
                </div>
                <div className="table-edit">
                    <div className="table-small table-branch">
                        <Table
                            columns={buildColsDepartment(
                                this.handleEdit,
                                this.handleDelete,
                                canUpdate,
                                canDelete
                            )}
                            dataSource={this.mapData(data)}
                            scroll={{y: 'calc(100vh - 355px)'}}
                            loading={loading || data === null}
                            pagination={{
                                hideOnSinglePage: true,
                                pageSize: 6,
                            }}
                            bordered={true}
                        />
                    </div>
                </div>
                {((mode === 'new' && canAdd) || (mode === 'edit' && canUpdate)) ?
                    <div>
                        <AsyncModal
                            key={curRecordEdit}
                            reload={false}
                            CompomentContent={
                                mode === 'new'
                                    ? FormNewDepartment
                                    : FormEditDepartment
                            }
                            visible={showModal}
                            toggle={(submit) => this.toggle(submit)}
                            title={
                                mode === 'new'
                                    ? 'Thêm phòng ban mới'
                                    : 'Chỉnh sửa phòng ban'
                            }
                            data={{
                                ...curRecordEdit,
                                headManagerList: headManagerList,
                            }}
                            mode={mode}
                        />
                    </div> : null}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data
});

export default connect(mapStateToProps, null)(Department);
