import React from "react";
import {Show, TextField, DateField, useSelect, ListButton,EditButton,DeleteButton,} from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import {Col, Image, Row, Typography} from "antd";
import { API_URL } from "../../App"; // Путь к API_URL, если фото нужно отображать через этот URL


const { Title } = Typography;

export const GoodsShow: React.FC = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    // Предполагается, что data.data содержит объект записи, а связанные данные (branch, counterparty) подгружаются через joins
    const record = data?.data;
    const {queryResult: dataBranch} = useShow({
        resource:"branch",
        id: record?.counterparty.branch_id
    })
    const {data: branch}  =  dataBranch





    // @ts-ignore
    return (
        <Show
            headerButtons={({
                                deleteButtonProps,
                                editButtonProps,
                                listButtonProps,
                                refreshButtonProps,
                            }) => (
                <>

                    {editButtonProps && (
                        <EditButton {...editButtonProps} meta={{ foo: "bar" }} />
                    )}
                    {deleteButtonProps && (
                        <DeleteButton {...deleteButtonProps} meta={{ foo: "bar" }} />
                    )}


                </>
            )}
        >
            <Row gutter={[16, 16]}>

                <Col xs={24} md={6}>
                    <Title level={5}>Трек-код</Title>
                    <TextField value={record?.trackCode} />
                </Col>

                <Col xs={24} md={6}>
                    <Title level={5}>Вес</Title>
                    <TextField value={record?.weight} />
                </Col>

                <Col xs={24} md={6}>
                    <Title level={5}>Тип груза</Title>
                    <TextField value={record?.cargoType} />
                </Col>

                <Col xs={24} md={6}>
                    <Title level={5}>Сумма</Title>
                    <TextField value={record?.amount } />
                </Col>

                <Col xs={24} md={6}>
                    <Title level={5}>Вид  упаковки</Title>
                    <TextField value={record?.packageType } />
                </Col>

                <Col xs={24} md={6}>
                    <Title level={5}>Код получателя</Title>
                    <TextField value={record?.counterparty?.clientPrefix+""+record?.counterparty?.clientCode} />
                </Col>

                <Col xs={24} md={6}>
                    <Title level={5}>ФИО получателя </Title>
                    <TextField value={record?.counterparty?.name || record?.counterparty_id} />
                </Col>


                <Col xs={24} md={6}>
                    <Title level={5}>Статус</Title>
                    <TextField value={record?.status} />
                </Col>
                <Col xs={24} md={6}>
                    <Title level={5}>Комментарии</Title>
                    <TextField value={record?.comments} />
                </Col>
                <Col xs={24} md={6}>
                    <Title level={5}>Дата приёма</Title>
                    <DateField value={record?.created_at} format="YYYY-MM-DD HH:mm:ss" />
                </Col>


                <Col xs={24} md={6}>
                    <Title level={5}>Пункт отправки</Title>
                    <TextField value={record?.branch?.name || record?.branch_id} />
                </Col>

                <Col xs={24} md={6}>
                    <Title level={5}>Пункт назначение</Title>
                    <TextField value={branch?.data.name|| record?.branch_id} />
                </Col>


                <Col xs={24} md={24}>
                    <Title level={5}>Фото</Title>
                    {record?.photo ? (
                        <Image
                            width={200}
                            height={300}
                            src={API_URL.replace('/api', '') + '/' + record?.photo}
                        />
                    ) : (
                        <TextField value="Нет фото" />
                    )}
                </Col>
            </Row>
        </Show>
    );
};
