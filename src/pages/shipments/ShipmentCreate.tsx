import React, { useState } from "react";
import { Create, Title, useForm, useSelect, useTable } from "@refinedev/antd";
import { useUpdateMany } from "@refinedev/core";
import { Form, Input, DatePicker, Row, Col, Table, Flex, Select } from "antd";

/**
 * Пример: Когда мы нажимаем "Сохранить" (Create),
 * 1) создаётся рейс (shipment),
 * 2) затем сразу обновляются выбранные товары (goods-processing),
 *    проставляя им shipment_id = ID созданного рейса.
 */
const ShipmentCreate = () => {
  /**
   * Состояние для ID выбранных товаров
   */
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

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
  const { formProps, saveButtonProps } = useForm({
    resource: "shipments",
    // Срабатывает после успешного "create" (создания рейса)
    onMutationSuccess: async (createdShipment) => {
      const newShipmentId = createdShipment.data.id;
      // Если выбраны товары, то обновляем их массово
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

  /**
   * useTable для ресурса "goods-processing".
   * Показываем товары, которые пользователь сможет выбрать для привязки.
   */
  const { tableProps } = useTable({
    resource: "goods-processing",
    syncWithLocation: false,
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    filters: {
      initial: [
        {
          field: "shipment_id",
          operator: "null",
          value: "null",
        },
        // {
        //     field:"status",
        //     operator:"in",
        //     value:"IN_WAREHOUSE"
        // }
      ],
    },
  });
  const { selectProps: branchSelectProps } = useSelect({
    resource: "branch",
    optionLabel: "name",
  });

  const { selectProps: userSelectProps } = useSelect({
    resource: "users",
    optionLabel: "firstName",
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

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Row style={{ width: "100%" }}>
          <Flex gap={10}>
            <Form.Item
              style={{ width: 150 }}
              label="Номер рейса"
              name="flightNumber"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ minWidth: 150 }}
              label="Тип"
              name="flightNumber"
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
              style={{ width: 150 }}
              label="Код коробки"
              name="flightNumber"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="branch_id"
              label="Пункт назначения"
              rules={[{ required: true, message: "Введите Пунк назначения" }]}
            >
              <Select {...branchSelectProps} />
            </Form.Item>
            <Form.Item
              style={{ minWidth: 150 }}
              name="user_id"
              label="Сотрудник"
              rules={[{ required: true, message: "Введите Сотрудник" }]}
            >
              <Select {...userSelectProps} />
            </Form.Item>
          </Flex>

          {/* <Col span={6}>
            <Flex
              align="flex-start"
              vertical
              style={{ margin: "0", minWidth: 420 }}
            >
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
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Flex>
          </Col> */}
        </Row>
        <Row>
          <Flex gap={10}>
            <Form.Item
              style={{ width: 120}}
              label="Вес"
              name="weight"
              rules={[{ required: true }]}
            >
              <Input />
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
              <Input />
            </Form.Item>
            <Form.Item
              style={{ width: 120 }}
              label="Плотность"
              name="cube"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Flex>
        </Row>

        {/* Таблица со списком товаров, которые можно выбрать для "привязки" к новому рейсу */}
        <Row gutter={16}>
          <Col span={24}>
            <Table
              {...tableProps}
              rowKey="id"
              rowSelection={{
                type: "checkbox",
                onChange: (keys) => {
                  setSelectedRowKeys(keys as number[]);
                },
              }}
            >
              <Table.Column dataIndex="receptionDate" title="Дата" />
              <Table.Column dataIndex="cargoType" title="ТПН" />
              <Table.Column dataIndex="trackCode" title="Треккод" />
              <Table.Column dataIndex="weight" title="Код Клиента" />
              <Table.Column dataIndex="trackCode" title="Получатель" />
              <Table.Column dataIndex="weight" title="Филиал" />
              <Table.Column dataIndex="weight" title="Вес" />
              <Table.Column dataIndex="status" title="Статус" />

              {/* Добавьте остальные нужные колонки */}
            </Table>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};

export default ShipmentCreate;
