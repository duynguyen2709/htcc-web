import React from 'react';
import * as _ from 'lodash';
import { Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
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
      editable: false,
      fixed: 'left',
      width: '150px',
    },
    {
      title: 'Người gửi',
      dataIndex: 'sender',
      editable: false,
      width: '150px',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      editable: false,
      width: '150px',
      sorter: {
        compare: (a, b) => a.category - b.category,
        multiple: 1,
      },
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      editable: false,
      width: '150px',
      sorter: {
        compare: (a, b) => a.date - b.date,
        multiple: 2,
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      editable: false,
      width: '100px',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      editable: false,
      width: '200px',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      editable: false,
      width: '400px',
      render: (o, record) => {
        const list = _.map(record.images, (img, index) => {
          return (
            <li className="float-left" key={index}>
              <a rel="noopener noreferrer" target="_blank" href={img}>
                <img className="img-complaint" src={img} alt="" />
              </a>
            </li>
          );
        });
        return (
          <ul style={{ listStyle: 'none', padding: 0 }} className="clearfix">
            {list}
          </ul>
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
