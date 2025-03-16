import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { CreateButton, List, useTable } from "@refinedev/antd";
import { useNavigation, useCustom } from "@refinedev/core";
import { Button, Flex, Input, Table, Typography } from "antd";
import { useState, useEffect } from "react";
import { API_URL } from "../../App";
import { CustomTooltip } from "../../shared";

const ShipmentList = () => {
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<any[]>([]);
  const { show } = useNavigation();

  const buildQueryParams = () => ({
    sort: `id,${sortDirection}`,
    page: current - 1,
    limit: pageSize,
    offset: (current - 1) * pageSize,
    s: JSON.stringify({ $and: [...filters, { status: { $eq: "В пути" } }] }),
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
  }, [sortDirection, current, pageSize]);

  const dataSource = data?.data?.data || [];
  const total = data?.data?.total || 0;

  const tableProps = {
    dataSource,
    loading: isLoading,
    pagination: {
      current,
      pageSize,
      total,
      onChange: (page: number, size: number) => {
        setCurrent(page);
        setPageSize(size);
      },
    },
  };

  const { push } = useNavigation();

  return (
    <List
      headerButtons={(createButtonProps) => {
        return (
          <>
            <Button onClick={() => push("/shipments/history")}>
              История отправлений
            </Button>
            {createButtonProps && (
              <CreateButton {...createButtonProps} meta={{ foo: "bar" }} />
            )}
          </>
        );
      }}
    >
      <Flex gap={10} style={{ width: "100%" }}>
        <CustomTooltip title="Сортировка">
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
            style={{ height: 33, width: 33, minWidth: 33 }}
          />
        </CustomTooltip>
        <Input
          placeholder="Поиск по номеру рейса, коду коробки"
          prefix={<SearchOutlined />}
          style={{ width: "40%", height: 33 }}
          onChange={(e) => {
            const value = e.target.value;
            if (!value) {
              setFilters([]);
              return;
            }

            setFilters([
              {
                $or: [
                  { id: { $contL: value } },
                  { boxCode: { $contL: value } },
                ],
              },
            ]);
          }}
        />
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
            width: "70%",
            height: 33,
            boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          {false ? (
            <Typography.Title level={5} style={{ fontWeight: 400, margin: 0 }}>
              Загрузка итогов...
            </Typography.Title>
          ) : (
            <>
              <Typography.Text style={{ fontSize: 14 }}>
                Общий вес: <strong>20 кг</strong>
              </Typography.Text>
              <Typography.Text style={{ fontSize: 14 }}>
                {/* @ts-ignore */}
                Количество рейсов:{" "}
                <strong>{tableProps.pagination?.total}</strong>
              </Typography.Text>
              <Typography.Text style={{ fontSize: 14 }}>
                Количество посылок: <strong>20</strong>
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
        scroll={{ x: 1500 }}
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
        <Table.Column dataIndex="truck_number" title={"Номер фуры"} />
        <Table.Column
          dataIndex="employee"
          title={"Место погрузки"}
          render={(value) => value?.branch?.name}
        />
        <Table.Column dataIndex="count" title={"Количество посылок"} />
        <Table.Column
          dataIndex="weight"
          title={"Вес"}
          render={(value) => (
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {value} кг
            </p>
          )}
        />
        <Table.Column
          dataIndex="Dimensions"
          title={"Размеры (Д × Ш × В)"}
          render={(value, record) => {
            return `${record?.length} x ${record?.width} x ${record?.height}`;
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
        <Table.Column dataIndex="status" title={"Статус"} />
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
