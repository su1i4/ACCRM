import { List, DeleteButton, ShowButton } from "@refinedev/antd";
import {
  BaseRecord,
  useNavigation,
  useUpdateMany,
  useCustom,
  useShow,
} from "@refinedev/core";
import {
  Space,
  Table,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Form,
  Card,
  Image,
  Flex,
  Dropdown,
  Typography,
} from "antd";
import {
  SearchOutlined,
  CheckOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { API_URL } from "../../App";
import type { Key } from "react";

interface Filter {
  status?: { $eq: string };
  $or?: Array<{
    trackCode?: { $contL: string };
    "counterparty.clientCode"?: { $contL: string };
    "counterparty.name"?: { $contL: string };
  }>;
  created_at?: {
    $gte: string;
    $lte: string;
  };
}

export const IssueProcessingList = () => {
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [sortField, setSortField] = useState<"id" | "counterparty.name">("id");
  const [searchFilters, setSearchFilters] = useState<Filter[]>([
    { status: { $eq: "Готов к выдаче" } },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const buildQueryParams = () => {
    return {
      s: JSON.stringify({ $and: searchFilters }),
      sort: `${sortField},${sortDirection}`,
      limit: pageSize,
      page: currentPage,
      offset: (currentPage - 1) * pageSize,
    };
  };

  const { data, isLoading, refetch } = useCustom<any>({
    url: `${API_URL}/goods-processing`,
    method: "get",
    config: {
      query: buildQueryParams(),
    },
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<BaseRecord[]>([]);
  const { mutate: updateManyGoods } = useUpdateMany({
    resource: "goods-processing",
    mutationOptions: {
      onSuccess: (data, variables, context) => {
        refetch();
        setSelectedRowKeys([]);
      },
    },
  });

  // Обновление статуса для выбранных записей
  const handleAcceptSelected = async () => {
    if (!selectedRowKeys.length) {
      return;
    }
    try {
      updateManyGoods({
        ids: selectedRowKeys as number[],
        values: { status: "Выдали" },
      });
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
    }
  };

  // Обработка выбора строк таблицы
  const handleRowSelectionChange = (
    selectedRowKeys: Key[],
    selectedRows: BaseRecord[],
    info: { type: "all" | "none" | "invert" | "single" | "multiple" }
  ) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  // Функция фильтрации по трек-коду и диапазону дат
  const handleFilter = (values: any) => {
    const filters: Filter[] = [{ status: { $eq: "Готов к выдаче" } }];
    if (values.trackCode) {
      filters.push({
        $or: [
          { trackCode: { $contL: values.trackCode } },
          { "counterparty.clientCode": { $contL: values.trackCode } },
          { "counterparty.name": { $contL: values.trackCode } },
        ],
      });
    }
    if (values.dateRange) {
      filters.push({
        created_at: {
          $gte: dayjs(values.dateRange[0]).format("YYYY-MM-DD"),
          $lte: dayjs(values.dateRange[1]).format("YYYY-MM-DD"),
        },
      });
    }
    setSearchFilters(filters);
  };

  const { push } = useNavigation();

  const sortContent = (
    <Card style={{ width: 200, padding: "0px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div
          style={{
            marginBottom: "8px",
            color: "#666",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          Сортировать по
        </div>
        <Button
          type="text"
          style={{
            textAlign: "left",
            fontWeight: sortField === "id" ? "bold" : "normal",
          }}
          onClick={() => {
            setSortField("id");
            setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
          }}
        >
          Дате создания{" "}
          {sortField === "id" && (sortDirection === "ASC" ? "↑" : "↓")}
        </Button>
        <Button
          type="text"
          style={{
            textAlign: "left",
            fontWeight: sortField === "counterparty.name" ? "bold" : "normal",
          }}
          onClick={() => {
            setSortField("counterparty.name");
            setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
          }}
        >
          По фио{" "}
          {sortField === "counterparty.name" &&
            (sortDirection === "ASC" ? "↑" : "↓")}
        </Button>
      </div>
    </Card>
  );

  const datePickerContent = (
    <DatePicker.RangePicker
      style={{ width: "280px" }}
      placeholder={["Начальная дата", "Конечная дата"]}
      onChange={(dates, dateStrings) => {
        if (dates && dateStrings[0] && dateStrings[1]) {
          // Fixed: Use consistent filter format
          setSearchFilters([
            ...searchFilters,
            {
              created_at: {
                $gte: dateStrings[0],
                $lte: dateStrings[1],
              },
            },
          ]);
        }
      }}
    />
  );

  // Получаем актуальные данные из хука useCustom
  const dataSource = data?.data?.data || [];

  const totalAmount = selectedRows.reduce(
    (acc, row) => acc + Number(row?.amount),
    0
  );

  const totalWeight = selectedRows.reduce(
    (acc, row) => acc + Number(row?.weight),
    0
  );


  return (
    <List>
      {/* Форма фильтрации сверху */}
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Form layout="inline" onFinish={handleFilter}>
            <Dropdown overlay={sortContent} trigger={["click"]}>
              <Button
                style={{ marginRight: 8 }}
                icon={
                  sortDirection === "ASC" ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )
                }
              ></Button>
            </Dropdown>
            <Form.Item name="trackCode">
              <Input
                style={{ width: 500 }}
                placeholder="Поиск по трек-коду, ФИО получателя или по коду получателя"
                prefix={<SearchOutlined />}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value) {
                    setSearchFilters([{ status: { $eq: "Готов к выдаче" } }]);
                    return;
                  }
                  setSearchFilters([
                    { status: { $eq: "Готов к выдаче" } },
                    {
                      $or: [
                        { trackCode: { $contL: value } },
                        { "counterparty.clientCode": { $contL: value } },
                        { "counterparty.name": { $contL: value } },
                      ],
                    },
                  ]);
                }}
              />
            </Form.Item>
            <Form.Item name="dateRange">
              <Dropdown
                overlay={datePickerContent}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button
                  icon={<CalendarOutlined />}
                  className="date-picker-button"
                >
                  Дата
                </Button>
              </Dropdown>
            </Form.Item>
            {/* <Form.Item>
              <Button type="primary" htmlType="submit">
                Применить
              </Button>
            </Form.Item> */}
          </Form>
        </Col>
      </Row>

      {/* Кнопки для действий */}
      <Flex gap={16} style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={handleAcceptSelected}
          disabled={!selectedRowKeys.length}
        >
          Выдать выбранные посылки
        </Button>
        <Button type="primary" onClick={() => push("received")}>
          Выданные посылки
        </Button>
        <div
          style={{
            border: "1px dashed gainsboro",
            padding: "4px 10px",
            borderRadius: 5,
            marginBottom: 10,
            backgroundColor: "#f9f9f9",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            width: "70%",
            height: 32,
            boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography.Text>
            Общая сумма: <strong>{totalAmount}</strong>
          </Typography.Text>{" "}
          |
          <Typography.Text>
            Общий вес: <strong>{totalWeight} кг</strong>
          </Typography.Text>
        </div>
      </Flex>
      <Table
        dataSource={dataSource}
        loading={isLoading}
        rowKey="id"
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: handleRowSelectionChange,
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data?.data?.total || 0,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
        // onRow={(record) => ({
        //   onDoubleClick: () => show("issue", record.id as number),
        // })}
        scroll={{ x: "max-content" }}
      >
        <Table.Column
          dataIndex="created_at"
          title={"Дата поступления"}
          width={120}
          render={(value) =>
            value ? dayjs(value).format("DD.MM.YYYY HH:MM") : ""
          }
        />
        <Table.Column dataIndex="trackCode" title="Трек-код" />
        <Table.Column dataIndex="cargoType" title="Тип груза" />
        <Table.Column
          dataIndex="counterparty"
          title="Код получателя"
          render={(value) => {
            return `${value?.clientPrefix || ""}-${value?.clientCode || ""}`;
          }}
        />
        <Table.Column
          dataIndex="counterparty"
          title="ФИО получателя"
          render={(value) => value?.name}
        />
        <Table.Column
          dataIndex="counterparty"
          render={(value) => (
            <p style={{ width: "200px" }}>
              {`${value?.branch?.name || ""},${
                value?.under_branch?.address || ""
              }`}
            </p>
          )}
          title="Пункт назначения, Пвз"
        />
        <Table.Column dataIndex="weight" title="Вес" />
        <Table.Column dataIndex="amount" title="Сумма" />
        {/* <Table.Column dataIndex="paymentMethod" title="Способ оплаты" /> */}
        {/* <Table.Column
          dataIndex="employee"
          title="Сотрудник"
          render={(value) => {
            return `${value?.firstName || ""}-${value?.lastName || ""}`;
          }}
        /> */}
        {/* <Table.Column
          dataIndex="employee"
          title="Филиал"
          render={(value) => value?.branch?.name}
        /> */}
        <Table.Column dataIndex="comments" title="Комментарий" />
        <Table.Column
          dataIndex="photo"
          title="Фото"
          render={(photo) =>
            photo ? (
              <Image
                width={30}
                height={30}
                src={API_URL + "/" + photo}
              />
            ) : null
          }
        />
        <Table.Column dataIndex="status" title="Статус" />
        {/* <Table.Column
          title="Действия"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        /> */}
      </Table>
    </List>
  );
};
