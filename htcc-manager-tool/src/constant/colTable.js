import React from 'react';
import { Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import LightboxImages from '../components/Tool/LightboxImages';

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

export const buildColsComplaint = (funcEdit, cols = []) => {
  return [
    {
      title: 'ID',
      dataIndex: 'complaintId',
      fixed: 'left',
      width: '150px',
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
            return <Tag color="default">Từ chối</Tag>;
        }
      },
    },
  ];
};
