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
    // required: true,
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
    // required: true,
  },
  { name: "weight", label: "Вес", type: "decimal", required: true },
  { name: "comments", label: "Комментарии", type: "text", required: false },
];

// Интерфейс для значений формы
interface GoodsFormValues {
  trackCode?: string;
  cargoType?: string[];
  packageType?: string[];
  pricePackageType?: number;
  weight?: number;
  comments?: string;
  counterparty_id?: string | number;
  discount_custom?: number;
  photo?: {
    file?: {
      response?: {
        filePath?: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

export const GoodsCreate = () => {
  const { formProps, saveButtonProps, form } = useForm<GoodsFormValues>();

  const modifiedSaveButtonProps = {
    ...saveButtonProps,
    onClick: async (e: React.MouseEvent<HTMLElement>) => {
      // Перехватываем нажатие на кнопку сохранения
      e.preventDefault();
      
      try {
        // Получаем текущие значения формы
        const values = await form.validateFields() as GoodsFormValues;
      

        // Форматируем поле photo перед отправкой, если оно существует
        if (values.photo && values.photo.file && values.photo.file.response) {
          values.photo = {
            file: {
              response: {
                filePath: values.photo.file.response.filePath
              }
            }
          };
        }
        
        console.log(values);
        // Сохраняем модифицированные значения
        form.setFieldsValue(values);
        
        // Вызываем исходный обработчик если он существует
        if (saveButtonProps.onClick) {
          await saveButtonProps.onClick(e);
        } else {
          await form.submit();
        }

        console.log("values", values);

      } catch (error) {
        console.error("Ошибка валидации формы:", error);
      }
    }
  };

  const { selectProps: branchSelectProps } = useSelect({
    resource: "branch",
    optionLabel: "name",
  });

  const { selectProps: counterpartySelectProps } = useSelect({
    resource: "counterparty",
    optionLabel: (record: any) => {
      return `${record?.name}, ${record?.clientPrefix}-${record?.clientCode}`;
    },
    onSearch: (value) => {
      // Check if the search value contains only digits
      const isOnlyDigits = /^\d+$/.test(value);

      if (isOnlyDigits) {
        // If only digits, search by clientCode
        return [
          {
            field: "clientCode",
            operator: "contains",
            value,
          },
        ];
      } else {
        // If contains any non-digit characters, search by name
        return [
          {
            field: "name",
            operator: "contains",
            value,
          },
        ];
      }
    },
  });

  return (
    <Create saveButtonProps={modifiedSaveButtonProps}>
      <Form {...formProps} layout="horizontal">
        <Row gutter={16}>
          {" "}
          {/* Добавляем отступы между колонками */}
          {entityFields.map((field, index) => (
            <Col span={8} key={field.name}>
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
          <Col span={12}>
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
          <Col span={8}>
            <Form.Item
              label={"Скидка"}
              name={["discount_custom"]}
            >
              <Input type="number" min={0} max={100} style={{ width: "100%" }} />
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
                  onChange={(info) => {
                      if (info.file.status === "done") {
                      form.setFieldsValue({
                        photo: {
                          file: { response: { filePath: info.file.response.filePath } },
                        },
                      });
                    }
                  }}
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
