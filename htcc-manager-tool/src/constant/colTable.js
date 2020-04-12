import React from 'react';
import { Tag, Popover, Tooltip } from 'antd';
import {
  EditOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  BarsOutlined
} from '@ant-design/icons';
import LightboxImages from '../components/Tool/LightboxImages';
import * as _ from 'lodash';

export const columnsEmployee = [
  {
    title: 'Mã nhân viên',
    dataIndex: 'employeeId',
    editable: false,
    fixed: 'left',
    width: '150px'
  },
  {
    title: 'Username',
    dataIndex: 'username',
    editable: true,
    width: '200px'
  },
  {
    title: 'Ngày sinh',
    dataIndex: 'birthDate',
    editable: true,
    width: '200px'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    editable: true,
    width: '350px'
  },
  {
    title: 'CMND',
    dataIndex: 'identityCardNo',
    editable: true,
    width: '150px'
  },
  {
    title: 'Chi nhánh',
    dataIndex: 'officeId',
    editable: true,
    width: '150px'
  },
  {
    title: 'Phòng ban',
    dataIndex: 'department',
    editable: true,
    width: '150px'
  },
  {
    title: 'address',
    dataIndex: 'address',
    editable: true,
    width: '250px'
  }
];

export const buildColsComplaint = (funcEdit, cols = []) => {
  return [
    {
      title: 'ID',
      dataIndex: 'complaintId',
      fixed: 'left',
      width: '150px'
    },
    {
      title: 'Người gửi',
      dataIndex: 'sender',
      width: '150px'
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      width: '150px',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.category.localeCompare(b.category)
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      width: '150px',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.date.localeCompare(b.date)
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      width: '100px'
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      width: '200px'
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
      }
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
                <Tag className="float-left" color="error">
                  Chưa xử lý
                </Tag>
                <EditOutlined
                  style={{
                    color: '#52c41a',
                    fontSize: '23px',
                    float: 'left'
                  }}
                  className="float-right"
                  onClick={() => funcEdit(record)}
                />
              </span>
            );
          case 1:
            return <Tag color="success">Đã xử lý</Tag>;
          default:
            return <Tag color="default">Từ chối</Tag>;
        }
      }
    }
  ];
};

export const buildColsLeaveRequest = (funcEdit, cols = []) => {
  return [
    {
      title: 'ID',
      dataIndex: 'leavingRequestId',
      fixed: 'left',
      width: '150px'
    },
    {
      title: 'Người gửi',
      dataIndex: 'sender',
      width: '150px'
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      width: '150px',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.category.localeCompare(b.category)
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      width: '150px',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.reason.localeCompare(b.reason)
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'dateSubmit',
      width: '150px',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.dateSubmit.localeCompare(b.dateSubmit)
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'dateFrom',
      width: '150px',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.dateFrom.localeCompare(b.dateFrom)
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'dateTo',
      width: '150px',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.dateTo.localeCompare(b.dateTo)
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
            <CloseCircleTwoTone twoToneColor="#ff7875" />;
          </Tooltip>
        );
      }
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
      }
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
                <Tag className="float-left" color="error">
                  Chưa xử lý
                </Tag>
                <EditOutlined
                  style={{
                    color: '#52c41a',
                    fontSize: '23px',
                    float: 'left'
                  }}
                  className="float-right"
                  onClick={() => funcEdit(record)}
                />
              </span>
            );
          case 1:
            return <Tag color="success">Đã xử lý</Tag>;
          default:
            return <Tag color="default">Từ chối</Tag>;
        }
      }
    }
  ];
};

const renderListDetail = (list = []) => {
  const listDetail = _.map(list, (item, index) => {
    const session =
      item.session === 0 ? 'cả ngày' : item.session === 1 ? 'Sáng' : 'Chiều';
    return (
      <li className="text-dark" key={index}>{`${item.date}: ${session}`}</li>
    );
  });

  return <ul style={{ padding: 15 }}>{listDetail}</ul>;
};

export const buildColsBranch = (funcEdit, cols = []) => [
  {
    title: 'Mã chi nhánh',
    dataIndex: 'officeId',
    fixed: 'left',
    width: '150px'
  },
  {
    title: 'Tên chi nhánh',
    dataIndex: 'officeName',
    width: '200px'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: '350px'
  },
  {
    title: 'address',
    dataIndex: 'address',
    width: '250px'
  },
  {
    title: 'Khoảng cách tối đa (m)',
    dataIndex: 'maxAllowDistance',
    width: '250px'
  },
  {
    title: 'Vĩ độ',
    dataIndex: 'latitude',
    width: '250px'
  },
  {
    title: 'Kinh độ',
    dataIndex: 'longitude',
    width: '250px'
  },
  ...cols,
  {
    title: 'Trụ sở chính',
    dataIndex: 'isHeadquarter',
    width: '200px',
    render: (o, record) => {
      if (record.isHeadquarter) {
        return <CheckCircleTwoTone twoToneColor="#52c41a" />;
      }

      return <CloseCircleTwoTone twoToneColor="#ff7875" />;
    }
  },
  {
    title: 'Wifi',
    dataIndex: 'forceUseWifi',
    width: '200px',
    render: (o, record) => {
      if (record.forceUseWifi) {
        return <CheckCircleTwoTone twoToneColor="#52c41a" />;
      }

      return <CloseCircleTwoTone twoToneColor="#ff7875" />;
    }
  },
  {
    title: 'Hành động',
    width: '150px',
    fixed: 'right',
    render: (o, record) => {
      return (
        <EditOutlined
          style={{
            color: '#52c41a',
            fontSize: '23px'
          }}
          onClick={() => funcEdit(record)}
        />
      );
    }
  }
];
