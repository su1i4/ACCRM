import React, { useState } from "react";
import { List, useTable, EditButton, ShowButton, DeleteButton } from "@refinedev/antd";
import {Space, Table, Form, Input, Button, Row, Col, Dropdown, Select} from "antd";
import {BaseKey, BaseRecord} from "@refinedev/core";
import { MyCreateModal } from "./modal/create-modal";
import {
    ArrowDownOutlined,
    ArrowUpOutlined, CalendarOutlined,
    EditOutlined,
    FileAddOutlined,
    SearchOutlined, SyncOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import {MyEditModal} from "./modal/edit-modal";
import dayjs from "dayjs";

export const CashDeskList: React.FC = () => {
    const { tableProps, setFilters } = useTable({
        resource: "cash-desk",
        syncWithLocation: true,
        filters:{
            initial:[
                {
                    field:"type",
                    operator:"eq",
                    value:"income"
                },
                // {
                //     field:"status",
                //     operator:"in",
                //     value:"IN_WAREHOUSE"
                // }
            ]
        }
    });

    const [open, setOpen] = useState(false);
    const [filterForm] = Form.useForm();
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const handleEditClick = (id: BaseKey | undefined) => {
        // @ts-ignore
        setEditId(id);
        setOpenEdit(true);
    };

    // @ts-ignore
    return (
        <List headerButtons={() => null}>
            {/* Передаем open и setOpen в модальное окно */}
            <MyCreateModal open={open} onClose={() => setOpen(false)} />
            {/*<MyEditModal id={editId} open={openEdit} onClose={() => setOpenEdit(false)} />*/}

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
                            { label: 'Гуанчжоу', value: 'guangzhou' },
                            { label: 'Бишкек', value: 'bishkek' },
                            { label: 'Ош', value: 'osh' },
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

            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="Номер накладной" />


                <Table.Column
                    dataIndex="counterparty"
                    title="Имя"
                    render={(counterparty) => counterparty ? counterparty.name : ""}
                />

                <Table.Column
                    dataIndex="date"
                    title="Дата поступление"
                    render={(date) => dayjs(date).format("DD.MM.YYYY HH:mm")}
                />


                <Table.Column
                    dataIndex="amount"
                    title="Сумма"
                />

                <Table.Column dataIndex="type_currency" title="валюта" />

                <Table.Column dataIndex="comment" title="Комментарий" />


            </Table>
        </List>
    );
};
