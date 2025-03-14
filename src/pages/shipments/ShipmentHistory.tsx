import { ArrowDownOutlined, ArrowUpOutlined, SearchOutlined } from "@ant-design/icons";
import { List, useTable } from "@refinedev/antd";
import { useNavigation, useCustom } from "@refinedev/core";
import { Button, Flex, Input, Table, Typography } from "antd";
import { useState, useEffect } from "react";
import { API_URL } from "../../App";

export const ShipmentHistory = () => {
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
    s: JSON.stringify({ $and: [...filters, { status: { $eq: "Выгрузили" } }] }),
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

  console.log(data);

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

  const {push} = useNavigation();

  return (
    <List headerButtons={() => false}>
      <Flex gap={10} style={{ width: "100%", marginBottom: 10 }}>
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
      </Flex>
      <Table
        onRow={(record) => ({
          onDoubleClick: () => {
            push(`/shipments/history/show/${record.id}`);
          },
        })}
        {...tableProps}
        rowKey="id"
        scroll={{ x: "max-content" }}
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