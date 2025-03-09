import React, { useState, useEffect } from "react";
import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";
import {
  Space,
  Table,
  Input,
  Button,
  Row,
  Col,
  Dropdown,
  Card,
} from "antd";
import { BaseKey, BaseRecord, useNavigation, useCustom } from "@refinedev/core";
import { MyCreateModal } from "./modal/create-modal";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  FileAddOutlined,
  SearchOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { MyEditModal } from "./modal/edit-modal";
import { API_URL } from "../../App";

export const CounterpartyList: React.FC = () => {
  const [sortField, setSortField] = useState<"name" | "clientCode" | "id">("id");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [sorterVisible, setSorterVisible] = useState(false);
  
  const { tableProps: defaultTableProps, setFilters } = useTable({
    resource: "counterparty",
    syncWithLocation: false,
    pagination: {
      mode: "off",
    },
  });

  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Функция для построения параметров запроса с сортировкой и фильтрами
  const buildQueryParams = () => {
    const params: any = {
      sort: `${sortField},${sortDirection}`,
    };
    
    // Добавляем параметр поиска, если он есть
    if (searchValue) {
      params.s = JSON.stringify({
        $or: [
          { name: { $contL: searchValue } },
          { clientCode: { $contL: searchValue } },
          { clientPrefix: { $contL: searchValue } }
        ]
      });
    }
    
    return params;
  };

  // Используем useCustom для получения данных с сортировкой
  const { data, isLoading, refetch } = useCustom<any>({
    url: `${API_URL}/counterparty`,
    method: "get",
    config: {
      query: buildQueryParams(),
    },
  });

  // Обновляем данные при изменении параметров сортировки или поиска
  useEffect(() => {
    refetch();
  }, [sortDirection, sortField, searchValue]);

  // Обновляем данные при монтировании компонента
  useEffect(() => {
    refetch();
  }, []);

  // Подготавливаем данные для таблицы
  const dataSource = data?.data || [];
  const tableProps = {
    ...defaultTableProps,
    dataSource: dataSource,
    loading: isLoading,
  };

  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleEditClick = (id: BaseKey | undefined) => {
    // @ts-ignore
    setEditId(id);
    setOpenEdit(true);
  };

  const { show } = useNavigation();

  // Содержимое выпадающего меню сортировки
  const sortContent = (
    <Card style={{ width: 200, padding: "0px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div
          style={{
            marginBottom: "8px",
            color: "#666",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          Сортировать по
        </div>
        {/* Сортировка по имени */}
        <Button
          type="text"
          style={{
            textAlign: "left",
            fontWeight: sortField === "id" ? "bold" : "normal",
          }}
          onClick={() => {
            setSortField("id");
            setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
          }}
        >
          Дате создания{" "}
          {sortField === "id" && (sortDirection === "ASC" ? "↑" : "↓")}
        </Button>
        <Button
          type="text"
          style={{
            textAlign: "left",
            fontWeight: sortField === "name" ? "bold" : "normal",
          }}
          onClick={() => {
            setSortField("name");
            setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
            // setSorterVisible(false);
          }}
        >
          Имени{" "}
          {sortField === "name" && (sortDirection === "ASC" ? "↑" : "↓")}
        </Button>
        {/* Сортировка по коду клиента */}
        <Button
          type="text"
          style={{
            textAlign: "left",
            fontWeight: sortField === "clientCode" ? "bold" : "normal",
          }}
          onClick={() => {
            setSortField("clientCode");
            setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
            // setSorterVisible(false);
          }}
        >
          Коду клиента{" "}
          {sortField === "clientCode" && (sortDirection === "ASC" ? "↑" : "↓")}
        </Button>
      </div>
    </Card>
  );

  return (
    <List headerButtons={() => null}>
      {/* Передаем open и setOpen в модальное окно */}
      <MyCreateModal 
        open={open} 
        onClose={() => setOpen(false)} 
        onSuccess={() => refetch()} 
      />
      <MyEditModal
        id={editId}
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSuccess={() => refetch()}
      />

      {/* Верхняя панель с фильтром и кнопкой создания */}
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space size="middle">
            <Button
              icon={<FileAddOutlined />}
              style={{}}
              onClick={() => setOpen(true)}
            />

            {/*<Button icon={<EditOutlined />} onClick={handleBulkEdit} />*/}
            {/* <Button icon={<UnorderedListOutlined />} /> */}
            
            <Dropdown
              overlay={sortContent}
              trigger={["click"]}
              placement="bottomLeft"
              open={sorterVisible}
              onOpenChange={(visible) => {
                setSorterVisible(visible);
              }}
            >
              <Button
                icon={
                  sortDirection === "ASC" ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )
                }
              />
            </Dropdown>
            
            <Button icon={<SyncOutlined />} onClick={() => refetch()} title="Обновить данные" />
          </Space>
        </Col>
        <Col flex="auto">
          <Input
            placeholder="Поиск по фио или по коду клиента"
            prefix={<SearchOutlined />}
            onChange={(e) => {
              const value = e.target.value;
              setSearchValue(value);
            }}
            value={searchValue}
            suffix={
              searchValue ? (
                <CloseCircleOutlined
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSearchValue('');
                  }}
                />
              ) : isLoading ? (
                <SyncOutlined spin />
              ) : null
            }
          />
        </Col>
        <Col>
          {/*<Dropdown*/}
          {/*    overlay={}*/}
          {/*    trigger={['click']}*/}
          {/*    placement="bottomRight"*/}
          {/*>*/}
          {/*    <Button*/}
          {/*        icon={<CalendarOutlined />}*/}
          {/*        className="date-picker-button"*/}
          {/*    >*/}
          {/*        Дата*/}
          {/*    </Button>*/}
          {/*</Dropdown>*/}
        </Col>
      </Row>

      <Table
        onRow={(record) => ({
          onDoubleClick: () => {
            show("counterparty", record.id as number);
          },
        })}
        {...tableProps}
        rowKey="id"
        locale={{
          emptyText: searchValue ? 'По вашему запросу ничего не найдено' : 'Нет данных'
        }}
      >
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column
          dataIndex="codeClientAndPrefix"
          title="Код клиента"
          render={(_, record: BaseRecord) => {
            if (!record.clientPrefix || !record.clientCode) return "";
            return record.clientPrefix + "-" + record.clientCode;
          }}
          width={120}
        />
        <Table.Column dataIndex="name" title="Фио" />
        <Table.Column dataIndex="address" title="Адрес" />
        <Table.Column dataIndex="phoneNumber" title="Номер телефона" />
        <Table.Column dataIndex="email" title="Почта" />
        <Table.Column dataIndex="goods" title="Сумма заказов Кг" render={(value) => {
          return value.reduce((acc: number, curr: any) => acc + Number(curr.weight), 0);
        }} />
        <Table.Column dataIndex="goods" title="Сумма заказов USD" render={(value) => {
          return value.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
        }} />
        <Table.Column dataIndex="comment" title="Комментарий" />
      </Table>
    </List>
  );
};
