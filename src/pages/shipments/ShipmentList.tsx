import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { List, useTable } from "@refinedev/antd";
import { useNavigation, useCustom } from "@refinedev/core";
import { Button, Flex, Table, Typography } from "antd";
import { useState, useEffect } from "react";
import { API_URL } from "../../App";

const ShipmentList = () => {
  const [countGoods, setCountGoods] = useState(0);
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

  const { show } = useNavigation();

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

  const buildQueryParams = () => ({
    sort: `id,${sortDirection}`,
  });

  const { data, isLoading, refetch } = useCustom<any>({
    url: `${API_URL}/shipments`,
    method: "get",
    config: {
      query: buildQueryParams(),
    },
  });

  useEffect(() => {
    refetch();
  }, [sortDirection]);

  const dataSource = data?.data || [];

  const tableProps = {
    dataSource,
    loading: isLoading,
    pagination: {
      total: data?.data?.total || 0,
    },
  };


  return (
    <List>
      <Flex gap={10} style={{ width: "100%" }}>
        <Button
          icon={
            sortDirection === "ASC" ? (
              <ArrowUpOutlined />
            ) : (
              <ArrowDownOutlined />
            )
          }
          onClick={() => {
            setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
          }}
        >
          {/* {sortField === "id" ? "Дата" : "Имя"} */}
        </Button>
        <div
          style={{
            border: "1px dashed gainsboro",
            padding: "4px 10px",
            borderRadius: 5,
            marginBottom: 10,
            backgroundColor: "#f9f9f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          {!customProps?.dataSource ? (
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
                Количество рейсов:{" "}
                <strong>{tableProps.pagination?.total}</strong>
              </Typography.Text>
              <Typography.Text style={{ fontSize: 14 }}>
                Количество посылок: <strong>{countGoods}</strong>
              </Typography.Text>
            </>
          )}
        </div>
      </Flex>
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
