import React, { Key, useEffect, useState } from "react";
import { Create, useSelect, useForm } from "@refinedev/antd";
import { BaseRecord, useCustom, useOne } from "@refinedev/core";
import {
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { PaperClipOutlined } from "@ant-design/icons";
import { API_URL } from "../../App";

export const CashDeskCreate: React.FC = () => {
  const { formProps, saveButtonProps, form } = useForm();

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<BaseRecord[]>([]);
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [sortField, setSortField] = useState<"id" | "counterparty.name">("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useCustom<any>({
    url: `${API_URL}/goods-processing`,
    method: "get",
    config: {
      query: {
        s: JSON.stringify({
          $and: [
            {
              "counterparty.id": {
                $eq: form?.getFieldValue("counterparty_id"),
              },
            },
          ],
        }),
        sort: `${sortField},${sortDirection}`,
        limit: pageSize,
        page: currentPage,
        offset: (currentPage - 1) * pageSize,
      },
    },
  });

  // Сохраняем выбранный id клиента
  const [selectedCounterpartyId, setSelectedCounterpartyId] = useState<
    string | null
  >(null);

  const { selectProps: counterpartySelectProps } = useSelect({
    resource: "counterparty",
    optionLabel: (item) =>
      `${item.name} ${item.clientPrefix}-${item.clientCode}`,
    filters: [
      {
        operator: "or",
        value: [
          { field: "name", operator: "contains", value: "" },
          { field: "clientCode", operator: "contains", value: "" },
          { field: "clientPrefix", operator: "contains", value: "" },
        ],
      },
    ],
    onSearch: (value) => [
      {
        operator: "or",
        value: [
          { field: "name", operator: "contains", value },
          { field: "clientCode", operator: "contains", value },
          { field: "clientPrefix", operator: "contains", value },
        ],
      },
    ],
  });

  const { selectProps: bankSelectProps } = useSelect({
    resource: "bank",
    optionLabel: "name",
  });

  // Получаем данные клиента по выбранному id с помощью useOne
  const {
    data: counterpartyData,
    isLoading: isCounterpartyLoading,
    isError: isCounterpartyError,
  } = useOne({
    resource: "counterparty",
    id: selectedCounterpartyId ?? "",
    queryOptions: {
      enabled: !!selectedCounterpartyId, // Хук активен только если выбран id
    },
  });

  // При получении данных обновляем поле "Имя" в форме
  useEffect(() => {
    if (counterpartyData && counterpartyData.data) {
      // @ts-ignore
      formProps.form.setFieldsValue({
        name: counterpartyData.data.name, // Предполагается, что данные клиента содержат поле name
      });
    }
  }, [counterpartyData, formProps.form]);

  // Обработчик выбора клиента в Select
  const handleCounterpartyChange = (value: any) => {
    setSelectedCounterpartyId(value);
  };

  const expenseTypes = [
    { value: "supplier_payment", label: "Оплата поставщику" },
    { value: "repair_payment", label: "Оплата за ремонт" },
    { value: "salary_payment", label: "Выплата заработной платы работнику" },
    { value: "advance_payment", label: "Выдача подотчет" },
  ];

  const incomeTypes = [
    "Оплата наличными",
    "Оплата переводом",
    "Оплата перечислением",
  ];

  const currentDateDayjs = dayjs();

  useEffect(() => {
    if (formProps.form) {
      formProps.form.setFieldsValue({
        date: currentDateDayjs,
      });
    }
  }, [formProps.form]);

  enum CurrencyType {
    Usd = "Доллар",
    Rub = "Рубль",
    Som = "Сом",
    Eur = "Евро",
  }

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);

    if (sorter && sorter.field) {
      setSortField(
        sorter.field === "counterparty.name" ? "counterparty.name" : "id"
      );
      setSortDirection(sorter.order === "ascend" ? "ASC" : "DESC");
    }
  };

  const dataSource = data?.data?.data;

  const tableProps = {
    dataSource: dataSource,
    loading: isLoading,
    pagination: {
      current: currentPage,
      pageSize: pageSize,
      total: data?.data?.total || 0,
    },
    onChange: handleTableChange,
  };

  const handleRowSelectionChange = (
    selectedRowKeys: Key[],
    selectedRows: BaseRecord[],
    info: { type: "all" | "none" | "invert" | "single" | "multiple" }
  ) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  return (
    <Create
      saveButtonProps={saveButtonProps}
      title={<h3 style={{ margin: 0 }}>Добавить приход</h3>}
    >
      <Form
        {...formProps}
        layout="vertical"
        style={{ marginBottom: 0 }}
        initialValues={{
          type: "income",
          // Не устанавливаем дату здесь, а делаем это через useEffect
        }}
      >
        <Row gutter={[16, 2]}>
          <Col span={12}>
            <Form.Item
              label="Дата поступление"
              name="date"
              style={{ marginBottom: 5 }}
            >
              <DatePicker
                disabled={true}
                style={{ width: "100%" }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Банк"
              name={["bank_id"]}
              rules={[{ required: true, message: "Пожалуйста, выберите Банк" }]}
              // Настройка отступов между лейблом и инпутом
              style={{ marginBottom: 5 }}
            >
              <Select
                {...bankSelectProps}
                placeholder="Выберите код банк"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Вид прихода"
              name={["type_operation"]}
              rules={[
                { required: false, message: "Пожалуйста, выберите Банк" },
              ]}
              // Настройка отступов между лейблом и инпутом
              style={{ marginBottom: 5 }}
            >
              <Select
                options={incomeTypes.map((enumValue) => ({
                  label: enumValue,
                  value: enumValue,
                }))}
                placeholder="Выберите вид прихода"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Код Клиента"
              name={["counterparty_id"]}
              rules={[
                { required: true, message: "Пожалуйста, выберите клиента" },
              ]}
              style={{ marginBottom: 5 }}
            >
              <Select
                {...counterpartySelectProps}
                onChange={handleCounterpartyChange}
                placeholder="Выберите код клиента"
                style={{ width: "100%" }}
                showSearch
                filterOption={false}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Трек-код"
              name="name"
              rules={[{ required: false, message: "Укажите имя" }]}
              style={{ marginBottom: 5 }}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Сумма"
              name="amount"
              rules={[{ required: true, message: "Укажите сумму" }]}
              style={{ marginBottom: 5 }}
            >
              <Input
                type="number"
                min={0}
                placeholder="Введите сумму прихода"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="type_currency"
              label="Валюта"
              rules={[{ required: true, message: "Выберите Валюту" }]}
            >
              <Select
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={Object.values(CurrencyType).map((item: any) => ({
                  label: `${item}`,
                  value: item,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Комментарий"
              name="comment"
              rules={[{ required: false }]}
              style={{ marginBottom: 5 }}
            >
              <Input
                placeholder="Комментарий"
                style={{ width: "100%", height: 63 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Чек">
              <Form.Item name="check_file" noStyle>
                <Upload.Dragger
                  name="file"
                  action={`${API_URL}/file-upload`}
                  listType="picture"
                  accept=".png,.jpg,.jpeg"
                  beforeUpload={(file) => {
                    // Создаем объект FormData для отправки файла
                    const formData = new FormData();
                    formData.append("file", file);

                    // Отправляем запрос на сервер для получения пути к файлу
                    fetch(`${API_URL}/file-upload`, {
                      method: "POST",
                      body: formData,
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        // Предполагаем, что сервер возвращает объект с путем к файлу
                        const filePath = data.path || data.url || data.filePath;
                        // Устанавливаем путь к файлу в форму
                        if (formProps.form) {
                          formProps.form.setFieldsValue({
                            check_file: filePath,
                          });
                        }
                      })
                      .catch((error) => {
                        console.error("Ошибка загрузки файла:", error);
                      });

                    // Предотвращаем стандартную загрузку Ant Design
                    return false;
                  }}
                >
                  <p className="ant-upload-text">
                    <PaperClipOutlined /> Прикрепить чек
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: "max-content" }}
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: handleRowSelectionChange,
        }}
      >
        <Table.Column
          dataIndex="created_at"
          title="Дата приемки"
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
          render={(value) => (
            <p
              style={{
                width: "200px",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {`${value?.branch?.name}, ${value?.under_branch?.address || ""}`}
            </p>
          )}
          title="Пункт назначения, Пвз"
        />
        <Table.Column dataIndex="weight" title="Вес" />
        <Table.Column
          dataIndex="counterparty"
          title="Тариф клиента"
          render={(value, record) => {
            return `${(
              Number(value?.branch?.tarif || 0) -
              Number(record?.counterparty?.discount?.discount || 0)
            ).toFixed(2)}`;
          }}
        />

        <Table.Column dataIndex="amount" title="Сумма" />
        <Table.Column
          dataIndex="discount"
          title="Скидка"
          render={(value, record) => {
            return `${(Number(value) + Number(record?.discount_custom)).toFixed(
              2
            )}`;
          }}
        />
        <Table.Column dataIndex="status" title="Статус" />
        <Table.Column
          dataIndex="employee"
          title="Сотрудник"
          render={(value) => {
            return `${value?.firstName}-${value?.lastName}`;
          }}
        />
        <Table.Column dataIndex="comments" title="Комментарий" />
      </Table>
    </Create>
  );
};
