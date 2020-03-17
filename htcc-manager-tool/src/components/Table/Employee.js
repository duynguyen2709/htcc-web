import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import * as _ from 'lodash';
import { EditOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons';

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
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8
              }}
            >
              Lưu
            </a>
            <Popconfirm title="Bạn muốn huỷ?" onConfirm={cancel}>
              <a>Huỷ</a>
            </Popconfirm>
          </span>
        ) : (
          <React.Fragment className="clearfix">
            <EditOutlined
              style={{
                color: '#52c41a',
                fontSize: '23px',
                float: 'left'
              }}
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            />
            {'   '}
            {record && record.key !== 'VNG-004' ? (
              <UnlockOutlined
                style={{
                  color: '#262626',
                  fontSize: '23px',
                  float: 'right'
                }}
                disabled={editingKey !== ''}
                onClick={() => {}}
              />
            ) : (
              <LockOutlined
                style={{
                  color: '#ff4d4f',
                  fontSize: '23px',
                  float: 'right'
                }}
                disabled={editingKey !== ''}
                onClick={() => {}}
              />
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
        scroll={{ x: 1000 }}
      />
    </Form>
  );
};

export default EditableTable;
