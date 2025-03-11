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
  Avatar,
  Tag
} from "antd";
import { useCustom } from "@refinedev/core";
import { 
  SearchOutlined, 
  FileExcelOutlined, 
  PrinterOutlined,
  UserOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { API_URL } from "../../../App";

const { RangePicker } = DatePicker;
const { Title } = Typography;

export const EmployeesReport = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

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
          `${API_URL}/reports/employees?${new URLSearchParams(params as any).toString()}`
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
      title: "Сотрудник",
      dataIndex: "employee",
      key: "employee",
      render: (employee: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={employee.photo} 
            icon={<UserOutlined />} 
            style={{ marginRight: 8 }}
          />
          <span>{employee.firstName} {employee.lastName}</span>
        </div>
      ),
    },
    {
      title: "Должность",
      dataIndex: ["employee", "position"],
      key: "position",
    },
    {
      title: "Филиал",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Количество операций",
      dataIndex: "operationsCount",
      key: "operationsCount",
      sorter: (a: any, b: any) => a.operationsCount - b.operationsCount,
    },
    {
      title: "Сумма операций",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
      render: (value: number) => `${value.toFixed(2)} сом`,
    },
    {
      title: "Эффективность",
      dataIndex: "efficiency",
      key: "efficiency",
      sorter: (a: any, b: any) => a.efficiency - b.efficiency,
      render: (value: number) => {
        let color = 'red';
        if (value >= 80) {
          color = 'green';
        } else if (value >= 60) {
          color = 'orange';
        }
        return <Tag color={color}>{value}%</Tag>;
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
    <List title="Отчет по сотрудникам">
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

      <Card style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Title level={4}>Эффективность сотрудников</Title>
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