import React, { useState } from "react";
import { DeleteButton, EditButton, Show, TextField, useTable } from "@refinedev/antd";
import { useUpdateMany, useParsed, useShow, useMany } from "@refinedev/core";
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

  return (
    <Show
      headerButtons={({
        deleteButtonProps,
        editButtonProps,
        listButtonProps,
        refreshButtonProps,
      }) => (
        <>
          {editButtonProps && (
            <EditButton {...editButtonProps} meta={{ foo: "bar" }} />
          )}
          {deleteButtonProps && (
            <DeleteButton {...deleteButtonProps} meta={{ foo: "bar" }} />
          )}
        </>
      )}
      isLoading={isLoading}
    >
      {/* Данные о текущем рейсе */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Title level={5}>ID</Title>
          <TextField value={record?.id} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Номер рейса</Title>
          <TextField value={record?.flightNumber} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Пункт назначения</Title>
          <TextField value={branch?.name} />
        </Col>

        <Col xs={24} md={6}>
          <Title level={5}>Дата</Title>
          <TextField
            value={dayjs(record?.created_at).format("DD.MM.YYYY HH:mm")}
          />
        </Col>

        <Col xs={24} md={6}>
          <Title level={5}>Количество мест</Title>
          <TextField value={totalRecords} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Вес</Title>
          <TextField value={record?.weight} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Куб</Title>
          <TextField value={record?.cube} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Сотрудник</Title>
          <TextField value={user?.firstName + " " + user?.lastName} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Тип</Title>
          <TextField value={record?.type} />
        </Col>
      </Row>

      <Title level={4} style={{ marginTop: 24 }}>
        Товары в этом рейсе
      </Title>

      {/* Кнопки массового изменения статуса */}
      <Space style={{ marginBottom: 16 }}>
        <Button
          onClick={handleSetReadyToIssue}
          disabled={selectedRowKeys.length === 0 || isUpdating}
        >
          Принять
        </Button>
      </Space>

      {/* Таблица со списком товаров и чекбоксами */}
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
