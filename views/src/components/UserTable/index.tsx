import { Table, Button, Menu, Dropdown, Modal, Form, InputNumber, Input, Popconfirm } from 'antd';
import { ToolFilled, PlusCircleTwoTone } from '@ant-design/icons';
import React, { useState } from 'react';
import ModalContent from './modal';
import fetchUserData from '../../services/fetchUserData';
import userAPIs from '../../services/user';

interface Ship {
  id: number;
  amount: number;
  name: string;
}

export interface User {
  level: number;
  id: number;
  resource: number[];
  ships: Ship[];
  secretary: number | null;
}

interface UserTableProps {
  data?: User[];
  setUser: (user: any) => void;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Ship;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
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
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
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

interface ExpandedShipTableProps {
  ships: Ship[];
  userId: number;
}

const ExpandedShipTable = (props: ExpandedShipTableProps) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(props.ships);
  const [editingId, setEditingId] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = (record: Ship) => record.id === editingId;

  const edit = (record: Ship) => {
    form.setFieldsValue({ ...record });
    setEditingId(record.id);
  };

  const cancel = () => {
    setEditingId(-1);
  };

  const save = async (id: number) => {
    setIsLoading(true);
    try {
      const row = (await form.validateFields()) as Ship;
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        await fetchUserData(userAPIs.setShipAmount, {
          userId: props.userId,
          shipId: id,
          amount: row.amount,
        });
        setData(newData);
        setEditingId(-1);
      } else {
        newData.push(row);
        setData(newData);
        setEditingId(-1);
      }
      setIsLoading(false);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: '舰船ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '数量',
      key: 'amount',
      dataIndex: 'amount',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: Ship) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              loading={isLoading}
              type="primary"
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              保存
            </Button>
            <Popconfirm title="确认取消?" onConfirm={cancel}>
              <Button>取消</Button>
            </Popconfirm>
          </span>
        ) : (
          <Button icon={<ToolFilled />} disabled={editingId !== -1} onClick={() => edit(record)}>
            修改
          </Button>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Ship) => ({
        record,
        inputType: 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfimLoading, setModalConfimLoading] = useState(false);
  const [addShipForm] = Form.useForm();
  const addShip = async () => {
    setModalConfimLoading(true);
    try {
      const row = await addShipForm.validateFields();
      const shipId = +row.shipId;
      const amount = +row.amount;
      const ship = await fetchUserData(userAPIs.setShipAmount, {
        userId: props.userId,
        shipId,
        amount,
      });
      console.log(ship);
      setData([...data, ship]);
      setModalVisible(false);
    } catch (e) {
      console.error(e);
    }
    setModalConfimLoading(false);
  };

  const footer = () => (
    <Button onClick={() => setModalVisible(true)}>
      <PlusCircleTwoTone />
      添加
    </Button>
  );

  return (
    <Form form={form} key={props.userId} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        rowKey={(record: Ship) => record.id}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        footer={footer}
      />
      <Modal
        title="添加舰娘"
        visible={modalVisible}
        confirmLoading={modalConfimLoading}
        onCancel={() => setModalVisible(false)}
        onOk={addShip}
      >
        <Form form={addShipForm} component={false}>
          <Form.Item name="shipId" label="舰娘ID">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="amount" label="数量">
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </Form>
  );
};

type ModalType = 'resource' | 'level' | 'ship';

interface ModalInfo {
  type: ModalType;
  data?: User;
}

function UserTable(props: UserTableProps) {
  const { data = [], setUser } = props;
  const [modalVisible, setVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    type: 'resource',
  });
  const [confirmLoading, setConfrimLoading] = useState(false);
  const rowKey = (record: User) => record.id;
  const handleModifyClick = (modalInfo: ModalInfo) => {
    setVisible(true);
    setModalInfo(modalInfo);
  };
  const hideModal = () => {
    setVisible(false);
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: '资源',
      dataIndex: 'resource',
      key: 'resource',
      render: (txt: number[]) => `[${txt.join(', ')}]`,
    },
    {
      title: '秘书舰',
      dataIndex: 'secretary',
      key: 'secretary',
    },
    {
      title: '操作',
      key: 'action',
      render: (txt: any, record: User) => {
        const content = (
          <Menu>
            <Menu.Item onClick={() => handleModifyClick({ data: record, type: 'resource' })}>
              修改资源
            </Menu.Item>
            <Menu.Item onClick={() => handleModifyClick({ data: record, type: 'level' })}>
              修改等级
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={content}>
            <Button icon={<ToolFilled />} type="default">
              修改
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const handleModalOK = async () => {
    setConfrimLoading(true);
    if (modalInfo.type === 'resource') {
      await fetchUserData(userAPIs.setResource, {
        userId: modalInfo.data?.id,
        resource: modalInfo.data?.resource,
      });
    } else if (modalInfo.type === 'level') {
      await fetchUserData(userAPIs.setLevel, {
        userId: modalInfo.data?.id,
        level: modalInfo.data?.level,
      });
    }
    const newUsers = data.map((user) => {
      return user.id === modalInfo.data?.id ? modalInfo.data : user;
    });
    setUser(newUsers);
    setConfrimLoading(false);
    setVisible(false);
  };

  return (
    <div>
      <Table
        rowKey={rowKey}
        dataSource={data}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <ExpandedShipTable userId={record.id} ships={record.ships} />
          ),
        }}
      />
      <Modal
        title="修改信息"
        visible={modalVisible}
        onOk={handleModalOK}
        onCancel={hideModal}
        confirmLoading={confirmLoading}
      >
        <ModalContent data={modalInfo.data} type={modalInfo.type} setModalInfo={setModalInfo} />
      </Modal>
    </div>
  );
}

export default UserTable;
