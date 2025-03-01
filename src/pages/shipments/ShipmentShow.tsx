import React from "react";
import { Show, TextField, useTable } from "@refinedev/antd";
import { useMany, useShow } from "@refinedev/core";
import { Typography, Row, Col, Table } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

const ShipmentShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const record = data?.data;

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
      ],
    },
  });

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
    <Show isLoading={isLoading}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Title level={5}>Номер рейса</Title>
          <TextField value={record?.flightNumber} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Тип груза</Title>
          <TextField value={record?.type} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}> Код коробки</Title>
          <TextField value={branch?.name} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Пункт назначения</Title>
          <TextField value={branch?.name} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Сотрудник</Title>
          <TextField value={user?.firstName + " " + user?.lastName} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Вес</Title>
          <TextField value={record?.weight} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Размеры (Д × Ш × В)</Title>
          <TextField
            value={`${record?.length}_x 
          _${record?.width}_x_${record?.height}`}
          />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Куб</Title>
          <TextField value={record?.cube} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Плотность</Title>
          <TextField value={record?.cube} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Количество мест</Title>
          <TextField value={totalRecords} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Дата</Title>
          <TextField
            value={dayjs(record?.created_at).format("DD.MM.YYYY HH:mm")}
          />
        </Col>
      </Row>

      <Title level={4} style={{ marginTop: 24 }}>
        Товары в этом рейсе
      </Title>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="id" />
        <Table.Column
          dataIndex="created_at"
          title="Дата"
          render={({ created_at }) =>
            dayjs(created_at).format("DD.MM.YYYY HH:mm")
          }
        />
        <Table.Column dataIndex="cargoType" title="ТПН" />
        <Table.Column dataIndex="trackCode" title="Треккод" />

        <Table.Column
          dataIndex="counterparty_id"
          title="Код получателя"
          render={(value) => {
            if (counterpartyIsLoading) {
              return <>Loading....</>;
            }

            const counterparty = counterpartyData?.data?.find(
              (item) => item.id === value
            );
            return counterparty ? `${counterparty.code}` : null;
          }}
        />

        <Table.Column dataIndex="status" title="Статус" />
        <Table.Column dataIndex="weight" title="Город" />
        <Table.Column dataIndex="weight" title="Вес" />
        {/* Добавьте остальные необходимые колонки */}
      </Table>
    </Show>
  );
};

export default ShipmentShow;
