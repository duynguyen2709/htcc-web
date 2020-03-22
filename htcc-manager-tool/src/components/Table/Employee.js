import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Tooltip, Form } from 'antd';
import * as _ from 'lodash';
import {
  EditOutlined,
  UnlockOutlined,
  LockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const mapData = data => {
  return _.map(data, item => ({
    key: item.employeeId.toString(),
    ...item
  }));
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = ({ columnsInput = [], dataInput = [] }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    if (!_.isEmpty(dataInput)) {
      setData(mapData(dataInput));
    }
  }, [dataInput]);

  const isEditing = record => record.key === editingKey;

  const edit = record => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async key => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    ...columnsInput,
    {
      title: 'Hành động',
      dataIndex: 'operation',
      fixed: 'right',
      width: '130px',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span className="clearfix">
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              className="btn-confirm-edit float-left"
            >
              <CheckCircleOutlined />
            </a>
            <a className="btn-cancel-edit float-right" onClick={cancel}>
              <CloseCircleOutlined />
            </a>
          </span>
        ) : (
          <React.Fragment>
            <Tooltip placement="top" title={'Chỉnh sửa'}>
              <EditOutlined
                style={{
                  color: '#52c41a',
                  fontSize: '23px',
                  float: 'left'
                }}
                disabled={editingKey !== ''}
                onClick={() => edit(record)}
              />
            </Tooltip>
            {'   '}
            {record && record.key !== 'VNG-004' ? (
              <Tooltip placement="top" title={'Khoá'}>
                <UnlockOutlined
                  style={{
                    color: '#262626',
                    fontSize: '23px',
                    float: 'right'
                  }}
                  disabled={editingKey !== ''}
                  onClick={() => {}}
                />
              </Tooltip>
            ) : (
              <Tooltip placement="top" title={'Mở khoá'}>
                <LockOutlined
                  style={{
                    color: '#ff4d4f',
                    fontSize: '23px',
                    float: 'right'
                  }}
                  disabled={editingKey !== ''}
                  onClick={() => {}}
                />
              </Tooltip>
            )}
          </React.Fragment>
        );
      }
    }
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell
          }
        }}
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
          pageSize: 7
        }}
        scroll={{ x: 900 }}
      />
    </Form>
  );
};

export default EditableTable;
