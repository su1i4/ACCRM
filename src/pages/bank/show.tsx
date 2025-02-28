import { DateField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Table } from "antd";

const { Title } = Typography;
const { Column } = Table;

// Словарь для "type_operation"
const typeOperationMap: Record<string, string> = {
    supplier_payment: "Оплата поставщику",
    repair_payment: "Оплата за ремонт",
    salary_payment: "Выплата заработной платы",
    advance_payment: "Выдача подотчет",
    cash: "Наличные",
    "1": "Приход (1)", // если у вас встречаются "1" или иные значения
    // ... добавляйте при необходимости
};

export const BankShow = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    // Данные банка
    const record = data?.data;

    // Массив операций
    const operations = record?.operation || [];

    return (
        <Show isLoading={isLoading} headerButtons={() => false}>
            <Title level={5}>Филиал</Title>
            <TextField value={record?.name} />

            {/* Таблица с операциями */}
            <Title level={5} style={{ marginTop: 24 }}>
                История операций
            </Title>
            <Table
                dataSource={operations}
                rowKey="id"
                pagination={{ pageSize: 5 }} // Например, пагинация по 5 записей
            >
                <Column
                    title="Дата"
                    dataIndex="date"
                    render={(value) => (
                        <DateField format="YYYY-MM-DD" value={value} />
                    )}
                />
                <Column
                    title="Сумма"
                    dataIndex="amount"
                />
                <Column
                    title="Тип"
                    dataIndex="type"
                    render={(value) => {
                        const isIncome = value === "income";
                        return (
                            <span
                                style={{
                                    padding: "4px 10px",
                                    borderRadius: "9999px",
                                    color: isIncome ? "green" : "red",
                                    backgroundColor: isIncome ? "rgba(0, 128, 0, 0.1)" : "rgba(255, 0, 0, 0.1)",
                                    border: `1px solid ${isIncome ? "green" : "red"}`,
                                }}
                            >
                {isIncome ? "Приход" : "Расход"}
            </span>
                        );
                    }}
                />
                <Column
                    title="Валюта"
                    dataIndex="type_currency"
                />
                <Column
                    title="Тип операции"
                    dataIndex="type_operation"
                    render={(value) => typeOperationMap[value] ?? value}
                />
                <Column
                    title="Комментарий"
                    dataIndex="comment"
                />
            </Table>
        </Show>
    );
};
