import React, { useState } from 'react';
import _ from 'lodash';
import { Table, Tag, Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { MinusCircleOutlined } from '@ant-design/icons';
import fetchOrderData from '../../services/fetchOrderData';
import orderAPIs from '../../services/order';

export enum OrderStatus {
  CREATED = 0,
  ACTIVE,
  FINISHED,
  CANCELD,
}

export enum OrderType {
  SHIP_TO_RESOURCE = 0,
  RESOURCE_TO_SHIP,
  RESOURCE_TO_RESOURCE,
  SHIP_TO_SHIP,
}

interface Order {
  id: number;
  sellerId: number;
  buyerId: number;
  createdAt: number;
  status: OrderStatus;
  toTrade: number[];
  wanted: number[];
  orderType: OrderType;
}

interface OrderTableProps {
  data: Order[];
  setOrder: (order: any) => void;
}

const statusText = ['待发布', '交易中', '已结束', '已取消'];

const orderTypeText = ['舰娘 → 资源', '资源 → 舰娘', '资源 → 资源', '舰娘 → 舰娘'];

function OrderTable({ data, setOrder }: OrderTableProps) {
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const deleteOrder = async (orderId: number) => {
    setLoadingIds([...loadingIds, orderId]);
    await fetchOrderData(orderAPIs.deleteOrder, { orderId });
    setLoadingIds(
      _(loadingIds)
        .without(orderId)
        .value(),
    );
    const newOrder = _(data)
      .without(_(data).find((order) => order.id === orderId)!)
      .value();
    setOrder(newOrder);
  };
  const columns: ColumnsType<Order> = [
    {
      title: '订单ID',
      key: 'id',
      dataIndex: 'id',
      fixed: 'left',
      width: 150,
    },
    {
      title: '类型',
      key: 'orderType',
      dataIndex: 'orderType',
      width: 150,
      filters: _.map(orderTypeText, (text, index) => ({
        text,
        value: index,
      })),
      onFilter: (value, record) => record.orderType === value,
      render: (type: number) => orderTypeText[type],
    },
    {
      title: '卖方',
      key: 'sellerId',
      dataIndex: 'sellerId',
      width: 150,
      filters: _(data)
        .map((order) => order.sellerId)
        .uniq()
        .map((id) => ({ text: id, value: id }))
        .value(),
      onFilter: (value, record) => record.sellerId === value,
    },
    {
      title: '买方',
      key: 'buyerId',
      width: 150,
      dataIndex: 'buyerId',
      filters: _(data)
        .map((order) => order.buyerId)
        .uniq()
        .map((id) => ({ text: id, value: id }))
        .value(),
      onFilter: (value, record) => record.buyerId === value,
    },
    {
      title: '卖出',
      key: 'toTrade',
      dataIndex: 'toTrade',
      width: 250,
      render: (nums: number[]) => `[${nums.join(', ')}]`,
    },
    {
      title: '收到',
      key: 'wanted',
      dataIndex: 'wanted',
      width: 250,
      render: (nums: number[]) => `[${nums.join(', ')}]`,
    },
    {
      title: '日期',
      key: 'createdAt',
      width: 200,
      dataIndex: 'createdAt',
      sorter: (a, b) => a.createdAt - b.createdAt,
      render: (timestamp: number) => new Date(timestamp).toLocaleString('zh-CN', { hour12: false }),
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: 100,
      filters: _.map(statusText, (text, index) => ({
        text,
        value: index,
      })),
      onFilter: (value, record) => record.status === value,
      render: (status: OrderStatus) => {
        const statusColor = ['geekblue', 'green', 'orange', 'red'];
        return (
          <Tag color={statusColor[status]} key={status}>
            {statusText[status]}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (txt: any, record: Order) => {
        return (
          <Button
            danger
            icon={<MinusCircleOutlined />}
            loading={loadingIds.includes(record.id)}
            onClick={() => deleteOrder(record.id)}
          >
            删除
          </Button>
        );
      },
    },
  ];
  return (
    <Table columns={columns} scroll={{ x: 650 }} rowKey={(record) => record.id} dataSource={data} />
  );
}

export default OrderTable;
