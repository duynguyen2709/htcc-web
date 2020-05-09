import React from 'react';
import * as _ from 'lodash';
import { workScheduleApi } from '../../api';
import { store } from 'react-notifications-component';
import { createNotify } from '../../utils/notifier';
import { buildColsConfigDay } from '../../constant/colTable';
import { Table, Tag } from 'antd';
import AsyncModal from '../Modal/AsyncModal';
import FormEditSpecialDay from '../Form/FormEditSpecialDay';
import moment from 'moment';

class SpecialDayTable extends React.Component {
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

    componentWillReceiveProps(nextProps) {
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
        const { data } = this.state;
        this.setState({
            showModal: !this.state.showModal,
            curRecordEdit: null,
            data: submit ? null : data,
        });

        this.props.reloadData();
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

        console.log('data', data);

        return (
            <React.Fragment>
                <div className="table-edit">
                    <div className="table-small table-branch">
                        <Table
                            columns={buildColsConfigDay(
                                this.handleEdit,
                                this.handleDelete,
                                [
                                    {
                                        title: 'Ngày',
                                        dataIndex: 'date',
                                        width: '150px',
                                        defaultSortOrder: 'descend',
                                        sorter: (a, b) =>
                                            a.date.localeCompare(b.date),
                                        render: (o, record) =>
                                            moment(record.date).format(
                                                'DD-MM-YYYY'
                                            ),
                                    },
                                    {
                                        title: 'Mô tả',
                                        dataIndex: 'extraInfo',
                                        width: '150px',
                                        defaultSortOrder: 'descend',
                                    },
                                    {
                                        title: 'Buổi làm',
                                        dataIndex: 'session',
                                        width: '150px',
                                        render: (o, record) => {
                                            switch (record.session) {
                                                case 0:
                                                    return (
                                                        <Tag
                                                            className="float-left"
                                                            color="success"
                                                        >
                                                            Cả ngày
                                                        </Tag>
                                                    );
                                                case 1:
                                                    return (
                                                        <Tag
                                                            className="float-left"
                                                            color="warning"
                                                        >
                                                            Sáng
                                                        </Tag>
                                                    );
                                                case 2:
                                                    return (
                                                        <Tag
                                                            className="float-left"
                                                            color="error"
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
                            scroll={{ y: 'calc(100vh - 395px)' }}
                            loading={loading || data === null}
                            pagination={false}
                        />
                    </div>
                </div>
                <div>
                    <AsyncModal
                        key={curRecordEdit}
                        reload={false}
                        CompomentContent={FormEditSpecialDay}
                        visible={showModal}
                        toggle={(submit) => this.toggle(submit)}
                        title={'Chỉnh sửa ngày làm việc'}
                        data={curRecordEdit}
                        mode={'edit'}
                        prop={{ officeId: officeId }}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default SpecialDayTable;
