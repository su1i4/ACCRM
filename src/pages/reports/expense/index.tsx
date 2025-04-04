import React, { useState } from "react";
import { List } from "@refinedev/antd";
import { 
  Card, 
  Table, 
  DatePicker, 
  Button, 
  Row, 
  Col, 
  Select, 
  Form, 
  Typography,
  Space,
  Statistic
} from "antd";
import { useCustom } from "@refinedev/core";
import { 
  SearchOutlined, 
  FileExcelOutlined, 
  PrinterOutlined,
  ArrowDownOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { API_URL } from "../../../App";

const { RangePicker } = DatePicker;
const { Title } = Typography;

export const ExpenseReport = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);

  // Получение списка филиалов
  const { data: branchesData } = useCustom<any>({
    url: `${API_URL}/branch`,
    method: "get",
  });

  const branches = branchesData?.data?.data || [];

  const fetchReport = () => {
    if (!dateRange) return;

    setLoading(true);
    
    const [startDate, endDate] = dateRange;
    
    const params = {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      ...(branch && { branchId: branch }),
    };

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/reports/expense?${new URLSearchParams(params as any).toString()}`
        );
        const result = await response.json();
        setData(result?.data || []);
        
        // Расчет общего расхода
        const total = result?.data?.reduce((sum: number, item: any) => 
          sum + item.amount, 0) || 0;
        
        setTotalExpense(total);
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
      title: "Дата",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD.MM.YYYY"),
    },
    {
      title: "Филиал",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Сумма",
      dataIndex: "amount",
      key: "amount",
      sorter: (a: any, b: any) => a.amount - b.amount,
      render: (amount: number) => (
        <span style={{ color: 'red' }}>
          {amount.toFixed(2)} сом
        </span>
      ),
    },
    {
      title: "Сотрудник",
      dataIndex: "employee",
      key: "employee",
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
    <List title="Отчет по расходу">
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
            <Col xs={24} sm={12} md={8} lg={8}>
              <Form.Item label="Филиал">
                <Select
                  style={{ width: "100%" }}
                  placeholder="Выберите филиал"
                  allowClear
                  onChange={(value) => setBranch(value)}
                >
                  {branches.map((branch: any) => (
                    <Select.Option key={branch.id} value={branch.id}>
                      {branch.name}
                    </Select.Option>
                  ))}
                </Select>
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
          <Statistic
            title="Общий расход за период"
            value={totalExpense}
            precision={2}
            valueStyle={{ color: '#cf1322' }}
            prefix={<ArrowDownOutlined />}
            suffix="сом"
          />
        </Card>
      )}

      <Card style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Title level={4}>Операции расхода</Title>
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
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}>
                  <strong>Итого</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong style={{ color: 'red' }}>{totalExpense.toFixed(2)} сом</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </List>
  );
}; 