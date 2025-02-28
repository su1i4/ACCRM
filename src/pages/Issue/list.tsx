import {
    List,
    useTable,
    DeleteButton,
    ShowButton
} from "@refinedev/antd";
import { BaseRecord, useUpdateMany } from "@refinedev/core";
import {
    Space,
    Table,
    Input,
    Button,
    Row,
    Col,
    DatePicker,
    Form,
    Card,
    Image
} from "antd";
import {
    SearchOutlined,
    CheckOutlined
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { API_URL } from "../../App";

export const IssueProcessingList = () => {
    const { tableProps, setFilters } = useTable({
        resource: "goods-processing",
        syncWithLocation: true,
    });

    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    const { mutate: updateManyGoods } = useUpdateMany({
        resource: "goods-processing",
    });

    // Обновление статуса для выбранных записей
    const handleAcceptSelected = () => {
        if (!selectedRowKeys.length) {
            return;
        }
        updateManyGoods({
            ids: selectedRowKeys,
            values: { status: "Выдали" }, // Значение статуса можно заменить на нужное
        });
    };

    // Обработка выбора строк таблицы
    const handleRowSelectionChange = (keys: number[], selectedRows: BaseRecord[]) => {
        setSelectedRowKeys(keys);
    };

    // Функция фильтрации по трек-коду и диапазону дат
    const handleFilter = (values: any) => {
        const filters = [];
        if (values.trackCode) {
            filters.push({
                field: "trackCode",
                operator: "contains",
                value: values.trackCode,
            });
        }
        if (values.dateRange) {
            filters.push({
                field: "created_at",
                operator: "gte",
                value: dayjs(values.dateRange[0]).format("YYYY-MM-DD"),
            });
            filters.push({
                field: "created_at",
                operator: "lte",
                value: dayjs(values.dateRange[1]).format("YYYY-MM-DD"),
            });
        }
        // @ts-ignore
        setFilters(filters);
    };


    // @ts-ignore
    // @ts-ignore
    return (
        <List>
            {/* Форма фильтрации сверху */}
            <Row style={{ marginBottom: 16 }}>
                <Col span={24}>
                    <Form layout="inline" onFinish={handleFilter}>
                        <Form.Item name="trackCode">
                            <Input
                                placeholder="Поиск по трек-коду"
                                prefix={<SearchOutlined />}
                            />
                        </Form.Item>
                        <Form.Item name="dateRange">
                            <DatePicker.RangePicker
                                placeholder={["Начальная дата", "Конечная дата"]}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Применить
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

            {/* Кнопка для принятия выбранных товаров */}
            <Row style={{ marginBottom: 16 }}>
                <Col>
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={handleAcceptSelected}
                        disabled={!selectedRowKeys.length}
                    >
                        Принять выбранные товары
                    </Button>
                </Col>
            </Row>

            <Table
                {...tableProps}
                rowKey="id"
                rowSelection={{
                    type: "checkbox",
                    selectedRowKeys,
                    // @ts-ignore
                    onChange: handleRowSelectionChange,
                }}
            >
                <Table.Column
                    dataIndex="receptionDate"
                    title="Дата"
                    render={(value) =>
                        value ? dayjs(value).format("DD.MM.YYYY HH:mm") : ""
                    }
                />
                <Table.Column dataIndex="trackCode" title="Треккод" />
                <Table.Column dataIndex="cargoType" title="Тип груза" />
                <Table.Column
                    dataIndex="counterparty_id"
                    title="Код получателя"
                    render={(value) => value}
                />
                <Table.Column
                    dataIndex="counterparty_id"
                    title="ФИО получателя"
                    render={(value) => value}
                />
                <Table.Column dataIndex="destinationPoint" title="Пункт назначения" />
                <Table.Column dataIndex="weight" title="Вес" />
                <Table.Column dataIndex="amount" title="Сумма" />
                <Table.Column dataIndex="paymentMethod" title="Способ оплаты" />
                <Table.Column
                    dataIndex="employee_id"
                    title="Сотрудник"
                    render={(value) => value}
                />
                <Table.Column
                    dataIndex="branch_id"
                    title="Филиал"
                    render={(value) => value}
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
                    title="Действия"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <ShowButton hideText size="small" recordItemId={record.id} />
                            <DeleteButton hideText size="small" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
