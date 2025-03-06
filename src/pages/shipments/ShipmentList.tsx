import { List, useTable } from "@refinedev/antd";
import { useNavigation, useCustom } from "@refinedev/core";
import { Table, Typography } from "antd";
import { useState, useEffect } from "react";

const ShipmentList = () => {
  const [countGoods, setCountGoods] = useState(0);

  // Get the shipments data with pagination
  const { tableProps } = useTable({
    resource: "shipments",
    syncWithLocation: false,
    queryOptions: {
      refetchOnWindowFocus: false,
    },
  });

  // Fetch the metadata directly from the API using useCustom
  const { data: metaData, isLoading: isMetaLoading } = useCustom({
    url: "http://192.168.77.31:5001/api/shipments?page=1&size=10",
    method: "get",
    config: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    queryOptions: {
      enabled: true,
      onSuccess: (data) => {
        console.log("Meta data:", data);
      },
    },
  });

  const { show } = useNavigation();

  // Get all data without pagination to calculate totals
  const { tableProps: customProps } = useTable({
    resource: "shipments",
    pagination: {
      mode: "off",
    },
  });

  // Calculate totals
  const totalWeight = customProps?.dataSource?.reduce(
    (acc, item) => acc + (Number(item.weight) || 0),
    0
  );

  const totalCount = customProps?.dataSource?.reduce(
    (acc, item) => acc + (Number(item.count) || 0),
    0
  );

  return (
    <List>
      <div
        style={{
          border: "1px dashed gainsboro",
          padding: "6px 10px",
          borderRadius: 5,
          marginBottom: 10,
          backgroundColor: "#f9f9f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {!totalWeight ? (
          <Typography.Title level={5} style={{ fontWeight: 400, margin: 0 }}>
            Загрузка итогов...
          </Typography.Title>
        ) : (
          <>
            <Typography.Text style={{ fontSize: 14 }}>
              Общий вес: <strong>{totalWeight} кг</strong>
            </Typography.Text>
            <Typography.Text style={{ fontSize: 14 }}>
              {/* @ts-ignore */}
              Количество рейсов: <strong>{tableProps.pagination?.total}</strong>
            </Typography.Text>
            <Typography.Text style={{ fontSize: 14 }}>
              Количество посылок: <strong>{countGoods}</strong>
            </Typography.Text>
          </>
        )}
      </div>

      <Table
        onRow={(record) => ({
          onDoubleClick: () => {
            show("shipments", record.id as number);
          },
        })}
        {...tableProps}
        rowKey="id"
      >
        <Table.Column
          dataIndex="created_at"
          title={"Дата отправки"}
          width={120}
          render={(value) => {
            return `${value?.split("T")[0]} ${value
              ?.split("T")[1]
              ?.slice(0, 5)}`;
          }}
        />
        <Table.Column dataIndex="id" title={"Номер рейса"} />
        <Table.Column dataIndex="boxCode" title={"Код коробки"} />
        <Table.Column
          dataIndex="employee"
          title={"Место погрузки"}
          render={(value) => value?.branch?.name}
        />
        <Table.Column dataIndex="count" title={"Количество посылок"} />
        <Table.Column dataIndex="weight" title={"Вес"} />
        <Table.Column
          dataIndex="Dimensions"
          title={"Размеры (Д × Ш × В)"}
          render={(value, record) => {
            return `${record?.width} x ${record?.height} x ${record?.length}`;
          }}
        />
        <Table.Column dataIndex="cube" title={"Куб"} />
        <Table.Column dataIndex="density" title={"Плотность"} />
        <Table.Column dataIndex="type" title={"Тип"} />
        <Table.Column
          render={(value) => value?.name}
          dataIndex="branch"
          title={"Пункт назначения"}
        />
        <Table.Column
          dataIndex="employee"
          title={"Сотрудник"}
          render={(value) => {
            return `${value?.firstName || ""}-${value?.lastName || ""}`;
          }}
        />
      </Table>
    </List>
  );
};

export default ShipmentList;
