import { List } from "@refinedev/antd";
import {
  Space,
  Table,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Card,
  Modal,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FileAddOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  useCustom,
  useMany,
  useNavigation,
  useUpdate,
  useUpdateMany,
} from "@refinedev/core";
import dayjs from "dayjs";
import { API_URL } from "../../App";

export const GoogsProcessingList = () => {
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [searchFilters, setSearchFilters] = useState<any[]>([{ trackCode: { $contL: "" } }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fixed: Ensure consistent filter structure for API calls
  const buildQueryParams = () => {
    return {
      s: JSON.stringify({ $and: searchFilters }),
      sort: `id,${sortDirection}`,
      limit: pageSize,
      page: currentPage,
      offset: (currentPage - 1) * pageSize,
    };
  };

  const { data, isLoading, refetch } = useCustom<any>({
    url: `${API_URL}/goods-processing`,
    method: "get",
    config: {
      query: buildQueryParams(),
    },
  });

  const [settingVisible, setSettingVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fixed: Update filters function that properly formats filters
  const setFilters = (filters: any[], mode: "replace" | "append" = "append") => {
    if (mode === "replace") {
      setSearchFilters(filters);
    } else {
      setSearchFilters((prevFilters) => [...prevFilters, ...filters]);
    }
    
    // We'll refetch in useEffect after state updates
  };

  // Fixed: Add effect to trigger refetch when filters or sorting changes
  useEffect(() => {
    refetch();
  }, [searchFilters, sortDirection, currentPage, pageSize]);

  const datePickerContent = (
    <DatePicker.RangePicker
      style={{ width: "280px" }}
      placeholder={["Начальная дата", "Конечная дата"]}
      onChange={(dates, dateStrings) => {
        if (dates && dateStrings[0] && dateStrings[1]) {
          // Fixed: Use consistent filter format
          setFilters([
            {
              created_at: {
                $gte: dateStrings[0],
                $lte: dateStrings[1]
              }
            }
          ], "replace");
        }
      }}
    />
  );

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Получаем актуальные данные из хука useCustom
  const dataSource = data?.data?.data || [];
  
  useEffect(() => {
    if (dataSource) {
      const visibleIds = dataSource
        .filter((item: any) => item.visible)
        .map((item: any) => item.id);
      setSelectedRowKeys(visibleIds);
    }
  }, [dataSource]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedKeys);
    },
  };

  const { mutateAsync: update } = useUpdate();

  const handleSaveChanges = async () => {
    const selectedItems = (dataSource || []).map((item: any) => ({
      id: item.id,
      visible: selectedRowKeys.includes(item.id),
    }));

    try {
      await Promise.all(
        selectedItems.map((item: any) =>
          update({
            resource: "goods-processing",
            id: item.id,
            values: { visible: item.visible },
          })
        )
      );
      console.log("Все обновления прошли успешно");
    } catch (error) {
      console.error("Ошибка при обновлении", error);
    }
  };

  const checkboxContent = (
    <Card style={{ padding: 10 }}>
      <Button onClick={handleSaveChanges}>Показать клиенту</Button>
    </Card>
  );

  const { show, push } = useNavigation();

  // Создаем функции для пагинации, которые обычно предоставляет tableProps
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Формируем пропсы для таблицы из данных useCustom
  const tableProps = {
    dataSource: dataSource,
    loading: isLoading,
    pagination: {
      current: currentPage,
      pageSize: pageSize,
      total: data?.data?.total || 0,
    },
    onChange: handleTableChange,
  };

  return (
    <List headerButtons={() => false}>
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space size="middle">
            <Button
              icon={<FileAddOutlined />}
              style={{}}
              onClick={() => push("/goods-processing/create")}
            />
            <Button
              onClick={() => {
                setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
                // No need to call refetch here as it will be triggered by the useEffect
              }}
              icon={
                sortDirection === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
            />
            <Dropdown
              overlay={checkboxContent}
              trigger={["click"]}
              placement="bottomLeft"
              open={settingVisible}
              onOpenChange={(visible) => {
                setSettingVisible(visible);
              }}
            >
              <Button icon={<SettingOutlined />} />
            </Dropdown>
          </Space>
        </Col>
        <Col flex="auto">
          <Input
            placeholder="Поиск по трек-коду, фио получателя или по коду получателя"
            prefix={<SearchOutlined />}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) {
                setFilters([{ trackCode: { $contL: "" } }], "replace");
                return;
              }
              
              // Fixed: Use consistent filter format
              setFilters(
                [
                  {
                    $or: [
                      { trackCode: { $contL: value } },
                      { "counterparty.clientCode": { $contL: value } },
                      { "counterparty.name": { $contL: value } }
                    ]
                  }
                ],
                "replace"
              );
            }}
          />
        </Col>
        <Col>
          <Dropdown
            overlay={datePickerContent}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button icon={<CalendarOutlined />} className="date-picker-button">
              Дата
            </Button>
          </Dropdown>
        </Col>
      </Row>

      <Modal
        title="Новая спецификация"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Треккод">
            <Input />
          </Form.Item>
          <Form.Item label="Тип груза">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onDoubleClick: () => {
            show("goods-processing", record.id as number);
          },
        })}
        rowSelection={rowSelection}
      >
        <Table.Column
          dataIndex="created_at"
          title="Дата приемки"
          render={(value) =>
            value ? dayjs(value).format("DD.MM.YYYY HH:MM") : ""
          }
        />
        <Table.Column dataIndex="trackCode" title="Трек-код" />
        <Table.Column dataIndex="cargoType" title="Тип груза" />
        <Table.Column
          dataIndex="counterparty"
          title="Код получателя"
          render={(value) => {
            return value?.clientPrefix + "-" + value?.clientCode;
          }}
        />
        <Table.Column
          dataIndex="counterparty"
          title="ФИО получателя"
          render={(value) => value?.name}
        />
        <Table.Column
          dataIndex="counterparty"
          render={(value) =>
            `${value?.branch?.name},${value?.under_branch?.address || ""}`
          }
          title="Пункт назначения, Пвз"
        />
        <Table.Column dataIndex="weight" title="Вес" />
        <Table.Column dataIndex="amount" title="Сумма" />
        <Table.Column dataIndex="discount" title="Скидка" />
        <Table.Column dataIndex="paymentMethod" title="Способ оплаты" />
        <Table.Column
          dataIndex="employee"
          title="Сотрудник"
          render={(value) => {
            return `${value?.firstName}-${value?.lastName}`;
          }}
        />
        <Table.Column dataIndex="comments" title="Комментарий" />
      </Table>
    </List>
  );
};