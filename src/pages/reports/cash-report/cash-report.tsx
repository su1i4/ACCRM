import React from "react";
import { useGetLocale, useTranslate } from "@refinedev/core";
import { Card, Col, Row, Typography, DatePicker, Button, Form, Select, Space, Table } from "antd";
import { List } from "@refinedev/antd";
import { SearchOutlined, FileExcelOutlined, PrinterOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Title, Paragraph } = Typography;

export const CashOperationsReport = () => {
    const t = useTranslate();
    
    const columns = [
        {
            title: "Дата операции",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Тип операции",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Сумма",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Филиал",
            dataIndex: "branch",
            key: "branch",
        },
        {
            title: "Кассир",
            dataIndex: "cashier",
            key: "cashier",
        }
    ];
    
    const dummyData: any[] = [];
    
    return (
        <List title="Отчеты по кассам">
            <Card style={{ marginBottom: 16 }}>
                <Title level={4}>
                    Анализ поступлений и выдач наличных средств через кассы
                </Title>
                
                <Paragraph>
                    Этот отчет предоставляет данные по всем кассовым операциям за выбранный период.
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
                            <Form.Item label="Филиал">
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder="Выберите филиал"
                                    allowClear
                                >
                                    <Select.Option value="1">Филиал 1</Select.Option>
                                    <Select.Option value="2">Филиал 2</Select.Option>
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
                    <Title level={4}>Параметры отчета</Title>
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