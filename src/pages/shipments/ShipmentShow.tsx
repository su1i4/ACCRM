import React from "react";
import { DeleteButton, EditButton, Show, TextField, useTable } from "@refinedev/antd";
import { useMany, useShow } from "@refinedev/core";
import { Typography, Row, Col, Table } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router";

const { Title } = Typography;

const ShipmentShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const { id } = useParams();
  const record = data?.data;

  console.log(Number(id));

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
          value: Number(id),
        },
        {
          field: "status",
          operator: "eq",
          value: "В пути",
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

  console.log(data);

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
          <TextField value={record?.boxCode} />
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
          <TextField value={record?.density} />
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
          dataIndex="counterparty"
          title="Код получателя"
          render={(value) => value.clientCode}
        />

        <Table.Column dataIndex="status" title="Статус" />
        <Table.Column
          dataIndex="counterparty"
          render={(value) =>
            `${value?.branch?.name},${value?.under_branch?.address || ""}`
          }
          title="Пункт назначения, Пвз"
        />
        <Table.Column dataIndex="weight" title="Вес" />
        {/* Добавьте остальные необходимые колонки */}
      </Table>
    </Show>
  );
};

export default ShipmentShow;
