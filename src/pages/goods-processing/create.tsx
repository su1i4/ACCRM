import React from "react";
import { Create, getValueFromEvent, useForm, useSelect } from "@refinedev/antd";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Upload,
  Row,
  Col,
  Flex,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { EntityMetadata } from "typeorm";
import { API_URL } from "../../App"; // Импорт для типа (если вы можете получить реальные метаданные TypeORM)
import dayjs from "dayjs";

export const entityFields = [
  { name: "trackCode", label: "Трек-код", type: "varchar", required: true },

  {
    name: "cargoType",
    label: "Тип груза",
    type: "enum",
    required: true,
    enumValues: [
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
    ],
  },
  {
    name: "packageType",
    label: "Вид упаковки",
    type: "enum",
    required: true,
    enumValues: [
      "Коробка+скотч",
      "Коробка+водонепронц мешок+скотч",
      "Картонные уголки",
      "Деревянная обрешетка",
      "Деревянный паллет",
      "Мешок+Скотч",
      "Скотч",
      "Мешок",
      "Водонепроницаемый мешок+скотч",
    ],
  },

  {
    name: "pricePackageType",
    label: "Цена за упаковку ",
    type: "decimal",
    required: true,
  },
  { name: "weight", label: "Вес", type: "decimal", required: true },
  { name: "comments", label: "Комментарии", type: "text", required: false },
];

export const GoodsCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  const { selectProps: branchSelectProps } = useSelect({
    resource: "branch",
    optionLabel: "name",
  });

  const { selectProps: counterpartySelectProps } = useSelect({
    resource: "counterparty",
    optionLabel: "name",
  });

  const today = dayjs().format("YYYY-MM-DD");

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="horizontal">
        <Row gutter={16}>
          {" "}
          {/* Добавляем отступы между колонками */}
          {entityFields.map((field, index) => (
            <Col span={6} key={field.name}>
              {" "}
              {/* Разбиваем строку на 3 части (24 / 8 = 3) */}
              <Form.Item
                label={field.label}
                name={field.name}
                rules={field.required ? [{ required: true }] : []}
              >
                {field.type === "varchar" || field.type === "text" ? (
                  <Input />
                ) : field.type === "decimal" ? (
                  <InputNumber style={{ width: "100%" }} />
                ) : field.type === "enum" ? (
                  <Select
                    mode="tags"
                    // @ts-ignore
                    options={field?.enumValues.map((enumValue) => ({
                      label: enumValue,
                      value: enumValue,
                    }))}
                  />
                ) : field.type === "date" || field.type === "timestamp" ? (
                  <DatePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime
                  />
                ) : (
                  <Input />
                )}
              </Form.Item>
            </Col>
          ))}
          {/*<Col span={8} >*/}
          {/*    <Form.Item*/}
          {/*        label={"Филиал"}*/}
          {/*        name={["branch_id"]}*/}
          {/*        rules={[*/}
          {/*            {*/}
          {/*                required: true,*/}
          {/*            },*/}
          {/*        ]}*/}
          {/*    >*/}
          {/*    <Select {...branchSelectProps}  />*/}
          {/*    </Form.Item>*/}
          {/*</Col>*/}
          <Col span={8}>
            <Form.Item
              label={"Код Клиента"}
              name={["counterparty_id"]}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select {...counterpartySelectProps} />
            </Form.Item>
          </Col>
        </Row>

        {/* Поле загрузки фото - на отдельной строке */}
        <Row>
          <Col span={24}>
            <Form.Item label="Фото">
              <Form.Item name="photo" noStyle>
                <Upload.Dragger
                  name="file"
                  action={`${API_URL}/file-upload`}
                  listType="picture"
                  accept=".png,.jpg,.jpeg"
                >
                  <p className="ant-upload-text">Загрузите Фото</p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};
