import React from "react";
import { useGetLocale, useTranslate } from "@refinedev/core";
import { Card, Col, Row, Typography, DatePicker, Button, Form, Select, Space, Table } from "antd";
import { List } from "@refinedev/antd";
import { SearchOutlined, FileExcelOutlined, PrinterOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Title, Paragraph } = Typography;

export const ExpenseFinanceReport = () => {
    const t = useTranslate();
    
    const columns = [
        {
            title: "Дата расхода",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Статья расхода",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Сумма",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Получатель средств",
            dataIndex: "recipient",
            key: "recipient",
        },
        {
            title: "Ответственный за оплату",
            dataIndex: "responsible",
            key: "responsible",
        }
    ];
    
    const dummyData: any[] = [];
    
    return (
        <List title="Отчеты по расходам">
            <Card style={{ marginBottom: 16 }}>
                <Title level={4}>
                    Финансовый учет расходов компании
                </Title>
                
                <Paragraph>
                    Данный отчет содержит информацию о всех расходах компании за выбранный период.
                </Paragraph>
                
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8} lg={8}>
                            <Form.Item label="Период">
                                <RangePicker
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8}>
                            <Form.Item label="Статья расхода">
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder="Выберите статью"
                                    allowClear
                                >
                                    <Select.Option value="logistics">Логистика</Select.Option>
                                    <Select.Option value="rent">Аренда</Select.Option>
                                    <Select.Option value="salary">Зарплаты</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} style={{ display: "flex", alignItems: "flex-end" }}>
                            <Button 
                                type="primary" 
                                icon={<SearchOutlined />}
                            >
                                Сформировать отчет
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
            
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <Title level={4}>Результаты</Title>
                    <Space>
                        <Button icon={<FileExcelOutlined />}>
                            Экспорт в Excel
                        </Button>
                        <Button icon={<PrinterOutlined />}>
                            Печать
                        </Button>
                    </Space>
                </div>
                
                <Table 
                    dataSource={dummyData} 
                    columns={columns} 
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </List>
    );
}; 