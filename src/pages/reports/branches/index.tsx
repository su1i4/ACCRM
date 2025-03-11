import React, { useState } from "react";
import { List } from "@refinedev/antd";
import { 
  Card, 
  Table, 
  DatePicker, 
  Button, 
  Row, 
  Col, 
  Form, 
  Typography,
  Space,
  Progress
} from "antd";
import { useCustom } from "@refinedev/core";
import { 
  SearchOutlined, 
  FileExcelOutlined, 
  PrinterOutlined,
  BranchesOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { API_URL } from "../../../App";

const { RangePicker } = DatePicker;
const { Title } = Typography;

export const BranchesReport = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const fetchReport = () => {
    if (!dateRange) return;

    setLoading(true);
    
    const [startDate, endDate] = dateRange;
    
    const params = {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
    };

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/reports/branches?${new URLSearchParams(params as any).toString()}`
        );
        const result = await response.json();
        setData(result?.data || []);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  const columns = [
    {
      title: "Филиал",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Количество операций",
      dataIndex: "operationsCount",
      key: "operationsCount",
      sorter: (a: any, b: any) => a.operationsCount - b.operationsCount,
    },
    {
      title: "Приход",
      dataIndex: "income",
      key: "income",
      sorter: (a: any, b: any) => a.income - b.income,
      render: (value: number) => (
        <span style={{ color: 'green' }}>
          {value.toFixed(2)} сом
        </span>
      ),
    },
    {
      title: "Расход",
      dataIndex: "expense",
      key: "expense",
      sorter: (a: any, b: any) => a.expense - b.expense,
      render: (value: number) => (
        <span style={{ color: 'red' }}>
          {value.toFixed(2)} сом
        </span>
      ),
    },
    {
      title: "Баланс",
      dataIndex: "balance",
      key: "balance",
      sorter: (a: any, b: any) => a.balance - b.balance,
      render: (value: number) => (
        <span style={{ color: value >= 0 ? 'green' : 'red' }}>
          {value.toFixed(2)} сом
        </span>
      ),
    },
    {
      title: "Эффективность",
      dataIndex: "efficiency",
      key: "efficiency",
      sorter: (a: any, b: any) => a.efficiency - b.efficiency,
      render: (value: number) => {
        let strokeColor = '#ff4d4f';
        if (value >= 80) {
          strokeColor = '#52c41a';
        } else if (value >= 60) {
          strokeColor = '#faad14';
        }
        return <Progress percent={value} size="small" strokeColor={strokeColor} />;
      },
    },
  ];

  const exportToExcel = () => {
    // Логика экспорта в Excel
    console.log("Экспорт в Excel");
  };

  const printReport = () => {
    // Логика печати отчета
    window.print();
  };

  return (
    <List title="Отчет по филиалам">
      <Card>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item label="Период">
                <RangePicker
                  style={{ width: "100%" }}
                  onChange={(dates) => {
                    setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs]);
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} style={{ display: "flex", alignItems: "flex-end" }}>
              <Button 
                type="primary" 
                icon={<SearchOutlined />} 
                onClick={fetchReport}
                disabled={!dateRange}
              >
                Сформировать отчет
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Title level={4}>Показатели филиалов</Title>
          <Space>
            <Button 
              icon={<FileExcelOutlined />} 
              onClick={exportToExcel}
              disabled={data.length === 0}
            >
              Экспорт в Excel
            </Button>
            <Button 
              icon={<PrinterOutlined />} 
              onClick={printReport}
              disabled={data.length === 0}
            >
              Печать
            </Button>
          </Space>
        </div>
        <Table 
          dataSource={data} 
          columns={columns} 
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </List>
  );
}; 