import {
  List,
  useTable,
  CreateButton,
  DeleteButton,
  EditButton,
  ShowButton,
  useSelect,
} from "@refinedev/antd";
import { BaseRecord, useGo, useUpdate } from "@refinedev/core";
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
  Image,
  Menu,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  SwapOutlined,
  HistoryOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  FileAddFilled,
  FileAddOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  FileOutlined,
  EditOutlined,
  UnorderedListOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { useMany, useNavigation, useUpdateMany } from "@refinedev/core";
import { API_URL } from "../../App";
import dayjs from "dayjs";
import { MyCreateModal } from "../counterparties/modal/create-modal";
import { divider } from "@uiw/react-md-editor";

export const RemainingStockProcessingList = () => {
  const { tableProps, setFilters, setSorter } = useTable({
    syncWithLocation: true,
    resource: "goods-processing",
    filters: {
      permanent: [
        {
          field: "status",
          operator: "contains",
          value: "В Складе",
        },
        {
          field: "status",
          operator: "contains",
          value: "Готов к выдаче",
        },
      ],
    },
  });
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const { create } = useNavigation();
  const { mutate: updateMany } = useUpdateMany();
  const go = useGo();

  const sortContent = (
    <Card style={{ width: 200, padding: "12px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ marginBottom: "8px", color: "#666", fontSize: "14px" }}>
          Сортировать по
        </div>
        {/* Сортировка по дате создания */}
        <Button
          type="text"
          style={{ textAlign: "left" }}
          onClick={() => setSorter([{ field: "created_at", order: "desc" }])}
        >
          Дата создания
        </Button>
        {/* Предположим, что filter содержит название поля для алфавитной сортировки, например "name" */}
        <Button
          type="text"
          style={{ textAlign: "left" }}
          // onClick={() => setSorter([{ field: filter, order: 'asc' }])}
        >
          От А до Я
        </Button>
        <Button
          type="text"
          style={{ textAlign: "left" }}
          // onClick={() => setSorter([{ field: filter, order: 'desc' }])}
        >
          От Я до А
        </Button>
        {/* Сортировка по статусу */}
        <Button
          type="text"
          style={{ textAlign: "left" }}
          onClick={() => setSorter([{ field: "status", order: "asc" }])}
        >
          Статус
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
    setIsModalVisible1(true);
  };

  const handleOk = () => {
    console.log("Добавление новой спецификации");
    setIsModalVisible1(false);
  };

  const handleCancel = () => {
    setIsModalVisible1(false);
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
      console.log("Массовое изменение элементов:", selectedRowKeys);
    } else {
      alert("Выберите элементы для массового изменения");
    }
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

  const { selectProps: branchSelectProps } = useSelect({
    resource: "branch",
    optionLabel: "name",
  });

  const { push } = useNavigation();

  const [isModalVisibleTransfer, setIsModalVisibleTransfer] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [selectedRecord, setSelectedRecord] = useState<BaseRecord | null>(null);
  const { mutate } = useUpdate({
    resource: "goods-processing",
  });

  const handleSelectChange = (value: string, record: BaseRecord) => {
    setSelectedBranch(value);
    setSelectedRecord(record);
    setIsModalVisible1(true);
  };

  const handleConfirm = (id: any) => {
    console.log(selectedRecord);
    mutate({
      id: id,
      values: {
        transfer: true,
        transfer_id: selectedBranch,
      },
    });

    setIsModalVisible1(false);
  };

  const handleConfirmTransfer = (record: any) => {
    mutate({
      id: record.id,
      values: {
        transfer: false,
        branch_id: record.transfer_id,
      },
    });
  };

  return (
    <List headerButtons={() => false}>
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space size="middle">
            <Dropdown
              overlay={sortContent}
              trigger={["click"]}
              placement="bottomLeft"
              visible={sortVisible}
              onVisibleChange={(visible) => {
                setSortVisible(visible);
                if (visible) {
                  setFilterVisible(true);
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
            <Button
              icon={<SyncOutlined />}
              style={{}}
              onClick={() => {
                setSelectedBranch(undefined); // сброс значения Select
                setFilters([], "replace"); // сброс фильтров
              }}
            />
          </Space>
        </Col>
        <Col flex="auto">
          <Input
            style={{ width: 500 }}
            placeholder="Поиск по трек-коду, ФИО получателя или по коду получателя"
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
          <Select
            {...branchSelectProps}
            placeholder="Выберите филиал"
            style={{ width: 300 }}
            value={selectedBranch}
            onChange={(e) => {
              setSelectedBranch(e);
              setFilters(
                [
                  {
                    field: "counterparty.branch_id",
                    operator: "eq",
                    value: e,
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
        visible={false}
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
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys, selectedRows) => {
            console.log("selectedRowKeys:", selectedRowKeys);
            console.log("selectedRows:", selectedRows);
          },
        }}
      >
        <Table.Column
          dataIndex="created_at"
          title="Дата"
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
            return `${value?.clientPrefix}-${value?.clientCode}`;
          }}
        />
        <Table.Column
          dataIndex="counterparty_id"
          title="ФИО получателя"
          render={(value) => {
            if (counterpartyIsLoading) {
              return <>Loading....</>;
            }

            const counterparty = counterpartyData?.data?.find(
              (item) => item.id === value
            );
            return counterparty ? `${counterparty.name}` : null;
          }}
        />
        <Table.Column
          render={(value) => value?.name}
          dataIndex="branch"
          title={"Пункт назначения"}
        />
        <Table.Column dataIndex="weight" title="Вес" />
        <Table.Column dataIndex="amount" title="Сумма" />
        <Table.Column dataIndex="paymentMethod" title="Способ оплаты" />
        <Table.Column
          dataIndex="employee_id"
          title="Сотрудник"
          render={(value) => {
            if (userIsLoading) {
              return <>Loading....</>;
            }
            const user = userData?.data?.find((item) => item.id === value);
            return user ? `${user.firstName} ${user.lastName}` : null;
          }}
        />
        <Table.Column
          dataIndex={"branch_id"}
          title={"Филиал"}
          render={(value) =>
            branchIsLoading ? (
              <>Loading...</>
            ) : (
              branchData?.data?.find((item) => item.id === value)?.name
            )
          }
        />
        <Table.Column dataIndex="comments" title="Комментарий" />
        <Table.Column
          dataIndex="photo"
          title="Фото"
          render={(photo) =>
            photo ? (
              <Image
                width={30}
                height={30}
                src={API_URL.replace("/api", "") + "/" + photo}
              />
            ) : null
          }
        />

        <Table.Column dataIndex="status" title="Статус" />

        <Table.Column
          title="Переместить"
          dataIndex="actions"
          render={(_, record: BaseRecord) => {
            return record.transfer ? (
              <Button
                type="dashed"
                onClick={() => handleConfirmTransfer(record)}
              >
                Подвердит
              </Button>
            ) : (
              <>
                <Select
                  {...branchSelectProps}
                  style={{ width: 200 }}
                  // @ts-ignore
                  onChange={(value) => handleSelectChange(value, record)}
                />

                <Modal
                  title="Подтверждение перемещения"
                  open={isModalVisible1}
                  onOk={() => handleConfirm(record.id)}
                  onCancel={() => setIsModalVisible1(false)}
                  okText="Переместить"
                  cancelText="Отмена"
                >
                  <p>Вы уверены, что хотите переместить товар</p>
                </Modal>
              </>
            );
          }}
        />
      </Table>
    </List>
  );
};
