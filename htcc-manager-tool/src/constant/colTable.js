import React from 'react';
import {Popconfirm, Popover, Tag, Tooltip} from 'antd';
import {
    BarsOutlined,
    CheckCircleTwoTone,
    CloseCircleTwoTone,
    DeleteTwoTone,
    EditOutlined,
    ExclamationCircleTwoTone,
    QuestionCircleOutlined
} from '@ant-design/icons';
import LightboxImages from '../components/Tool/LightboxImages';
import * as _ from 'lodash';
import moment from 'moment';

export const columnsEmployee = [
    {
        title: 'Mã nhân viên',
        dataIndex: 'employeeId',
        editable: false,
        fixed: 'left',
        width: '150px',
    },
    {
        title: 'Username',
        dataIndex: 'username',
        editable: true,
        width: '200px',
    },
    {
        title: 'Ngày sinh',
        dataIndex: 'birthDate',
        editable: true,
        width: '200px',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        editable: true,
        width: '350px',
    },
    {
        title: 'CMND',
        dataIndex: 'identityCardNo',
        editable: true,
        width: '150px',
    },
    {
        title: 'Chi nhánh',
        dataIndex: 'officeId',
        editable: true,
        width: '150px',
    },
    {
        title: 'Phòng ban',
        dataIndex: 'department',
        editable: true,
        width: '150px',
    },
    {
        title: 'address',
        dataIndex: 'address',
        editable: true,
        width: '250px',
    },
];

export const columnsHistoryResponse = [
    {
        title: 'Nội dung',
        dataIndex: 'content',
        width: '100px',
    },
    {
        title: 'Phản hồi',
        dataIndex: 'response',
        width: '100px',
    },
];

export const buildColsComplaint = (funcEdit, cols = []) => {
    return [
        {
            title: 'Mã khiếu nại',
            dataIndex: 'complaintId',
            fixed: 'left',
            width: '160px',
        },
        {
            title: 'Người gửi',
            dataIndex: 'sender',
            width: '150px',
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            width: '150px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.category.localeCompare(b.category),
        },
        {
            title: 'Ngày',
            dataIndex: 'date',
            width: '150px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.date.localeCompare(b.date),
        },
        {
            title: 'Thời gian',
            dataIndex: 'time',
            width: '100px',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            width: '200px',
            render: (o, record) => {
                if (_.size(record.content) < 2) {
                    return record.content;
                }

                return (
                    <Popover
                        content={renderListContent(record.content)}
                        title={`Danh sách nội dung đã khiếu nại`}
                        trigger="hover"
                    >
                        <BarsOutlined style={{color: '#40a9ff'}}/>
                    </Popover>
                );
            },
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'images',
            width: '400px',
            render: (o, record) => {
                return (
                    <React.Fragment>
                        <LightboxImages imageSource={record.images}/>
                    </React.Fragment>
                );
            },
        },
        ...cols,
        {
            title: 'Phản hồi',
            dataIndex: 'response',
            width: '120px',
            render: (o, record) => {
                if (_.size(record.response) > 1) {
                    return (
                        <Tooltip placement="top" title={'Xem chi tiết'}>
                            <BarsOutlined
                                style={{color: '#40a9ff'}}
                                onClick={() => funcEdit(record, true)}
                            />
                        </Tooltip>
                    );
                } else {
                    return record.response[0];
                }
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            editable: false,
            fixed: 'right',
            width: '170px',
            render: (_, record) => {
                switch (record.status) {
                    case 2:
                        return (
                            <span className="clearfix">
                                <Tag className="float-left" color="warning">
                                    Chưa xử lý
                                </Tag>
                                <EditOutlined
                                    style={{
                                        color: '#52c41a',
                                        fontSize: '25px',
                                        float: 'left',
                                    }}
                                    className="float-right"
                                    onClick={() => funcEdit(record)}
                                />
                            </span>
                        );
                    case 1:
                        return <Tag color="success">Đã xử lý</Tag>;
                    default:
                        return <Tag color="error">Từ chối</Tag>;
                }
            },
        },
    ];
};

export const buildColsLeaveRequest = (funcEdit, cols = []) => {
    return [
        {
            title: 'Mã đơn',
            dataIndex: 'leavingRequestId',
            fixed: 'left',
            width: '160px',
        },
        {
            title: 'Người gửi',
            dataIndex: 'sender',
            width: '150px',
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            width: '150px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.category.localeCompare(b.category),
        },
        {
            title: 'Lý do',
            dataIndex: 'reason',
            width: '150px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.reason.localeCompare(b.reason),
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'dateSubmit',
            width: '150px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.dateSubmit.localeCompare(b.dateSubmit),
            render: (o, record) =>
                moment(record.dateSubmit).format('DD-MM-YYYY'),
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'dateFrom',
            width: '150px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.dateFrom.localeCompare(b.dateFrom),
            render: (o, record) => moment(record.dateFrom).format('DD-MM-YYYY'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'dateTo',
            width: '150px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.dateTo.localeCompare(b.dateTo),
            render: (o, record) => moment(record.dateTo).format('DD-MM-YYYY'),
        },
        {
            title: 'Dùng ngày phép',
            dataIndex: 'useDayOff',
            width: '200px',
            render: (o, record) => {
                if (record.useDayOff) {
                    return (
                        <Tooltip placement="top" title={'Dùng phép'}>
                            <CheckCircleTwoTone twoToneColor="#52c41a"/>
                        </Tooltip>
                    );
                }

                return (
                    <Tooltip placement="top" title={'Không dùng phép'}>
                        <CloseCircleTwoTone twoToneColor="#ff7875"/>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Chi tiết',
            dataIndex: 'detail',
            width: '200px',
            render: (o, record) => {
                return (
                    <Popover
                        content={renderListDetail(record.detail)}
                        title={`Chi tiết ngày nghỉ`}
                        trigger="hover"
                    >
                        <BarsOutlined style={{color: '#40a9ff'}}/>
                    </Popover>
                );
            },
        },
        ...cols,
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            editable: false,
            fixed: 'right',
            width: '170px',
            render: (_, record) => {
                switch (record.status) {
                    case 2:
                        return (
                            <span className="clearfix">
                                <Tag className="float-left" color="warning">
                                    Chưa xử lý
                                </Tag>
                                <EditOutlined
                                    style={{
                                        color: '#52c41a',
                                        fontSize: '25px',
                                        float: 'left',
                                    }}
                                    className="float-right"
                                    onClick={() => funcEdit(record)}
                                />
                            </span>
                        );
                    case 1:
                        return <Tag color="success">Đã xử lý</Tag>;
                    default:
                        return <Tag color="error">Từ chối</Tag>;
                }
            },
        },
    ];
};

const renderListDetail = (list = []) => {
    const listDetail = _.map(list, (item, index) => {
        const session =
            item.session === 0
                ? 'cả ngày'
                : item.session === 1
                ? 'Sáng'
                : 'Chiều';
        return (
            <li className="text-dark" key={index}>{`${moment(item.date).format(
                'DD-MM-YYYY'
            )}: ${session}`}</li>
        );
    });

    return <ul style={{padding: 15}}>{listDetail}</ul>;
};

const renderListContent = (list = []) => {
    const listContent = _.map(list, (item, index) => {
        return (
            <li
                style={{maxWidth: 200}}
                className="text-dark"
                key={index}
            >{`${item}`}</li>
        );
    });

    return <ul style={{padding: 15}}>{listContent}</ul>;
};

export const buildColsBranch = (funcEdit, funcDelete, cols = []) => [
    {
        title: 'Mã chi nhánh',
        dataIndex: 'officeId',
        fixed: 'left',
        width: '150px',
    },
    {
        title: 'Tên chi nhánh',
        dataIndex: 'officeName',
        width: '200px',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: '250px',
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
        width: '450px',
    },
    {
        title: 'Trụ sở chính',
        dataIndex: 'isHeadquarter',
        width: '150px',
        render: (o, record) => {
            if (record.isHeadquarter) {
                return <CheckCircleTwoTone twoToneColor="#52c41a"/>;
            }

            return <CloseCircleTwoTone twoToneColor="#ff7875"/>;
        },
    },
    {
        title: 'Vĩ độ',
        dataIndex: 'latitude',
        width: '200px',
    },
    {
        title: 'Kinh độ',
        dataIndex: 'longitude',
        width: '200px',
    },
    ...cols,
    {
        title: 'Khoảng cách tối đa cho phép điểm danh (m)',
        dataIndex: 'maxAllowDistance',
        width: '120px',
    },
    {
        title: 'Bắt buộc dùng wifi điểm danh',
        dataIndex: 'forceUseWifi',
        width: '100px',
        render: (o, record) => {
            if (record.forceUseWifi) {
                return <CheckCircleTwoTone twoToneColor="#52c41a"/>;
            }

            return <CloseCircleTwoTone twoToneColor="#ff7875"/>;
        },
    },
    {
        title: 'IP subnet',
        dataIndex: 'allowWifiIP',
        width: '200px',
    },
    {
        title: 'Hành động',
        width: '110px',
        fixed: 'right',
        render: (o, record) => {
            return (
                <React.Fragment>
                    <Tooltip placement="left" title={'Chỉnh sửa'}>
                        <EditOutlined
                            style={{
                                color: '#52c41a',
                                fontSize: '25px',
                                float: 'left',
                            }}
                            onClick={() => funcEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xoá？"
                        icon={<ExclamationCircleTwoTone twoToneColor="#d9534f"/>}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onConfirm={() => funcDelete(record)}
                    >
                        <Tooltip placement="left" title={'Xoá'}>
                            <DeleteTwoTone
                                twoToneColor="#ff7875"
                                style={{
                                    fontSize: '25px',
                                    float: 'right',
                                }}
                            />
                        </Tooltip>
                    </Popconfirm>
                </React.Fragment>
            );
        },
    },
];

export const buildColsCategoryDayOff = (funcEdit, funcDelete, cols = []) => [
    {
        title: 'Danh mục',
        dataIndex: 'category',
        width: '130px',
        fixed: 'left',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
        title: 'Hưởng lương',
        dataIndex: 'hasSalary',
        width: '70px',
        render: (o, record) => {
            if (record.hasSalary) {
                return <CheckCircleTwoTone twoToneColor="#52c41a"/>;
            }

            return <CloseCircleTwoTone twoToneColor="#ff7875"/>;
        },
    },
    {
        title: 'Trừ ngày phép',
        dataIndex: 'useDayOff',
        width: '70px',
        render: (o, record) => {
            if (record.useDayOff) {
                return <CheckCircleTwoTone twoToneColor="#52c41a"/>;
            }

            return <CloseCircleTwoTone twoToneColor="#ff7875"/>;
        },
    },
    {
        title: 'Hành động',
        width: '70px',
        fixed: 'right',
        render: (o, record) => {
            return (
                <React.Fragment>
                    <Tooltip placement="left" title={'Chỉnh sửa'}>
                        <EditOutlined
                            style={{
                                color: '#52c41a',
                                fontSize: '25px',
                                float: 'left',
                            }}
                            onClick={() => funcEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xoá？"
                        icon={<ExclamationCircleTwoTone twoToneColor="#d9534f"/>}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onConfirm={() => funcDelete(record)}
                    >
                        <Tooltip placement="left" title={'Xoá'}>
                            <DeleteTwoTone
                                twoToneColor="#ff7875"
                                style={{
                                    fontSize: '25px',
                                    float: 'right',
                                }}
                            />
                        </Tooltip>
                    </Popconfirm>
                </React.Fragment>
            );
        },
    },
];

export const buildColsDayOffLevel = (funcEdit, funcDelete, cols = []) => [
    {
        title: 'Cấp bậc',
        dataIndex: 'level',
        width: '100px',
        fixed: 'left',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.level > b.level,
    },
    {
        title: 'Số ngày phép',
        dataIndex: 'totalDayOff',
        width: '120px',
        fixed: 'left',
    },
    {
        title: 'Hành động',
        width: '70px',
        fixed: 'right',
        render: (o, record) => {
            return (
                <React.Fragment>
                    <Tooltip placement="left" title={'Chỉnh sửa'}>
                        <EditOutlined
                            style={{
                                color: '#52c41a',
                                fontSize: '25px',
                                float: 'left',
                            }}
                            onClick={() => funcEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xoá？"
                        icon={<ExclamationCircleTwoTone twoToneColor="#d9534f"/>}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onConfirm={() => funcDelete(record)}
                    >
                        <Tooltip placement="left" title={'Xoá'}>
                            <DeleteTwoTone
                                twoToneColor="#ff7875"
                                style={{
                                    fontSize: '25px',
                                    float: 'right',
                                }}
                            />
                        </Tooltip>
                    </Popconfirm>
                </React.Fragment>
            );
        },
    },
];

export const buildColsDepartment = (funcEdit, funcDelete, cols = []) => [
    {
        title: 'Mã phòng ban',
        dataIndex: 'department',
        fixed: 'left',
        width: '150px',
    },
    {
        title: 'Tên phòng ban',
        dataIndex: 'departmentName',
        width: '250px',
    },
    {
        title: 'Người quản lý',
        dataIndex: 'headManager',
        width: '350px',
    },
    ...cols,
    {
        title: 'Hành động',
        width: '110px',
        fixed: 'right',
        render: (o, record) => {
            return (
                <React.Fragment>
                    <EditOutlined
                        style={{
                            color: '#52c41a',
                            fontSize: '25px',
                            float: 'left',
                        }}
                        onClick={() => funcEdit(record)}
                    />
                    <Popconfirm
                        title="Bạn chắc chắn muốn xoá？"
                        icon={<ExclamationCircleTwoTone twoToneColor="#d9534f"/>}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onConfirm={() => funcDelete(record)}
                    >
                        <DeleteTwoTone
                            twoToneColor="#ff7875"
                            style={{
                                fontSize: '25px',
                                float: 'right',
                            }}
                        />
                    </Popconfirm>
                </React.Fragment>
            );
        },
    },
];

export const buildColsShift = (funcEdit, funcDelete, cols = []) => [
    {
        title: 'Mã ca',
        dataIndex: 'shiftId',
        width: '130px',
        fixed: 'left',
        sorter: (a, b) => a.shiftId.localeCompare(b.shiftId),
    },
    {
        title: 'Tên ca',
        dataIndex: 'shiftName',
        fixed: 'left',
        sorter: (a, b) => a.shiftName.localeCompare(b.shiftName),
    },
    {
        title: 'Giờ bắt đầu',
        dataIndex: 'startTime',
        width: '130px',
        sorter: (a, b) => a.startTime.localeCompare(b.startTime),
    },
    {
        title: 'Giờ kết thúc',
        dataIndex: 'endTime',
        width: '130px',
        sorter: (a, b) => a.endTime.localeCompare(b.endTime),
    },
    {
        title: () => {
            return (
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <span>Số ngày công</span>
                    <Tooltip placement="top"
                             title={'Hệ số tính công của ca làm'}>
                        <QuestionCircleOutlined
                            style={{margin: 'auto', marginLeft: '5px'}}/>
                    </Tooltip>
                </div>
            )
        },
        dataIndex: 'dayCount',
        width: '170px',
        sorter: (a, b) => a.dayCount - b.dayCount
    },
    {
        title: () => {
            return (
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <span>Thời gian cho phép điểm danh trễ</span>
                    <Tooltip placement="top"
                             title={'Nhân viên có thể diểm danh trễ / sớm bao nhiêu phút so với giờ bắt đầu / kết thúc ca'}>
                        <QuestionCircleOutlined style={{margin: 'auto'}}/>
                    </Tooltip>
                </div>
            )
        },
        dataIndex: 'allowLateMinutes',
        width: '150px',
        render: (o, record) => record.allowLateMinutes + ' phút',
    },
    {
        title: () => {
            return (
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <span>Điểm danh không ràng buộc</span>
                    <Tooltip placement="top"
                             title={'Ví dụ : Ca lúc 8h30 - 17h30, điểm danh lúc 8h - 17h vẫn tính đủ ca'}>
                        <QuestionCircleOutlined style={{margin: 'auto', marginLeft: '5px'}}/>
                    </Tooltip>
                </div>
            )
        },
        width: '180px',
        dataIndex: 'allowDiffTime',
        render: (o, record) => {
            if (record.allowDiffTime) {
                return <CheckCircleTwoTone twoToneColor="#52c41a"/>;
            }

            return <CloseCircleTwoTone twoToneColor="#ff7875"/>;
        },
        sorter: (a, b) => String(a.allowDiffTime).localeCompare(b.allowDiffTime)
    },
    {
        title: 'Hành động',
        width: '110px',
        fixed: 'right',
        render: (o, record) => {
            return (
                <>
                    <Tooltip placement="left" title={'Chỉnh sửa'}>
                        <EditOutlined
                            style={{
                                color: '#52c41a',
                                fontSize: '25px',
                                float: 'left',
                            }}
                            onClick={() => funcEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title={<>
                            <div>Xóa ca làm việc sẽ xóa cả lịch xếp ca tương ứng</div>
                            <div>Bạn chắc chắn muốn xoá ？</div>
                        </>}
                        icon={<ExclamationCircleTwoTone twoToneColor="#d9534f"/>}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onConfirm={() => funcDelete(record)}
                    >
                        <Tooltip placement="left" title={'Xoá'}>
                            <DeleteTwoTone
                                twoToneColor="#ff7875"
                                style={{
                                    fontSize: '25px',
                                    float: 'right',
                                }}
                            />
                        </Tooltip>
                    </Popconfirm>
                </>
            );
        },
    },
];

export const buildColsConfigDay = (funcEdit, funcDelete, cols = []) => [
    ...cols,
    {
        title: 'Đi làm',
        dataIndex: 'isWorking',
        width: '150px',
        render: (o, record) => {
            if (record.isWorking) {
                return <CheckCircleTwoTone twoToneColor="#52c41a"/>;
            }

            return <CloseCircleTwoTone twoToneColor="#ff7875"/>;
        },
        sorter: (a, b) => String(a.isWorking).localeCompare(String(b.isWorking))
    },
    {
        title: 'Hành động',
        width: '70px',
        fixed: 'right',
        render: (o, record) => {
            return (
                <>
                    <Tooltip placement="left" title={'Chỉnh sửa'}>
                        <EditOutlined
                            style={{
                                color: '#52c41a',
                                fontSize: '25px',
                                float: 'left',
                            }}
                            onClick={() => funcEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xoá？"
                        icon={<ExclamationCircleTwoTone twoToneColor="#d9534f"/>}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        onConfirm={() => funcDelete(record)}
                    >
                        <Tooltip placement="left" title={'Xoá'}>
                            <DeleteTwoTone
                                twoToneColor="#ff7875"
                                style={{
                                    fontSize: '25px',
                                    float: 'right',
                                }}
                            />
                        </Tooltip>
                    </Popconfirm>
                </>
            );
        },
    },
];
