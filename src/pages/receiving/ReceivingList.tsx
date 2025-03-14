import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useSelect,
  useTable,
} from "@refinedev/antd";
import {
  type BaseRecord,
  useMany,
  useNavigation,
  useCustom,
} from "@refinedev/core";
import { Button, Space, Table, Flex, Typography, Input } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { API_URL } from "../../App";
import dayjs from "dayjs";

const ReceivingList = () => {
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<any[]>([]);

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

  const { push, show } = useNavigation();

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
          style={{
            width: 33,
            minWidth: 33,
          }}
        >
          {/* Сортировка по дате */}
        </Button>
        <Input
          placeholder="Поиск по номеру рейса, коду коробки"
          prefix={<SearchOutlined />}
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
        <Button onClick={() => push("/receiving/history")}>
          История получений
        </Button>
      </Flex>
      <Table
        onRow={(record) => ({
          onDoubleClick: () => {
            // Переход в детальный вид по идентификатору записи
            show("receiving", record.id as number);
          },
        })}
        {...tableProps}
        rowKey="id"
        scroll={{ x: "max-content" }}
      >
        <Table.Column
          dataIndex="updated_at"
          title={"Дата получения"}
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
          render={(value, record, index) => {
            return `${record.width} x ${record.height} x ${record.length}`;
          }}
        />
        <Table.Column dataIndex="cube" title={"Куб"} />
        <Table.Column dataIndex="density" title={"Плотность"} />¥
        <Table.Column dataIndex="type" title={"Тип"} />
        <Table.Column
          render={(value) => value.name}
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

export default ReceivingList;
