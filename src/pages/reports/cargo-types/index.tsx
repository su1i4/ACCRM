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
  Space
} from "antd";
import { useCustom } from "@refinedev/core";
import { 
  SearchOutlined, 
  FileExcelOutlined, 
  PrinterOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { API_URL } from "../../../App";

const { RangePicker } = DatePicker;
const { Title } = Typography;

export const CargoTypesReport = () => {
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
          `${API_URL}/reports/cargo-types?${new URLSearchParams(params as any).toString()}`
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
      title: "Тип груза",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Количество отправок",
      dataIndex: "count",
      key: "count",
      sorter: (a: any, b: any) => a.count - b.count,
    },
    {
      title: "Общий вес (кг)",
      dataIndex: "totalWeight",
      key: "totalWeight",
      sorter: (a: any, b: any) => a.totalWeight - b.totalWeight,
    },
    {
      title: "Общая стоимость",
      dataIndex: "totalCost",
      key: "totalCost",
      sorter: (a: any, b: any) => a.totalCost - b.totalCost,
      render: (value: number) => `${value.toFixed(2)} сом`,
    },
    {
      title: "Процент от общего",
      dataIndex: "percentage",
      key: "percentage",
      render: (value: number) => `${value.toFixed(2)}%`,
    },
  ];

  // Подготовка данных для диаграммы
  const pieData = data.map(item => ({
    type: item.type,
    value: item.count
  }));

  const exportToExcel = () => {
    // Логика экспорта в Excel
    console.log("Экспорт в Excel");
  };

  const printReport = () => {
    // Логика печати отчета
    window.print();
  };

  return (
    <List title="Отчет по типам грузов">
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

      {data.length > 0 && (
        <Card style={{ marginTop: 16 }}>
          <Title level={4}>Распределение типов грузов</Title>
          <div style={{ height: 300 }}>
            {/* Здесь будет диаграмма, но для простоты я ее не реализую полностью */}
            {/* В реальном проекте здесь можно использовать библиотеку для диаграмм, например, Chart.js или Recharts */}
            <div style={{ textAlign: 'center', marginTop: 100 }}>
              [Здесь будет круговая диаграмма распределения типов грузов]
            </div>
          </div>
        </Card>
      )}

      <Card style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Title level={4}>Детализация по типам грузов</Title>
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
          rowKey="type"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </List>
  );
}; 