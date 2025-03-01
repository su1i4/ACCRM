import React, { useState } from "react";
import {
  DeleteButton,
  EditButton,
  Show,
  TextField,
  useTable,
} from "@refinedev/antd";
import {
  useUpdateMany,
  useParsed,
  useShow,
  useMany,
  useNavigation,
} from "@refinedev/core";
import { Typography, Row, Col, Table, Button, Space } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

const ReceivingShow = () => {
  // Получаем ID из URL (например, /shipments/show/123)
  const { id } = useParsed();

  // Запрашиваем данные о конкретном рейсе (shipment) по ID
  const { queryResult } = useShow({
    resource: "shipments",
    id,
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  // Получаем список товаров (goods-processing),
  // отфильтрованных по текущему shipment_id
  const { tableProps } = useTable({
    resource: "goods-processing",
    syncWithLocation: false,
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    filters: {
      initial: [
        {
          field: "shipment_id",
          operator: "eq",
          value: record?.id,
        },
        {
          field: "status",
          operator: "eq",
          value: "В пути",
        },
      ],
    },
  });

  // -----------------------
  // 1. Состояние для выделенных строк
  // -----------------------
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Настройка антовского rowSelection
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedKeys);
    },
  };

  // -----------------------
  // 2. Массовое обновление
  // -----------------------
  const { mutate, isLoading: isUpdating } = useUpdateMany();

  const handleSetReadyToIssue = () => {
    mutate(
      {
        resource: "goods-processing",
        // @ts-ignore
        ids: selectedRowKeys,
        values: { status: "Готов к выдаче" },
      },
      {
        onSuccess: () => {
          setSelectedRowKeys([]);
        },
      }
    );
  };

  const { data: branchData, isLoading: branchIsLoading } = useMany({
    resource: "branch",
    ids:
      tableProps?.dataSource?.map((item) => item?.branch?.id).filter(Boolean) ??
      [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const { data: usersData, isLoading: usersIsLoading } = useMany({
    resource: "users",
    ids:
      tableProps?.dataSource?.map((item) => item?.branch?.id).filter(Boolean) ??
      [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const { data: counterpartyData, isLoading: counterpartyIsLoading } = useMany({
    resource: "counterparty",
    ids:
      tableProps?.dataSource
        ?.map((item) => item?.counterparty?.id)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const branch = branchData?.data?.find(
    (item) => item.id === record?.branch_id
  );
  const user = usersData?.data?.find((item) => item.id === record?.user_id);
  // @ts-ignore
  const totalRecords = tableProps.pagination.total || 0;

  const { show, push } = useNavigation();

  return (
    <Show headerButtons={() => false} isLoading={isLoading}>
      <Table {...tableProps} rowKey="id" rowSelection={rowSelection}>
        <Table.Column dataIndex="receptionDate" title="Дата" />
        <Table.Column dataIndex="cargoType" title="ТПН" />
        <Table.Column dataIndex="trackCode" title="Треккод" />
        <Table.Column dataIndex="clientCode" title="Код Клиента" />
        <Table.Column dataIndex="recipient" title="Получатель" />
        <Table.Column dataIndex="city" title="Город" />
        <Table.Column dataIndex="weight" title="Вес" />
        <Table.Column dataIndex="status" title="Статус" />
      </Table>
    </Show>
  );
};

export default ReceivingShow;
