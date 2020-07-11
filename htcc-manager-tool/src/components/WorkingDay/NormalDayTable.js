import React from 'react';
import * as _ from 'lodash';
import {workScheduleApi} from '../../api';
import {store} from 'react-notifications-component';
import {createNotify} from '../../utils/notifier';
import {buildColsConfigDay} from '../../constant/colTable';
import {Table, Tag} from 'antd';
import AsyncModal from '../Modal/AsyncModal';
import FormEditNormalDay from '../Form/FormEditWorkingDay';

const WEEK_DAY = [
    '',
    'Chủ nhật',
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
];

class NormalDayTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            curRecordEdit: null,
            isSubmit: false,
            loading: false,
            data: props.data || null,
            officeId: props.officeId || '',
        };
    }

    handleEdit = (record) => {
        this.setState({
            showModal: true,
            curRecordEdit: record,
        });
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (!_.isEqual(nextProps.data, this.props.data)) {
            this.setState({
                data: nextProps.data,
            });
        }
    }

    handleDelete = (record) => {
        this.setState({
            loading: true,
        });

        workScheduleApi
            .deleteWorkingDay(record.id)
            .then((res) => {
                if (res.returnCode === 1) {
                    this.setState({
                        data: res.data,
                        loading: false,
                    });

                    this.props.reloadData();
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
        });

        if (submit) {
            this.props.reloadData();
        }
    };

    mapData = (data) => {
        return _.map(data, (item) => ({
            key: item.id.toString(),
            ...item,
        }));
    };

    render() {
        const {
            data,
            showModal,
            curRecordEdit,
            loading,
            officeId,
        } = this.state;

        const {canUpdate, canDelete} = this.props.canAction;
        return (
            <>
                <div className="table-edit">
                    <div className="table-small table-branch">
                        <Table
                            columns={buildColsConfigDay(
                                this.handleEdit,
                                this.handleDelete,
                                canUpdate,
                                canDelete,
                                [
                                    {
                                        title: 'Thứ',
                                        dataIndex: 'weekDay',
                                        width: '150px',
                                        render: (o, record) => {
                                            return WEEK_DAY[record.weekDay];
                                        },
                                        sorter: (a, b) => a.weekDay - b.weekDay
                                    },
                                    {
                                        title: 'Buổi làm',
                                        dataIndex: 'session',
                                        width: '150px',
                                        sorter: (a, b) => a.session - b.session,
                                        render: (o, record) => {
                                            switch (record.session) {
                                                case 0:
                                                    return (
                                                        <Tag
                                                            className="float-left"
                                                            color="blue"
                                                        >
                                                            Cả ngày
                                                        </Tag>
                                                    );
                                                case 1:
                                                    return (
                                                        <Tag
                                                            className="float-left"
                                                            color="green"
                                                        >
                                                            Sáng
                                                        </Tag>
                                                    );
                                                case 2:
                                                    return (
                                                        <Tag
                                                            className="float-left"
                                                            color="volcano"
                                                        >
                                                            Chiều
                                                        </Tag>
                                                    );
                                                default:
                                                    return null;
                                            }
                                        },
                                    },
                                ]
                            )}
                            dataSource={this.mapData(data)}
                            scroll={{y: 'calc(100vh - 385px)'}}
                            loading={loading || data === null}
                            pagination={false}
                            bordered={true}
                        />
                    </div>
                </div>
                {canUpdate ?
                    <div>
                        <AsyncModal
                            key={curRecordEdit}
                            reload={false}
                            CompomentContent={FormEditNormalDay}
                            visible={showModal}
                            toggle={(submit) => this.toggle(submit)}
                            title={'Chỉnh sửa ngày làm việc'}
                            data={curRecordEdit}
                            mode={'edit'}
                            prop={{officeId: officeId}}
                        />
                    </div> : null}
            </>
        );
    }
}

export default NormalDayTable;
