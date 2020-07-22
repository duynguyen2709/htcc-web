import React from 'react';
import * as _ from 'lodash';
import {companyApi} from '../../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {PlusSquareOutlined} from '@ant-design/icons';
import {buildColsBranch} from '../../constant/colTable';
import {Input, Table, Tooltip} from 'antd';
import AsyncModal from '../Modal/AsyncModal';
import FormEditBranch from '../Form/FormEditBranch';
import FormNewBranch from '../Form/FormNewBranch';
import {connect} from 'react-redux';
import {canDoAction} from "../../utils/permission";
import {ACTION, ROLE_GROUP_KEY} from "../../constant/constant";

const {Search} = Input;

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
        companyApi
            .getAllOffices()
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        data: res.data,
                    });
                    this.data = res.data;
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

    handleEdit = (record) => {
        this.setState({
            showModal: true,
            curRecordEdit: record,
            mode: 'edit',
        });
    };

    handleDelete = (record) => {
        this.setState({
            loading: true,
        });

        companyApi
            .deleteBranch(record)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        data: res.data,
                        loading: false,
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
            });
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
        const {data, showModal, curRecordEdit, mode, loading} = this.state;
        const canAdd = canDoAction(this.props.data, ROLE_GROUP_KEY.OFFICE, ACTION.CREATE);
        const canUpdate = canDoAction(this.props.data, ROLE_GROUP_KEY.OFFICE, ACTION.UPDATE);
        const canDelete = canDoAction(this.props.data, ROLE_GROUP_KEY.OFFICE, ACTION.DELETE);
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
                            <Tooltip placement="left" title={'Thêm chi nhánh'}>
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
                            columns={buildColsBranch(
                                this.handleEdit,
                                this.handleDelete,
                                canUpdate,
                                canDelete
                            )}
                            dataSource={this.mapData(data)}
                            scroll={{x: 1300, y: 'calc(100vh - 355px)'}}
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
                                    ? FormNewBranch
                                    : FormEditBranch
                            }
                            visible={showModal}
                            toggle={(submit) => this.toggle(submit)}
                            title={
                                mode === 'new'
                                    ? 'Thêm chi nhánh mới'
                                    : 'Chỉnh sửa chi nhánh'
                            }
                            data={curRecordEdit}
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

export default connect(mapStateToProps, null)(Branch);
