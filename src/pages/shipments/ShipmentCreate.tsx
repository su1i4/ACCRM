import React, { useState, useEffect } from "react";
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
   * 
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
  
  const { formProps, saveButtonProps, form } = useForm({
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
      const length = form.getFieldValue('length') || 0;
      const width = form.getFieldValue('width') || 0;
      const height = form.getFieldValue('height') || 0;
      
      const cube = (length * width * height / 1000000).toFixed(2);
      form.setFieldsValue({ cube });
      
      //@ts-ignore
      if (cube > 0) {
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
      const length = form.getFieldValue('length') || 0;
      const width = form.getFieldValue('width') || 0;
      const height = form.getFieldValue('height') || 0;
      
      if (length && width && height) {
        const cube = (length * width * height / 1000000).toFixed(2);
        form.setFieldsValue({ cube });
        
        const weight = form.getFieldValue('weight') || 0;
        //@ts-ignore
        if (cube > 0 && weight > 0) {
          const density = (parseFloat(weight) / parseFloat(cube)).toFixed(2);
          form.setFieldsValue({ density: density });
        }
      }
    };
    
    // Задержка для обеспечения обновления после заполнения полей формы
    const timeoutId = setTimeout(updateCalculations, 100);
    return () => clearTimeout(timeoutId);
  }, [form.getFieldValue('length'), form.getFieldValue('width'), form.getFieldValue('height')]);

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
        {
          field: "status",
          operator: "eq",
          value: "В складе",
        },
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
              name="branch_id"
              label="Пункт назначения"
              rules={[{ required: true, message: "Введите Пунк назначения" }]}
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
                      form.validateFields(['width', 'height']);
                    }}
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
                      form.validateFields(['length', 'height']);
                    }}
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
                      form.validateFields(['length', 'width']);
                    }}
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

        {/* Таблица со списком товаров, которые можно выбрать для "привязки" к новому рейсу */}
        <Row gutter={16}>
          <Col span={24}>
            <Table
              {...tableProps}
              rowKey="id"
              rowSelection={{
                type: "checkbox",
                onChange: (keys, rows) => {
                  setSelectedRowKeys(keys as number[]);
                  setSelectedRows(rows);
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
            </Table>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};

export default ShipmentCreate;