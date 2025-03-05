import { List, useTable } from "@refinedev/antd";
import {
  Space,
  Table,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Card,
  Modal,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FileAddOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import {
  useMany,
  useNavigation,
  useUpdate,
  useUpdateMany,
} from "@refinedev/core";
import dayjs from "dayjs";

export const GoogsProcessingList = () => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { tableProps, setFilters, setSorters, sorters } = useTable({
    syncWithLocation: false,
    sorters: {
      permanent: [
        {
          field: "id",
          order: "desc",
        },
      ],
    },
  });

  const [sortVisible, setSortVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  interface Query {
    s?: string;
    sort?: string | string[];
    limit?: number;
    page?: number;
    offset?: number;
  }

  const [query, setQuery] = useState<Query>({
    s: JSON.stringify({ $and: [{ trackCode: { $contL: "" } }] }),
    sort: ["created_at,DESC"],
    limit: 10,
    page: 1,
    offset: 0,
  });

  const toggleSort = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);
    setQuery((prevQuery: Query) => ({
      ...prevQuery,
      sort: [`created_at,${newOrder}`],
    }));
  };

  const sortContent = (
    <Card style={{ width: 200, padding: "12px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ marginBottom: "8px", color: "#666", fontSize: "14px" }}>
          Сортировать по
        </div>

        <Button type="text" style={{ textAlign: "left" }} onClick={toggleSort}>
          Дата создания ({sortOrder === "desc" ? "↓" : "↑"})
        </Button>

        <Button
          type="text"
          style={{ textAlign: "left" }}
          // onClick={() => setSorters([{ order: 'asc' }])}
        >
          От А до Я
        </Button>

        <Button
          type="text"
          style={{ textAlign: "left" }}
          //   onClick={() => setSorters([{ order: 'desc' }])}
        >
          От Я до А
        </Button>
      </div>
    </Card>
  );

  const datePickerContent = (
    <DatePicker.RangePicker
      style={{ width: "280px" }}
      placeholder={["Начальная дата", "Конечная дата"]}
      onChange={(dates, dateStrings) => {
        if (dates) {
          setFilters([
            {
              field: "created_at",
              operator: "gte",
              value: dateStrings[0],
            },
            {
              field: "created_at",
              operator: "lte",
              value: dateStrings[1],
            },
          ]);
        }
      }}
    />
  );

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (tableProps?.dataSource) {
      const visibleIds = tableProps.dataSource
        .filter((item: any) => item.visible)
        .map((item: any) => item.id);
      setSelectedRowKeys(visibleIds);
    }
  }, [tableProps.dataSource]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedKeys);
    },
  };

  const { mutateAsync: update } = useUpdate();

  const handleSaveChanges = async () => {
    const selectedItems = (tableProps.dataSource || []).map((item: any) => ({
      id: item.id,
      visible: selectedRowKeys.includes(item.id),
    }));

    try {
      await Promise.all(
        selectedItems.map((item) =>
          update({
            resource: "goods-processing",
            id: item.id,
            values: { visible: item.visible },
          })
        )
      );
      console.log("Все обновления прошли успешно");
    } catch (error) {
      console.error("Ошибка при обновлении", error);
    }
  };

  const checkboxContent = (
    <Card style={{ padding: 10 }}>
      <Button onClick={handleSaveChanges}>Показать клиенту</Button>
    </Card>
  );

  const { show, push } = useNavigation();

  return (
    <List headerButtons={() => false}>
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space size="middle">
            <Button
              icon={<FileAddOutlined />}
              style={{}}
              onClick={() => push("/goods-processing/create")}
            />
            <Dropdown
              overlay={sortContent}
              trigger={["click"]}
              placement="bottomLeft"
              visible={sortVisible}
              onVisibleChange={(visible) => {
                setSortVisible(visible);
                if (visible) {
                  setSortVisible(true);
                }
              }}
            >
              <Button
                icon={
                  sortDirection === "asc" ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )
                }
              />
            </Dropdown>
            <Dropdown
              overlay={checkboxContent}
              trigger={["click"]}
              placement="bottomLeft"
              visible={settingVisible}
              onVisibleChange={(visible) => {
                setSettingVisible(visible);
                if (visible) {
                  setSettingVisible(true);
                }
              }}
            >
              <Button icon={<SettingOutlined />} />
            </Dropdown>
          </Space>
        </Col>
        <Col flex="auto">
          <Input
            placeholder="Поиск по треку, клиенту или заказу"
            prefix={<SearchOutlined />}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) {
                setFilters([], "replace");
                return;
              }
              setFilters(
                [
                  {
                    operator: "or",
                    value: [
                      {
                        field: "trackCode",
                        operator: "contains",
                        value,
                      },
                      {
                        field: "counterparty.clientCode",
                        operator: "contains",
                        value,
                      },
                      {
                        field: "counterparty.name",
                        operator: "contains",
                        value,
                      },
                    ],
                  },
                ],
                "replace"
              );
            }}
          />
        </Col>
        <Col>
          <Dropdown
            overlay={datePickerContent}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button icon={<CalendarOutlined />} className="date-picker-button">
              Дата
            </Button>
          </Dropdown>
        </Col>
      </Row>

      <Modal
        title="Новая спецификация"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Треккод">
            <Input />
          </Form.Item>
          <Form.Item label="Тип груза">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record) => ({
          onDoubleClick: () => {
            show("goods-processing", record.id as number);
          },
        })}
        rowSelection={rowSelection}
      >
        <Table.Column
          dataIndex="created_at"
          title="Дата"
          render={(value) =>
            value ? dayjs(value).format("DD.MM.YYYY HH:MM") : ""
          }
        />
        <Table.Column dataIndex="trackCode" title="Треккод" />
        <Table.Column dataIndex="cargoType" title="Тип груза" />
        <Table.Column
          dataIndex="counterparty"
          title="Код получателя"
          render={(value) => {
            return value?.clientPrefix + "-" + value?.clientCode;
          }}
        />
        <Table.Column
          dataIndex="counterparty"
          title="ФИО получателя"
          render={(value) => value?.name}
        />
        <Table.Column
          dataIndex="counterparty"
          render={(value) =>
            `${value?.branch?.name},${value?.under_branch?.address || ""}`
          }
          title="Пункт назначения, Пвз"
        />
        <Table.Column dataIndex="weight" title="Вес" />
        <Table.Column dataIndex="amount" title="Сумма" />
        <Table.Column dataIndex="discount" title="Скидка" />
        <Table.Column dataIndex="paymentMethod" title="Способ оплаты" />
        <Table.Column
          dataIndex="employee"
          title="Сотрудник"
          render={(value) => {
            return `${value?.firstName}-${value?.lastName}`;
          }}
        />
        <Table.Column dataIndex="comments" title="Комментарий" />
      </Table>
    </List>
  );
};
