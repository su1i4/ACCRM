import { useState, useEffect } from "react";
import { Edit, useForm, useSelect, useTable } from "@refinedev/antd";
import { useUpdateMany, useOne, useNavigation } from "@refinedev/core";
import { Form, Input, Row, Flex, Select, Col, Table, Button } from "antd";
import { useParams } from "react-router";
import { FileAddOutlined } from "@ant-design/icons";

const ShipmentEdit = () => {
  const { id } = useParams();
  const { push } = useNavigation();
  //@ts-ignore
  const { tableProps, refetch: refetchGoods } = useTable({
    resource: "goods-processing",
    syncWithLocation: false,
    filters: {
      permanent: [
        {
          field: "shipment_id",
          operator: "eq",
          value: Number(id),
        },
        {
          field: "status",
          operator: "eq",
          value: "В пути",
        },
      ],
    },
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);

  // Получаем данные текущей отправки для редактирования
  const { data: shipmentData, isLoading: isLoadingShipment } = useOne({
    resource: "shipments",
    id: id ? parseInt(id) : 0,
    queryOptions: {
      enabled: !!id,
    },
  });

  /**
   * Хук для массового обновления (updateMany) товаров.
   */
  const { mutate: updateManyGoods } = useUpdateMany({
    resource: "goods-processing",
  });

  /**
   * Хук формы для редактирования "shipments".
   */
  const {
    formProps,
    saveButtonProps: originalSaveButtonProps,
    form,
    formLoading,
  } = useForm({
    resource: "shipments",
    action: "edit",
    id,
    redirect: "list",
    onMutationSuccess: async (updatedShipment) => {
      // Получаем ID отправки
      const shipmentId = updatedShipment.data.id;

      // Удаляем старые связи (товары, у которых больше не выбраны чекбоксы)
      const currentAssignedGoods =
        tableProps?.dataSource
          ?.filter((item: any) => item.shipment_id === parseInt(id as string))
          .map((item: any) => item.id) || [];

      // Находим товары, которые были откреплены (были в отправке, но сейчас не выбраны)
      const unassignedGoods = currentAssignedGoods.filter(
        (goodId: number) => !selectedRowKeys.includes(goodId)
      );

      // Обновляем открепленные товары (возвращаем в статус "В складе")
      if (unassignedGoods.length > 0) {
        updateManyGoods({
          ids: unassignedGoods,
          values: {
            shipment_id: null,
            status: "В складе",
          },
        });
      }

      // Обновляем выбранные товары (привязываем к отправке)
      if (selectedRowKeys.length > 0) {
        updateManyGoods({
          ids: selectedRowKeys,
          values: {
            shipment_id: shipmentId,
            status: "В пути",
          },
        });
      }
    },
  });

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
    disabled: tableProps?.loading,
  };

  // Получаем данные о связанных товарах
  //@ts-ignore

  // После загрузки данных автоматически выбираем товары, которые уже привязаны к отправке
  useEffect(() => {
    if (tableProps?.dataSource && id) {
      const assignedGoods = tableProps.dataSource
        .filter((item: any) => item.shipment_id === parseInt(id as string))
        .map((item: any) => item.id);

      setSelectedRowKeys(assignedGoods);
      setSelectedRows(
        tableProps.dataSource.filter((item: any) =>
          assignedGoods.includes(item.id)
        )
      );
    }
  }, [tableProps?.dataSource, id]);

  // Заполняем форму данными отправки после их загрузки
  useEffect(() => {
    if (shipmentData?.data && form) {
      form.setFieldsValue({
        ...shipmentData.data,
      });
    }
  }, [shipmentData, form]);

  // Рассчитываем общий вес при изменении выбранных строк
  useEffect(() => {
    if (selectedRows.length > 0) {
      const sum = selectedRows.reduce((total, row) => {
        const weight = parseFloat(row.weight) || 0;
        return total + weight;
      }, 0);

      setTotalWeight(sum);
      form.setFieldsValue({ weight: sum.toFixed(2) });

      // Расчитываем "куб" и "плотность"
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
      form.setFieldsValue({ weight: "0" });

      // Не сбрасываем куб и плотность при отсутствии товаров, если есть размеры
      const length = form.getFieldValue("length") || 0;
      const width = form.getFieldValue("width") || 0;
      const height = form.getFieldValue("height") || 0;

      if (length && width && height) {
        const cube = ((length * width * height) / 1000000).toFixed(2);
        form.setFieldsValue({ cube });

        // Плотность 0, если нет веса
        form.setFieldsValue({ density: "0" });
      } else {
        form.setFieldsValue({ cube: "0", density: "0" });
      }
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

    const timeoutId = setTimeout(updateCalculations, 100);
    return () => clearTimeout(timeoutId);
  }, [
    form.getFieldValue("length"),
    form.getFieldValue("width"),
    form.getFieldValue("height"),
  ]);

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
    <Edit
      //@ts-ignore
      saveButtonProps={saveButtonProps}
      headerButtons={() => false}
      isLoading={formLoading || isLoadingShipment}
    >
      <Form {...formProps} layout="vertical">
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
                      form.validateFields(["width", "height"]);
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
                      form.validateFields(["length", "height"]);
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
                      form.validateFields(["length", "width"]);
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

        <Button
          icon={<FileAddOutlined />}
          style={{ marginBottom: 10 }}
          onClick={() => push(`/shipments/show/${id}/adding`)}
        />
        <Row gutter={16}>
          <Col span={24}>
            {/* Показываем сообщение об ошибке, если форма была отправлена без выбора товаров */}
            {form.getFieldError("_goods")?.length > 0 && (
              <div style={{ color: "#ff4d4f", marginBottom: "12px" }}>
                {form.getFieldError("_goods")[0]}
              </div>
            )}

            <Table
              {...tableProps}
              rowKey="id"
              rowSelection={{
                type: "checkbox",
                selectedRowKeys: selectedRowKeys,
                onChange: (keys, rows) => {
                  setSelectedRowKeys(keys as number[]);
                  setSelectedRows(rows);

                  // Сбрасываем ошибку при выборе товаров
                  if (
                    keys.length > 0 &&
                    form.getFieldError("_goods")?.length > 0
                  ) {
                    form.setFields([{ name: "_goods", errors: [] }]);
                  }
                },
              }}
              locale={{
                emptyText: "Нет доступных товаров для отправки",
              }}
            >
              <Table.Column
                dataIndex="created_at"
                title="Дата"
                render={(value) => {
                  return `${value?.split("T")[0]} ${value
                    ?.split("T")[1]
                    ?.slice(0, 5)}`;
                }}
              />
              <Table.Column dataIndex="cargoType" title="Тип груза" />
              <Table.Column dataIndex="trackCode" title="Треккод" />

              <Table.Column
                dataIndex="counterparty"
                title="Код получателя"
                render={(value) => {
                  return value?.clientPrefix + "-" + value?.clientCode;
                }}
              />

              <Table.Column dataIndex="status" title="Статус" />
              <Table.Column
                dataIndex="counterparty"
                render={(value) =>
                  `${value?.branch?.name},${value?.under_branch?.address || ""}`
                }
                title="Пункт назначения, Пвз"
              />
              <Table.Column dataIndex="weight" title="Вес" />
            </Table>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
};

export default ShipmentEdit;
