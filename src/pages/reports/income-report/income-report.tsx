import React from "react";
import { useGetLocale, useTranslate } from "@refinedev/core";
import { Card, Col, Row, Typography, DatePicker, Button, Form, Select, Space, Table } from "antd";
import { List } from "@refinedev/antd";
import { SearchOutlined, FileExcelOutlined, PrinterOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Title, Paragraph } = Typography;

export const IncomingFundsReport = () => {
    const t = useTranslate();
    
    const columns = [
        {
            title: "Дата прихода",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Источник",
            dataIndex: "source",
            key: "source",
        },
        {
            title: "Сумма",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Форма оплаты",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
        },
        {
            title: "Назначение платежа",
            dataIndex: "purpose",
            key: "purpose",
        }
    ];
    
    const dummyData: any[] = [];
    
    return (
        <List title="Отчеты по приходу">
            <Card style={{ marginBottom: 16 }}>
                <Title level={4}>
                    Поступления денежных средств за определенный период
                </Title>
                
                <Paragraph>
                    Этот отчет анализирует все поступления денежных средств в компанию за выбранный период.
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
                            <Form.Item label="Источник">
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder="Выберите источник"
                                    allowClear
                                >
                                    <Select.Option value="client">Клиент</Select.Option>
                                    <Select.Option value="counterparty">Контрагент</Select.Option>
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