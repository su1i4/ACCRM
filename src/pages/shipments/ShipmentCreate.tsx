import React, { useState, useEffect } from "react";
import { Create, Title, useForm, useSelect, useTable } from "@refinedev/antd";
import { useCustom, useUpdateMany } from "@refinedev/core";
import {
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Table,
  Flex,
  Select,
  Dropdown,
  Button,
  Space,
  Card,
} from "antd";
import { catchDateTable } from "../../lib/utils";
import { API_URL } from "../../App";
import { useSearchParams } from "react-router";
import { CustomTooltip, operationStatus } from "../../shared";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  SearchOutlined,
} from "@ant-design/icons";

/**
 * Пример: Когда мы нажимаем "Сохранить" (Create),
 * 1) создаётся рейс (shipment),
 * 2) затем сразу обновляются выбранные товары (goods-processing),
 *    проставляя им shipment_id = ID созданного рейса.
 */
const ShipmentCreate = () => {
  const [searchparams, setSearchParams] = useSearchParams();
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [sortField, setSortField] = useState<
    "id" | "counterparty.name" | "operation_id"
  >("id");
  const [filters, setFilters] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const buildQueryParams = () => {
    return {
      s: JSON.stringify({
        $and: [...filters, { status: { eq: "В складе" } }],
      }),
      sort: `${sortField},${sortDirection}`,
      limit: pageSize,
      page: currentPage,
      offset: currentPage * pageSize,
    };
  };

  const { data, isLoading, refetch } = useCustom<any>({
    url: `${API_URL}/goods-processing`,
    method: "get",
    config: {
      query: buildQueryParams(),
    },
  });
  // const { tableProps, setFilters } = useTable({
  //   resource: "goods-processing",
  //   syncWithLocation: false,
  //   initialSorter: [
  //     {
  //       field: "id",
  //       order: "desc",
  //     },
  //   ],
  //   filters: {
  //     permanent: [
  //       {
  //         field: "status",
  //         operator: "eq",
  //         value: "В складе",
  //       },
  //     ],
  //   },
  // });
  /**
   * Состояние для ID выбранных товаров
   */
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  /**
   * Состояние для полных данных выбранных товаров
   */
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  /**
   * Состояние для общего веса
   */
  const [totalWeight, setTotalWeight] = useState<number>(0);

  /**
   * Хук для массового обновления (updateMany) товаров.
   * Здесь указываем ресурс "goods-processing" — именно его обновляем.
   */
  const { mutate: updateManyGoods } = useUpdateMany({
    resource: "goods-processing",
    // Можно дополнительно указать onSuccess / onError, если нужно.
  });

  /**
   * Хук формы для создания "shipments".
   * При удачном создании (onMutationSuccess)
   * мы получим ID нового рейса, и сразу используем updateMany для товаров.
   */

  interface IShipment {
    id?: number;
    type: string;
    boxCode: string;
    branch_id: number;
    weight: string;
    length: string;
    width: string;
    height: string;
    cube: string;
    density: string;
  }

  const {
    formProps,
    saveButtonProps: originalSaveButtonProps,
    form,
  } = useForm<IShipment>({
    resource: "shipments",
    onMutationSuccess: async (createdShipment) => {
      const newShipmentId = createdShipment.data.id;
      if (selectedRowKeys.length > 0) {
        updateManyGoods({
          ids: selectedRowKeys,
          values: {
            shipment_id: newShipmentId,
            status: "В пути",
          },
        });
      }
    },
  });

  const modifiedFormProps = {
    ...formProps,
    onFinish: async (values: IShipment) => {
      const { cube, ...dataToSubmit } = values;
      return formProps.onFinish?.(dataToSubmit);
    },
  };

  // Модифицируем props кнопки сохранения, чтобы добавить проверку на наличие товаров
  const saveButtonProps = {
    ...originalSaveButtonProps,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (selectedRowKeys.length === 0) {
        // Показываем предупреждение, если товары не выбраны
        return form
          .validateFields()
          .then(() => {
            // Если форма валидна, но товары не выбраны - показываем ошибку
            form.setFields([
              {
                name: "_goods",
                errors: ["Необходимо выбрать хотя бы один товар для отправки"],
              },
            ]);
          })
          .catch((errorInfo) => {
            // Стандартная обработка ошибок валидации формы
          });
      }

      // Если товары выбраны, вызываем оригинальный обработчик
      if (originalSaveButtonProps.onClick) {
        originalSaveButtonProps.onClick(e);
      }
    },
    disabled: isLoading,
  };

  // Рассчитываем общий вес при изменении выбранных строк
  useEffect(() => {
    if (selectedRows.length > 0) {
      const sum = selectedRows.reduce((total, row) => {
        // Преобразуем в число, чтобы избежать конкатенации строк
        const weight = parseFloat(row.weight) || 0;
        return total + weight;
      }, 0);

      setTotalWeight(sum);

      // Обновляем поле веса в форме
      form.setFieldsValue({ weight: sum.toFixed(2) });

      // Также расчитываем и обновляем поле "куб" и "плотность" если у вас есть нужные данные
      const length = form.getFieldValue("length") || 0;
      const width = form.getFieldValue("width") || 0;
      const height = form.getFieldValue("height") || 0;

      const cube = ((length * width * height) / 1000000).toFixed(2);
      form.setFieldsValue({ cube });

      if (parseFloat(cube) > 0) {
        const density = (sum / parseFloat(cube)).toFixed(2);
        form.setFieldsValue({ density: density });
      }
    } else {
      setTotalWeight(0);
      form.setFieldsValue({ weight: "0", cube: "0", density: "0" });
    }
  }, [selectedRows, form]);

  // Обновляем куб и плотность при изменении размеров
  useEffect(() => {
    const updateCalculations = () => {
      const length = form.getFieldValue("length") || 0;
      const width = form.getFieldValue("width") || 0;
      const height = form.getFieldValue("height") || 0;

      if (length && width && height) {
        const cube = ((length * width * height) / 1000000).toFixed(2);
        form.setFieldsValue({ cube });

        const weight = form.getFieldValue("weight") || 0;
        if (parseFloat(cube) > 0 && parseFloat(weight) > 0) {
          const density = (parseFloat(weight) / parseFloat(cube)).toFixed(2);
          form.setFieldsValue({ density: density });
        }
      }
    };

    // Задержка для обеспечения обновления после заполнения полей формы
    const timeoutId = setTimeout(updateCalculations, 100);
    return () => clearTimeout(timeoutId);
  }, [
    form.getFieldValue("length"),
    form.getFieldValue("width"),
    form.getFieldValue("height"),
  ]);

  /**
   * useTable для ресурса "goods-processing".
   * Показываем товары, которые пользователь сможет выбрать для привязки.
   */

  const { selectProps: branchSelectProps } = useSelect({
    resource: "branch",
    optionLabel: "name",
  });

  const type = [
    "Одежда",
    "Хозка",
    "Обувь",
    "Головные уборы",
    "Смешка",
    "Ткань",
    "Оборудование",
    "Фурнитура",
    "Автозапчасти",
    "Электро товары",
    "Мебель",
    "Инструменты",
    "Аксессуары",
  ];

  const [sorterVisible, setSorterVisible] = useState(false);

  useEffect(() => {
    if (!searchparams.get("page") && !searchparams.get("size")) {
      searchparams.set("page", String(currentPage));
      searchparams.set("size", String(pageSize));
      setSearchParams(searchparams);
    } else {
      const page = searchparams.get("page");
      const size = searchparams.get("size");
      setCurrentPage(Number(page));
      setPageSize(Number(size));
    }
    refetch();
  }, [filters, sortDirection, currentPage, pageSize]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    searchparams.set("page", pagination.current);
    searchparams.set("size", pagination.pageSize);
    setSearchParams(searchparams);
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);

    // Обрабатываем сортировку, если она пришла из таблицы
    if (sorter && sorter.field) {
      setSortField(
        sorter.field === "counterparty.name" ? "counterparty.name" : "id"
      );
      setSortDirection(sorter.order === "ascend" ? "ASC" : "DESC");
    }
  };

  const dataSource = data?.data?.data || [];

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

  const datePickerContent = (
    <DatePicker.RangePicker
      style={{ width: "280px" }}
      placeholder={["Начальная дата", "Конечная дата"]}
      onChange={(dates, dateStrings) => {
        if (dates && dateStrings[0] && dateStrings[1]) {
          // Fixed: Use consistent filter format
          setFilters([
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
        {/* Сортировка по дате создания */}
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
        <Button
          type="text"
          style={{
            textAlign: "left",
            fontWeight: sortField === "operation_id" ? "bold" : "normal",
          }}
          onClick={() => {
            setSortField("operation_id");
            setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
          }}
        >
          По статусу оплаты{" "}
          {sortField === "operation_id" &&
            (sortDirection === "ASC" ? "↑" : "↓")}
        </Button>
      </div>
    </Card>
  );

  //@ts-ignore
  return (
    //@ts-ignore
    <Create saveButtonProps={saveButtonProps}>
      {/* @ts-ignore */}
      <Form {...modifiedFormProps} layout="vertical">
        {/* Скрытое поле для отображения ошибки выбора товаров */}
        <Form.Item name="_goods" style={{ display: "none" }}>
          <Input />
        </Form.Item>

        <Row style={{ width: "100%" }}>
          <Flex gap={10}>
            <Form.Item
              style={{ minWidth: 250 }}
              label="Тип"
              name="type"
              rules={[{ required: true }]}
            >
              <Select
                options={type.map((enumValue) => ({
                  label: enumValue,
                  value: enumValue,
                }))}
              />
            </Form.Item>
            <Form.Item
              style={{ width: 250 }}
              label="Код коробки"
              name="boxCode"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ width: 250 }}
              label="Номер фуры"
              name="truck_number"
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ width: 250 }}
              name="branch_id"
              label="Пункт назначения"
              rules={[{ required: true, message: "Введите Пункт назначения" }]}
            >
              <Select {...branchSelectProps} />
            </Form.Item>
          </Flex>
        </Row>
        <Row>
          <Flex gap={10}>
            <Form.Item
              style={{ width: 120 }}
              label="Вес"
              name="weight"
              required={false}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item label="Размеры (Д × Ш × В)" required>
              <Input.Group compact>
                <Form.Item
                  name="length"
                  noStyle
                  rules={[{ required: true, message: "Введите длину" }]}
                >
                  <Input
                    style={{ width: 100, textAlign: "center" }}
                    placeholder="Длина"
                    onChange={() => {
                      // Триггер для обновления расчетов
                      form.validateFields(["width", "height"]);
                    }}
                    type="number"
                    min={0}
                  />
                </Form.Item>

                <span style={{ padding: "0 8px" }}>×</span>

                <Form.Item
                  name="width"
                  noStyle
                  rules={[{ required: true, message: "Введите ширину" }]}
                >
                  <Input
                    style={{ width: 100, textAlign: "center" }}
                    placeholder="Ширина"
                    onChange={() => {
                      // Триггер для обновления расчетов
                      form.validateFields(["length", "height"]);
                    }}
                    type="number"
                    min={0}
                  />
                </Form.Item>

                <span style={{ padding: "0 8px" }}>×</span>

                <Form.Item
                  name="height"
                  noStyle
                  rules={[{ required: true, message: "Введите высоту" }]}
                >
                  <Input
                    style={{ width: 100, textAlign: "center" }}
                    placeholder="Высота"
                    onChange={() => {
                      // Триггер для обновления расчетов
                      form.validateFields(["length", "width"]);
                    }}
                    type="number"
                    min={0}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
            <Form.Item
              style={{ width: 120 }}
              label="Куб"
              name="cube"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              style={{ width: 120 }}
              label="Плотность"
              name="density"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>
          </Flex>
        </Row>

        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Space size="middle">
              <CustomTooltip title="Сортировка">
                <Dropdown
                  overlay={sortContent}
                  trigger={["click"]}
                  placement="bottomLeft"
                  open={sorterVisible}
                  onOpenChange={(visible) => {
                    setSorterVisible(visible);
                  }}
                >
                  <Button
                    icon={
                      sortDirection === "ASC" ? (
                        <ArrowUpOutlined />
                      ) : (
                        <ArrowDownOutlined />
                      )
                    }
                  ></Button>
                </Dropdown>
              </CustomTooltip>
            </Space>
          </Col>
          <Col flex="auto">
            <Input
              placeholder="Поиск по трек-коду, фио получателя или по коду получателя"
              prefix={<SearchOutlined />}
              onChange={(e) => {
                const value = e.target.value;
                if (!value) {
                  setFilters([{ trackCode: { $contL: "" } }]);
                  return;
                }
                setCurrentPage(1)
                searchparams.set("page", '1');
                setSearchParams(searchparams);

                setFilters([
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
          </Col>
          <Col>
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
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            {form.getFieldError("_goods").length > 0 && (
              <div style={{ color: "#ff4d4f", marginBottom: "12px" }}>
                {form.getFieldError("_goods")[0]}
              </div>
            )}

            <Table
              {...tableProps}
              rowKey="id"
              rowSelection={{
                type: "checkbox",
                onChange: (keys, rows) => {
                  setSelectedRowKeys(keys as number[]);
                  setSelectedRows(rows);

                  if (
                    keys.length > 0 &&
                    form.getFieldError("_goods").length > 0
                  ) {
                    form.setFields([{ name: "_goods", errors: [] }]);
                  }
                },
              }}
              locale={{
                emptyText: "Нет доступных товаров для отправки",
              }}
              scroll={{x: 'max-content'}}
            >
              {catchDateTable("Дата приемки", "В складе")}
              <Table.Column dataIndex="cargoType" title="Тип груза" />
              <Table.Column dataIndex="trackCode" title="Треккод" />
              <Table.Column
                dataIndex="counterparty"
                title="Код получателя"
                render={(value) => {
                  return value?.clientPrefix + "-" + value?.clientCode;
                }}
              />
              <Table.Column
                dataIndex="counterparty"
                title="ФИО Получателя"
                render={(value) => value?.name}
              />
              <Table.Column
                dataIndex="counterparty"
                title="Пункт назначения"
                render={(value) => value?.branch?.name}
              />
              <Table.Column dataIndex="weight" title="Вес" />
              <Table.Column dataIndex="status" title="Статус" />
              <Table.Column dataIndex="comments" title="Комментарий" />   
            </Table>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};

export default ShipmentCreate;
