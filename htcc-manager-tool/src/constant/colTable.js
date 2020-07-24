import React from 'react';
import { Popconfirm, Popover, Tag, Tooltip } from 'antd';
import {
    BarsOutlined,
    CheckCircleTwoTone,
    CloseCircleTwoTone,
    DeleteTwoTone,
    EditOutlined,
    ExclamationCircleTwoTone,
    EyeOutlined,
    LockTwoTone,
    QuestionCircleOutlined,
    UnlockTwoTone,
} from '@ant-design/icons';
import LightboxImages from '../components/Tool/LightboxImages';
import * as _ from 'lodash';
import moment from 'moment';
import { isLeapYear } from '../utils/dataTable';

export const buildColsEmployee = (
    funcEdit,
    funcBlock,
    username,
    canUpdate,
    canDelete
) => [
    {
        title: 'Tên đăng nhập',
        dataIndex: 'username',
        width: '120px',
        fixed: 'left',
    },
    {
        title: 'Ảnh đại diện',
        dataIndex: 'images',
        width: '150px',
        render: (o, record) => {
            return (
                <React.Fragment>
                    <LightboxImages imageSource={[record.avatar]} />
                </React.Fragment>
            );
        },
    },
    {
        title: 'Họ và tên',
        dataIndex: 'fullName',
        width: '200px',
    },
    {
        title: 'Ngày sinh',
        dataIndex: 'birthDate',
        width: '150px',
        render: (o, record) => {
            return moment(record.birthDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
        },
    },
    {
        title: 'Giới tính',
        dataIndex: 'gender',
        width: '100px',
        render: (o, record) => {
            switch (record.gender) {
                case 1:
                    return 'Nam';
                case 0:
                    return 'Nữ';
                default:
                    return 'Khác';
            }
        },
    },
    {
        title: 'Chức vụ',
        dataIndex: 'title',
        width: '200px',
    },
    {
        title: 'Cấp bậc',
        dataIndex: 'level',
        width: '100px',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: '250px',
    },
    {
        title: 'CMND',
        dataIndex: 'identityCardNo',
        width: '150px',
    },
    {
        title: 'Chi nhánh',
        dataIndex: 'officeId',
        width: '100px',
    },
    {
        title: 'Phòng ban',
        dataIndex: 'department',
        width: '150px',
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
        width: '250px',
    },
    {
        title: 'Hành động',
        width: '110px',
        fixed: 'right',
        render: (o, record) => {
            return (
                <React.Fragment>
                    {canUpdate ? (
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
                    ) : null}
                    {record.username === username || !canDelete ? null : (
                        <Popconfirm
                            title={`Bạn chắc chắn muốn ${
                                record.status === 1 ? 'khoá' : 'mở khoá'
                            } ?`}
                            icon={
                                <ExclamationCircleTwoTone twoToneColor="#d9534f" />
                            }
                            okText="Đồng ý"
                            cancelText="Huỷ"
                            onConfirm={() =>
                                funcBlock(record.username, record.status)
                            }
                        >
                            <Tooltip
                                placement="left"
                                title={
                                    record.status === 1
                                        ? 'Chọn để khoá'
                                        : 'chọn để mở khoá'
                                }
                            >
                                {record.status === 1 ? (
                                    <UnlockTwoTone
                                        twoToneColor="#1C90FF"
                                        style={{
                                            fontSize: '25px',
                                            float: 'right',
                                        }}
                                    />
                                ) : (
                                    <LockTwoTone
                                        twoToneColor="#ff7875"
                                        style={{
                                            fontSize: '25px',
                                            float: 'right',
                                        }}
                                    />
                                )}
                            </Tooltip>
                        </Popconfirm>
                    )}
                </React.Fragment>
            );
        },
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

export const buildColsComplaint = (funcEdit, canUpdate, cols = []) => {
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
                        <BarsOutlined style={{ color: '#40a9ff' }} />
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
                        <LightboxImages imageSource={record.images} />
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
                                style={{ color: '#40a9ff' }}
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
                                {canUpdate ? (
                                    <EditOutlined
                                        style={{
                                            color: '#52c41a',
                                            fontSize: '25px',
                                            float: 'left',
                                        }}
                                        className="float-right"
                                        onClick={() => funcEdit(record)}
                                    />
                                ) : null}
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

export const buildColsLeaveRequest = (funcEdit, canUpdate, cols = []) => {
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
                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                        </Tooltip>
                    );
                }

                return (
                    <Tooltip placement="top" title={'Không dùng phép'}>
                        <CloseCircleTwoTone twoToneColor="#ff7875" />
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
                        <BarsOutlined style={{ color: '#40a9ff' }} />
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
                                {canUpdate ? (
                                    <EditOutlined
                                        style={{
                                            color: '#52c41a',
                                            fontSize: '25px',
                                            float: 'left',
                                        }}
                                        className="float-right"
                                        onClick={() => funcEdit(record)}
                                    />
                                ) : null}
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

    return <ul style={{ padding: 15 }}>{listDetail}</ul>;
};

const renderListContent = (list = []) => {
    const listContent = _.map(list, (item, index) => {
        return (
            <li
                style={{ maxWidth: 200 }}
                className="text-dark"
                key={index}
            >{`${item}`}</li>
        );
    });

    return <ul style={{ padding: 15 }}>{listContent}</ul>;
};

export const buildColsBranch = (
    funcEdit,
    funcDelete,
    canUpdate,
    canDelete,
    cols = []
) => [
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
                return <CheckCircleTwoTone twoToneColor="#52c41a" />;
            }

            return <CloseCircleTwoTone twoToneColor="#ff7875" />;
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
                return <CheckCircleTwoTone twoToneColor="#52c41a" />;
            }

            return <CloseCircleTwoTone twoToneColor="#ff7875" />;
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
                    {canUpdate ? (
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
                    ) : null}
                    {canDelete ? (
                        <Popconfirm
                            title="Bạn chắc chắn muốn xoá？"
                            icon={
                                <ExclamationCircleTwoTone twoToneColor="#d9534f" />
                            }
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
                    ) : null}
                </React.Fragment>
            );
        },
    },
];

export const buildColsCategoryDayOff = (
    funcEdit,
    funcDelete,
    canUpdate,
    cols = []
) => [
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
                return <CheckCircleTwoTone twoToneColor="#52c41a" />;
            }

            return <CloseCircleTwoTone twoToneColor="#ff7875" />;
        },
    },
    {
        title: 'Trừ ngày phép',
        dataIndex: 'useDayOff',
        width: '70px',
        render: (o, record) => {
            if (record.useDayOff) {
                return <CheckCircleTwoTone twoToneColor="#52c41a" />;
            }

            return <CloseCircleTwoTone twoToneColor="#ff7875" />;
        },
    },
    {
        title: 'Hành động',
        width: '70px',
        fixed: 'right',
        render: (o, record) => {
            return canUpdate ? (
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
                        icon={
                            <ExclamationCircleTwoTone twoToneColor="#d9534f" />
                        }
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
            ) : null;
        },
    },
];

export const buildColsDayOffLevel = (
    funcEdit,
    funcDelete,
    canUpdate,
    cols = []
) => [
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
            return canUpdate ? (
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
                        icon={
                            <ExclamationCircleTwoTone twoToneColor="#d9534f" />
                        }
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
            ) : null;
        },
    },
];

export const buildColsDepartment = (
    funcEdit,
    funcDelete,
    canUpdate,
    canDelete,
    cols = []
) => [
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
                    {canUpdate ? (
                        <EditOutlined
                            style={{
                                color: '#52c41a',
                                fontSize: '25px',
                                float: 'left',
                            }}
                            onClick={() => funcEdit(record)}
                        />
                    ) : null}
                    {canDelete ? (
                        <Popconfirm
                            title="Bạn chắc chắn muốn xoá？"
                            icon={
                                <ExclamationCircleTwoTone twoToneColor="#d9534f" />
                            }
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
                    ) : null}
                </React.Fragment>
            );
        },
    },
];

export const buildColsShift = (
    funcEdit,
    funcDelete,
    canUpdate,
    canDelete,
    cols = []
) => [
    {
        title: 'Mã ca',
        dataIndex: 'shiftId',
        width: '100px',
        fixed: 'left',
        sorter: (a, b) => a.shiftId.localeCompare(b.shiftId),
    },
    {
        title: 'Tên ca',
        dataIndex: 'shiftName',
        width: '130px',
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
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <span>Số ngày công</span>
                    <Tooltip
                        placement="top"
                        title={'Hệ số tính công của ca làm'}
                    >
                        <QuestionCircleOutlined
                            style={{ margin: 'auto', marginLeft: '5px' }}
                        />
                    </Tooltip>
                </div>
            );
        },
        dataIndex: 'dayCount',
        width: '170px',
        sorter: (a, b) => a.dayCount - b.dayCount,
    },
    {
        title: () => {
            return (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <span>Thời gian cho phép điểm danh trễ</span>
                    <Tooltip
                        placement="top"
                        title={
                            'Nhân viên có thể diểm danh trễ / sớm bao nhiêu phút so với giờ bắt đầu / kết thúc ca'
                        }
                    >
                        <QuestionCircleOutlined style={{ margin: 'auto' }} />
                    </Tooltip>
                </div>
            );
        },
        dataIndex: 'allowLateMinutes',
        width: '150px',
        render: (o, record) => record.allowLateMinutes + ' phút',
    },
    {
        title: () => {
            return (
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <span>Điểm danh không ràng buộc</span>
                    <Tooltip
                        placement="top"
                        title={
                            'Ví dụ : Ca lúc 8h30 - 17h30, điểm danh lúc 8h - 17h vẫn tính đủ ca'
                        }
                    >
                        <QuestionCircleOutlined
                            style={{ margin: 'auto', marginLeft: '5px' }}
                        />
                    </Tooltip>
                </div>
            );
        },
        width: '180px',
        dataIndex: 'allowDiffTime',
        render: (o, record) => {
            if (record.allowDiffTime) {
                return <CheckCircleTwoTone twoToneColor="#52c41a" />;
            }

            return <CloseCircleTwoTone twoToneColor="#ff7875" />;
        },
        sorter: (a, b) =>
            String(a.allowDiffTime).localeCompare(b.allowDiffTime),
    },
    {
        title: 'Hành động',
        width: '110px',
        fixed: 'right',
        render: (o, record) => {
            return (
                <>
                    {canUpdate ? (
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
                    ) : null}
                    {canDelete ? (
                        <Popconfirm
                            title={
                                <>
                                    <div>
                                        Xóa ca làm việc sẽ xóa cả lịch xếp ca
                                        tương ứng
                                    </div>
                                    <div>Bạn chắc chắn muốn xoá ？</div>
                                </>
                            }
                            icon={
                                <ExclamationCircleTwoTone twoToneColor="#d9534f" />
                            }
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
                    ) : null}
                </>
            );
        },
    },
];

export const buildColsConfigDay = (
    funcEdit,
    funcDelete,
    canUpdate,
    canDelete,
    cols = []
) => [
    ...cols,
    {
        title: 'Đi làm',
        dataIndex: 'isWorking',
        width: '150px',
        render: (o, record) => {
            if (record.isWorking) {
                return <CheckCircleTwoTone twoToneColor="#52c41a" />;
            }

            return <CloseCircleTwoTone twoToneColor="#ff7875" />;
        },
        sorter: (a, b) =>
            String(a.isWorking).localeCompare(String(b.isWorking)),
    },
    {
        title: 'Hành động',
        width: '70px',
        fixed: 'right',
        render: (o, record) => {
            return (
                <>
                    {canUpdate ? (
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
                    ) : null}
                    {canDelete ? (
                        <Popconfirm
                            title="Bạn chắc chắn muốn xoá？"
                            icon={
                                <ExclamationCircleTwoTone twoToneColor="#d9534f" />
                            }
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
                    ) : null}
                </>
            );
        },
    },
];

export const buildColsApprovalAttendance = (funcEdit, canUpdate, cols = []) => {
    return [
        {
            title: 'Mã nhân viên',
            dataIndex: 'username',
            fixed: 'left',
            width: '120px',
        },
        {
            title: 'Mã chi nhánh',
            dataIndex: 'officeId',
            width: '200px',
        },
        ...cols,
        {
            title: 'Loại điểm danh',
            dataIndex: 'type',
            width: '150px',
            render: (_, record) => {
                switch (record.type) {
                    case 1:
                        return (
                            <span className="clearfix">
                                <Tag className="float-left" color="green">
                                    Vào Ca
                                </Tag>
                            </span>
                        );
                    case 2:
                        return <Tag color="blue">Tan ca</Tag>;
                    default:
                        return null;
                }
            },
        },
        {
            title: 'Ngày',
            dataIndex: 'checkInDate',
            width: '120px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.checkInDate.localeCompare(b.checkInDate),
        },
        {
            title: 'Thời gian điểm danh',
            dataIndex: 'checkInTime',
            width: '120px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.checkInTime.localeCompare(b.checkInTime),
        },
        {
            title: 'Điểm danh đúng giờ',
            dataIndex: 'isOnTime',
            width: '120px',
            defaultSortOrder: 'descend',
            render: (o, record) => {
                if (record.isOnTime) {
                    return (
                        <Tooltip placement="top" title={'Đúng giờ'}>
                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                        </Tooltip>
                    );
                }

                return (
                    <Tooltip placement="top" title={'Đi trễ'}>
                        <CloseCircleTwoTone twoToneColor="#ff7875" />
                    </Tooltip>
                );
            },
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            width: '150px',
            render: (o, record) => {
                if (_.isEmpty(record.image)) return null;

                return (
                    <React.Fragment>
                        <LightboxImages imageSource={[record.image]} />
                    </React.Fragment>
                );
            },
        },
        {
            title: 'Tên ca',
            dataIndex: 'shiftName',
            width: '200px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.shiftName.localeCompare(b.shiftName),
        },
        {
            title: 'Thời gian ca',
            dataIndex: 'shiftTime',
            width: '150px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.shiftTime.localeCompare(b.shiftTime),
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
                                {canUpdate ? (
                                    <EditOutlined
                                        style={{
                                            color: '#52c41a',
                                            fontSize: '25px',
                                            float: 'left',
                                        }}
                                        className="float-right"
                                        onClick={() => funcEdit(record)}
                                    />
                                ) : null}
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

export const MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const buildColsHistoryCheckin = (
    date,
    funcHandleOnHover,
    funcShowDetail
) => {
    const months = MONTHS;
    const month = date.month();
    const year = date.year();
    const cols = [
        {
            title: 'Mã nhân viên',
            dataIndex: 'username',
            fixed: 'left',
            width: '160px',
        },
    ];

    if (isLeapYear(year)) months[2] = 29;

    for (let i = 1; i <= months[month]; i++) {
        let day = i;

        if (_.floor(i / 10) === 0) {
            day = `0${i}`;
        }

        const title = `${moment(
            `${date.format('YYYYMM')}${day}`,
            'YYYYMMDD'
        ).format('ddd')} - ${day}/${month + 1}`;

        cols.push({
            title: <div className="text-center">{title}</div>,
            dataIndex: day,
            width: '200px',
            render: (o, record) => {
                let title = '';
                const times = _.map(record[day], (d, i) => {
                    let color = 'green';
                    title = d.shiftName;

                    if (!d.isOnTime) color = 'red';

                    return (
                        <Tag key={i} className="float-left" color={color}>
                            {`${d.checkInTime}`}
                        </Tag>
                    );
                });

                const id = `${record['username']}_${day}`;

                return (
                    <React.Fragment>
                        <div
                            onMouseLeave={() => funcHandleOnHover('out', id)}
                            onMouseOver={() => funcHandleOnHover('on', id)}
                            id={`content-${id}`}
                            className={'cell-checkin'}
                        >
                            <h5>{title}</h5>
                            {times}
                        </div>

                        {!_.isEmpty(record[day]) && (
                            <div id={id} className={'hide eye-detail-checkin'}>
                                <EyeOutlined
                                    onMouseOver={() =>
                                        funcHandleOnHover('on', id)
                                    }
                                    style={{ fontSize: 80 }}
                                    onClick={() =>
                                        funcShowDetail(record[day], id)
                                    }
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            },
        });
    }
    return cols;
};

export const buildColsDetailHistoryCheckin = () => {
    return [
        {
            title: 'Mã nhân viên',
            dataIndex: 'username',
            fixed: 'left',
            width: '120px',
        },
        {
            title: 'Mã chi nhánh',
            dataIndex: 'officeId',
            width: '200px',
        },
        {
            title: 'Loại điểm danh',
            dataIndex: 'type',
            width: '150px',
            render: (_, record) => {
                switch (record.type) {
                    case 1:
                        return (
                            <span className="clearfix">
                                <Tag className="float-left" color="green">
                                    Vào Ca
                                </Tag>
                            </span>
                        );
                    case 2:
                        return <Tag color="blue">Tan ca</Tag>;
                    default:
                        return null;
                }
            },
        },
        {
            title: 'Ngày',
            dataIndex: 'checkInDate',
            width: '120px',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.checkInDate.localeCompare(b.checkInDate),
        },
        {
            title: 'Thời gian điểm danh',
            dataIndex: 'checkInTime',
            width: '120px',
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.checkInTime.localeCompare(b.checkInTime),
        },
        {
            title: 'Điểm danh đúng giờ',
            dataIndex: 'isOnTime',
            width: '120px',
            defaultSortOrder: 'ascend',
            render: (o, record) => {
                if (record.isOnTime) {
                    return (
                        <Tooltip placement="top" title={'Đúng giờ'}>
                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                        </Tooltip>
                    );
                }

                return (
                    <Tooltip placement="top" title={'Đi trễ'}>
                        <CloseCircleTwoTone twoToneColor="#ff7875" />
                    </Tooltip>
                );
            },
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            width: '150px',
            render: (o, record) => {
                if (_.isEmpty(record.image)) return null;

                return (
                    <React.Fragment>
                        <LightboxImages imageSource={[record.image]} />
                    </React.Fragment>
                );
            },
        },
        {
            title: 'Tên ca',
            dataIndex: 'shiftName',
            width: '200px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.shiftName.localeCompare(b.shiftName),
        },
        {
            title: 'Thời gian ca',
            dataIndex: 'shiftTime',
            width: '150px',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.shiftTime.localeCompare(b.shiftTime),
        },
    ];
};
