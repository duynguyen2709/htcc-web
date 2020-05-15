import React, {Component} from 'react';
import {Col, Input, Popconfirm, Row, Table, Tooltip} from 'antd';
import {PlusSquareOutlined, QuestionCircleOutlined, SettingOutlined,} from '@ant-design/icons';
import {workScheduleApi} from '../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../utils/notifier';
import * as _ from 'lodash';
import {buildColsShift} from '../constant/colTable';
import SelectBox from '../components/Tool/SelectBox';
import FormNewShiftTime from '../components/Form/FormNewShiftTime';
import FormEditShiftTime from '../components/Form/FormEditShiftTime';
import AsyncModal from '../components/Modal/AsyncModal';
import {connect} from 'react-redux';
import {Button, CardFooter} from 'reactstrap';

const {Search} = Input;

class ShiftTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFormEdit: false,
            curRecordEdit: null,
            officeId: null,
            isLoading: true,
            dataTable: null,
            mode: 'new',
            showModal: false,
        };
        this.dataTable = [];
    }

    toggle = (submit = false) => {
        const {dataTable, officeId} = this.state;
        this.setState({
            showModal: !this.state.showModal,
            curRecordEdit: null,
            dataTable: submit ? null : dataTable,
        });

        if (submit) {
            this.getListShiftTime(officeId);
        }
    };

    handleEditShiftTime = (record) => {
        this.setState({
            showModal: true,
            curRecordEdit: record,
            mode: 'edit',
        });
    };

    componentDidMount() {
        const officeIds = _.get(this.props.data, 'canManageOffices', []);
        const officeId = officeIds[0];

        if (officeId) {
            this.setState({
                officeId,
            });
            this.getListShiftTime(officeId);
        }
    }

    getListShiftTime = (officeId) => {
        if (!officeId || officeId === '') {
            return;
        }

        this.setState({
            dataTable: null,
        });
        this.dataTable = [];

        workScheduleApi
            .getListShiftTime(officeId)
            .then((res) => {
                if (res.returnCode === 1) {
                    console.log(res.data);
                    this.setState({
                        dataTable: res.data,
                    });
                    this.dataTable = res.data;
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

    componentWillReceiveProps(nextProps, nextContext) {
        if (
            !_.isEmpty(nextProps.data) &&
            !_.isEqual(nextProps.data, this.props.data)
        ) {
            const officeId = _.first(
                _.get(nextProps.data, 'canManageOffices', [])
            );
            this.setState({
                officeId,
            });

            this.getListShiftTime(officeId);
        }
    }

    submitConfigLikeHeadquarter = () => {
        const {officeId} = this.state;

        if (!officeId || officeId === '') {
            return;
        }

        this.setState({
            dataTable: [],
        });
        this.dataTable = [];

        workScheduleApi
            .configLikeHeadquarter(officeId)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.getListShiftTime(officeId);

                    store.addNotification(
                        createNotify('default', 'Thiết lập thành công')
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

    onSearch = (e) => {
        const data = _.filter(this.dataTable, (ele) =>
            JSON.stringify(ele).includes(e.target.value)
        );

        this.setState({
            dataTable: data,
        });
    };

    mapData = (data) => {
        return _.map(data, (item) => ({
            key: item.shiftId.toString(),
            ...item,
        }));
    };

    getOfficeId = (id) => {
        if (!id) {
            return;
        }

        const {officeId} = this.state;

        if (_.isEqual(officeId, id)) {
            return;
        }

        this.setState({
            officeId: id,
            dataTable: null,
        });
        this.dataTable = null;

        this.getListShiftTime(id);
    };

    handleDeleteShiftTime = (record) => {
        const {officeId} = this.state;

        if (!officeId || officeId === '') {
            return;
        }

        this.setState({
            dataTable: [],
        });
        this.dataTable = [];

        workScheduleApi
            .deleteShiftTime(officeId, record.shiftId)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.getListShiftTime(officeId);

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

    render() {
        const {
            dataTable,
            curRecordEdit,
            showModal,
            mode,
            officeId,
        } = this.state;

        const {data = {}} = this.props;

        return (
            <div className="content">
                <div className="table-wrapper tabs-small">
                    <div className="header-table clearfix">
                        <Row justify="space-between">
                            <Col span={8}>
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <Search
                                        className="form-control bor-radius"
                                        placeholder="Tìm kiếm nhanh"
                                        style={{width: '300', marginRight: '20px'}}
                                        onChange={this.onSearch}
                                    />
                                    <SelectBox
                                        key={data.canManageOffices}
                                        options={data.canManageOffices}
                                        returnValue={this.getOfficeId}
                                    />
                                </div>
                            </Col>
                            <Col>
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <CardFooter className="text-right info">
                                        <Popconfirm
                                            title="Bạn chắc chắn về thiết lập này ？"
                                            icon={<QuestionCircleOutlined/>}
                                            okText="Đồng ý"
                                            cancelText="Huỷ"
                                            onConfirm={this.submitConfigLikeHeadquarter}
                                        >
                                            <Button
                                                className="btn-custom"
                                                color="primary"
                                                type="button"
                                            >
                                                <SettingOutlined
                                                    style={{
                                                        display: 'inline',
                                                        margin: '5px 10px 0 0',
                                                    }}
                                                />
                                                <span className="btn-save-text">
                                                    Thiết lập giống trụ sở chính
                                                </span>
                                            </Button>
                                        </Popconfirm>
                                    </CardFooter>
                                    <div className="btn-new"
                                         style={{margin: 'auto', marginLeft: '30px', marginRight: '20px'}}>
                                        <Tooltip placement="bottomLeft" title={'Thêm ca'}>
                                            <PlusSquareOutlined
                                                onClick={() => this.toggle(false)}
                                            />
                                        </Tooltip>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="table-edit">
                        <Table
                            columns={buildColsShift(
                                this.handleEditShiftTime,
                                this.handleDeleteShiftTime
                            )}
                            dataSource={this.mapData(dataTable)}
                            scroll={{
                                y: 'calc(100vh - 355px)',
                            }}
                            loading={dataTable === null}
                            pagination={false}
                        />
                    </div>
                    <div>
                        <AsyncModal
                            key={curRecordEdit}
                            reload={false}
                            CompomentContent={
                                this.state.mode === 'new'
                                    ? FormNewShiftTime
                                    : FormEditShiftTime
                            }
                            visible={showModal}
                            toggle={(submit) => this.toggle(submit)}
                            title={
                                mode === 'new' ? 'Thêm ca mới' : 'Chỉnh sửa ca'
                            }
                            data={curRecordEdit}
                            mode={mode}
                            prop={{officeId: officeId}}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.homeReducer.data,
});

export default connect(mapStateToProps)(ShiftTime);
