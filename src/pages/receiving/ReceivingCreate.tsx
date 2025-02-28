import React, { useState } from "react";
import {
    Create,
    useForm,
    useTable
} from "@refinedev/antd";
import { useUpdateMany } from "@refinedev/core";
import { Form, Input, DatePicker, Row, Col, Table } from "antd";

/**
 * Пример: Когда мы нажимаем "Сохранить" (Create),
 * 1) создаётся рейс (shipment),
 * 2) затем сразу обновляются выбранные товары (goods-processing),
 *    проставляя им shipment_id = ID созданного рейса.
 */
   const  ReceivingCreate = () => {
    /**
     * Состояние для ID выбранных товаров
     */
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

    /**
     * Хук для массового обновления (updateMany) товаров.
     * Здесь указываем ресурс "goods-processing" — именно его обновляем.
     */
    const { mutate: updateManyGoods } = useUpdateMany({
        resource: "goods-processing",
        // Можно дополнительно указать onSuccess / onError, если нужно.
    });

    /**
     * Хук формы для создания "shipments".
     * При удачном создании (onMutationSuccess)
     * мы получим ID нового рейса, и сразу используем updateMany для товаров.
     */
    const { formProps, saveButtonProps } = useForm({
        resource: "shipments",
        // Срабатывает после успешного "create" (создания рейса)
        onMutationSuccess: async (createdShipment) => {
            const newShipmentId = createdShipment.data.id;
            // Если выбраны товары, то обновляем их массово
            if (selectedRowKeys.length > 0) {
                updateManyGoods({
                    ids: selectedRowKeys,
                    values: {
                        shipment_id: newShipmentId,
                        status: "IN_TRANSIT"
                    },
                });
            }
        },
    });

    /**
     * useTable для ресурса "goods-processing".
     * Показываем товары, которые пользователь сможет выбрать для привязки.
     */
    const { tableProps } = useTable({
        resource: "goods-processing",
        syncWithLocation: false,
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        filters:{
            initial:[
                {
                    field:"shipment_id",
                    operator:"null",
                    value:"null"
                },
                {
                    field:"status",
                    operator:"in",
                    value:"IN_WAREHOUSE"
                }
            ]
        }
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            label="Номер рейса"
                            name="flightNumber"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Пункт назначения"
                            name="destination"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Дата"
                            name="date"
                            rules={[{ required: true }]}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                format="YYYY-MM-DD HH:mm:ss"
                                showTime
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Сумма"
                            name="amount"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            label="Код коробки"
                            name="boxCode"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Место погрузки"
                            name="loadingPlace"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Количество мест"
                            name="numberOfSeats"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Вес"
                            name="weight"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            label="Куб"
                            name="cube"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Сотрудник"
                            name="employee"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Тип"
                            name="type"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Таблица со списком товаров, которые можно выбрать для "привязки" к новому рейсу */}
                <Row gutter={16}>
                    <Col span={24}>
                        <Table
                            {...tableProps}
                            rowKey="id"
                            rowSelection={{
                                type: "checkbox",
                                onChange: (keys) => {
                                    setSelectedRowKeys(keys as number[]);
                                },
                            }}
                        >
                            <Table.Column dataIndex="receptionDate" title="Дата" />
                            <Table.Column dataIndex="cargoType" title="ТПН" />
                            <Table.Column dataIndex="trackCode" title="Треккод" />
                            <Table.Column dataIndex="weight" title="Код Клиента" />
                            <Table.Column dataIndex="trackCode" title="Получатель" />
                            <Table.Column dataIndex="weight" title="Город" />
                            <Table.Column dataIndex="weight" title="Вес" />
                            {/* Добавьте остальные нужные колонки */}
                        </Table>
                    </Col>
                </Row>
            </Form>
        </Create>
    );
};


   export  default ReceivingCreate;