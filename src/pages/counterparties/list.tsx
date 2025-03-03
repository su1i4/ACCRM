import React, { useState } from "react";
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
  Form,
  Input,
  Button,
  Row,
  Col,
  Dropdown,
  Select,
} from "antd";
import { BaseKey, BaseRecord, useNavigation } from "@refinedev/core";
import { MyCreateModal } from "./modal/create-modal";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  EditOutlined,
  FileAddOutlined,
  SearchOutlined,
  SyncOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { MyEditModal } from "./modal/edit-modal";

export const CounterpartyList: React.FC = () => {
  const { tableProps, setFilters } = useTable({
    resource: "counterparty",
    syncWithLocation: false,
  });

  const [open, setOpen] = useState(false);
  const [filterForm] = Form.useForm();

  // Функция фильтрации по поисковому значению (по code и name)
  const onFilterFinish = (values: any) => {
    const filters = [];
    if (values.search) {
      filters.push({
        field: "code",
        operator: "contains",
        value: values.search,
      });
      filters.push({
        field: "name",
        operator: "contains",
        value: values.search,
      });
    }
    // @ts-ignore
    setFilters(filters);
  };

  // Сброс фильтра
  const resetFilter = () => {
    filterForm.resetFields();
    setFilters([]);
  };

  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleEditClick = (id: BaseKey | undefined) => {
    // @ts-ignore
    setEditId(id);
    setOpenEdit(true);
  };

  const { show } = useNavigation();

  return (
    <List headerButtons={() => null}>
      {/* Передаем open и setOpen в модальное окно */}
      <MyCreateModal open={open} onClose={() => setOpen(false)} />
      <MyEditModal
        id={editId}
        open={openEdit}
        onClose={() => setOpenEdit(false)}
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
            <Button icon={<UnorderedListOutlined />} />
            {/*<Dropdown*/}
            {/*    overlay={sortContent}*/}
            {/*    trigger={['click']}*/}
            {/*    placement="bottomLeft"*/}
            {/*    visible={sortVisible}*/}
            {/*    onVisibleChange={(visible) => {*/}
            {/*        setSortVisible(visible);*/}
            {/*        if (visible) {*/}
            {/*            setFilterVisible(true);*/}
            {/*        }*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Button*/}
            {/*        icon={sortDirection === 'asc' ?*/}
            {/*            <ArrowUpOutlined /> :*/}
            {/*            <ArrowDownOutlined />*/}
            {/*        }*/}
            {/*    />*/}
            {/*</Dropdown>*/}
            <Button icon={<SyncOutlined />} />
          </Space>
        </Col>
        <Col flex="auto">
          <Input
            placeholder="Поиск по трек-коду или коду клиента"
            prefix={<SearchOutlined />}
            onChange={(e) => {
              setFilters([
                {
                  field: "trackCode",
                  operator: "contains",
                  value: e.target.value,
                },
              ]);
            }}
          />
        </Col>
        <Col>
          <Select
            mode="multiple"
            placeholder="Выберите филиал"
            style={{ width: 200 }}
            onChange={(value) => {
              setFilters([
                {
                  field: "branch",
                  operator: "in",
                  value,
                },
              ]);
            }}
            options={[
              { label: "Гуанчжоу", value: "guangzhou" },
              { label: "Бишкек", value: "bishkek" },
              { label: "Ош", value: "osh" },
            ]}
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
      >
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column
          dataIndex="codeClientAndPrefix"
          title="Код клиента"
          render={(_, record: BaseRecord) => {
            if (!record.clientPrefix || !record.clientCode) return "";
            return record.clientPrefix + "-" + record.clientCode;
          }}
        />
        <Table.Column dataIndex="name" title="Фио" />
        <Table.Column dataIndex="address" title="Адрес" />
        <Table.Column dataIndex="phoneNumber" title="Номер телефона" />
        <Table.Column dataIndex="email" title="Почта" />
        <Table.Column dataIndex="totalWeight" title="Сумма заказов Кг" />
        <Table.Column dataIndex="totalUsd" title="Сумма заказов USD" />
        <Table.Column dataIndex="comment" title="Комментарий" />
      </Table>
    </List>
  );
};
