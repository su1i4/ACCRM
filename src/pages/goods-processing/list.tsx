import { List, useTable } from "@refinedev/antd";
import {
  Space,
  Table,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Checkbox,
  Dropdown,
  Select,
  Form,
  Card,
  Modal,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  SwapOutlined,
  HistoryOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FileAddOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { SyncOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useMany, useNavigation, useUpdateMany } from "@refinedev/core";
import dayjs from "dayjs";

export const GoogsProcessingList = () => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { tableProps, setFilters, setSorters, sorters } = useTable({
    syncWithLocation: false,
    sorters: {
      initial: [
        {
          field: "created_at",
          order: "desc",
        },
      ],
    },
  });

  const [sortVisible, setSortVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any>({});
  const { mutate: updateMany } = useUpdateMany();

  useEffect(() => {
    // if (tableProps.dataSource?.length && selectedItems.length) {
    let lom = {};
    tableProps.dataSource?.forEach((item: any) => {
      if (item.visible) {
        //@ts-ignore
        lom[item.id] = true;
      }
    });
    setSelectedItems(lom);
    // }
  }, [tableProps.dataSource]);

  console.log(selectedItems);

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
      // если нужно передать только одну сортировку:
      sort: [`created_at,${newOrder}`],
      // если требуется добавить дополнительную сортировку, например по id:
      // sort: [`created_at,${newOrder}`, "id,DESC"],
    }));
  };

  const sortContent = (
    <Card style={{ width: 200, padding: "12px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ marginBottom: "8px", color: "#666", fontSize: "14px" }}>
          Сортировать по
        </div>
        {/* Сортировка по дате создания */}

        <Button type="text" style={{ textAlign: "left" }} onClick={toggleSort}>
          Дата создания ({sortOrder === "desc" ? "↓" : "↑"})
        </Button>
        {/* Предположим, что filter содержит название поля для алфавитной сортировки, например "name" */}

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

  const filterContent = (
    <Card style={{ width: 300, padding: "12px", border: "1px solid #f0f0f0" }}>
      <Form layout="vertical">
        <Form.Item label="Филиалы">
          <Input
            placeholder="Выберите город"
            prefix={<SearchOutlined />}
            style={{ marginBottom: "8px" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            <Checkbox.Group style={{ width: "100%" }}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <Checkbox value="guangzhou">Гуанчжоу</Checkbox>
                <Checkbox value="bishkek">Бишкек</Checkbox>
                <Checkbox value="osh">Ош</Checkbox>
              </div>
            </Checkbox.Group>
          </div>
        </Form.Item>

        <Form.Item label="Дата">
          <Row gutter={8}>
            <Col span={11}>
              <Select placeholder="От" style={{ width: "100%" }}>
                <Select.Option value="today">Сегодня</Select.Option>
                <Select.Option value="yesterday">Вчера</Select.Option>
                <Select.Option value="week">Неделя</Select.Option>
              </Select>
            </Col>
            <Col span={11} offset={2}>
              <Select placeholder="До" style={{ width: "100%" }}>
                <Select.Option value="today">Сегодня</Select.Option>
                <Select.Option value="tomorrow">Завтра</Select.Option>
                <Select.Option value="week">Неделя</Select.Option>
              </Select>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="Поиск по трек-коду">
          <Input
            placeholder="Введите номер трек-кода"
            prefix={<SearchOutlined />}
          />
        </Form.Item>

        <Form.Item label="Отбор и сортировка">
          <Space>
            <Dropdown overlay={sortContent} trigger={["click"]}>
              <Button icon={<SwapOutlined />}>Сортировка</Button>
            </Dropdown>
            <Button icon={<HistoryOutlined />}>История</Button>
          </Space>
        </Form.Item>
      </Form>
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleBulkEdit = () => {
    const selectedRowKeys = tableProps.rowSelection?.selectedRowKeys;
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      updateMany({
        resource: "goods",
        // @ts-ignore
        ids: selectedRowKeys,
        values: {
          /* новые значения для всех полей */
        },
      });
    } else {
      alert("Выберите элементы для массового изменения");
    }
  };

  const handleSaveChanges = () => {
    const ids = Object.keys(selectedItems);

    const firstId = ids[0];
    const visibilityValue = selectedItems[firstId];

    updateMany({
      resource: "goods-processing",
      ids,
      values: { visible: visibilityValue },
    });
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

  const { data: userData, isLoading: userIsLoading } = useMany({
    resource: "users",
    ids:
      tableProps?.dataSource?.map((item) => item?.user?.id).filter(Boolean) ??
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

  const checkboxContent = (
    <Card>
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
            {/* <Button icon={<SyncOutlined />} /> */}
          </Space>
        </Col>
        <Col flex="auto">
          <Input
            placeholder="Поиск по трек-коду или коду клиента"
            prefix={<SearchOutlined />}
            onChange={(e) => {
              setFilters([
                {
                  field: "trackCode",
                  operator: "contains",
                  value: e.target.value,
                },
              ]);
            }}
          />
        </Col>
        <Col>
          {/* <Select */}
          {/*    mode="multiple"*/}
          {/*    placeholder="Выберите филиал"*/}
          {/*    style={{ width: 200 }}*/}
          {/*    onChange={(value) => {*/}
          {/*        setFilters([*/}
          {/*            {*/}
          {/*                field: "branch",*/}
          {/*                operator: "in",*/}
          {/*                value,*/}
          {/*            },*/}
          {/*        ]);*/}
          {/*    }}*/}
          {/*    options={[*/}
          {/*        { label: 'Гуанчжоу', value: 'guangzhou' },*/}
          {/*        { label: 'Бишкек', value: 'bishkek' },*/}
          {/*        { label: 'Ош', value: 'osh' },*/}
          {/*    ]}*/}
          {/*/> */}
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
      >
        <Table.Column
          dataIndex="visible"
          title={
            <Checkbox
              onChange={(e) => {
                const isChecked = e.target.checked;
                const newSelectedItems = {};

                // For all rows in the table, set their ID to true when checked
                if (isChecked) {
                  //@ts-ignore
                  tableProps.dataSource.forEach((row) => {
                    //@ts-ignore
                    newSelectedItems[row.id] = true;
                  });
                }
                // Otherwise leave the object empty when unchecking all

                setSelectedItems(newSelectedItems);

                // Update selectedRowKeys if you're using row selection
                if (isChecked) {
                  //@ts-ignore
                  setSelectedRowKeys(
                    //@ts-ignore
                    tableProps.dataSource.map((row) => row.id)
                  );
                } else {
                  //@ts-ignore
                  setSelectedRowKeys([]);
                }
              }}
              // Header checkbox is checked if we have selected items matching data length
              checked={
                Object.keys(selectedItems).length > 0 &&
                Object.keys(selectedItems).length ===
                  //@ts-ignore
                  tableProps.dataSource.length
              }
              // Indeterminate if some but not all rows are selected
              indeterminate={
                Object.keys(selectedItems).length > 0 &&
                //@ts-ignore
                Object.keys(selectedItems).length < tableProps.dataSource.length
              }
            />
          }
          render={(value, record) => (
            //@ts-ignore
            <Checkbox
              onChange={(e) => {
                const checked = e.target.checked;
                if (checked) {
                  // When checking a box, add it to the selected items
                  setSelectedItems((prev: any) => ({
                    ...prev,
                    [record.id]: true,
                  }));
                } else {
                  // When unchecking, remove it from selected items
                  const newSelectedItems = { ...selectedItems };
                  delete newSelectedItems[record.id];
                  setSelectedItems(newSelectedItems);
                }
              }}
              checked={!!selectedItems[record.id]}
            />
          )}
        />
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
          dataIndex="counterparty_id"
          title="Код получателя"
          render={(value, record, index) => {
            return (
              record?.counterparty?.clientPrefix +
              "-" +
              record?.counterparty?.clientCode
            );
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
