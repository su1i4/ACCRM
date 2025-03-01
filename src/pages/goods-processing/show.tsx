import React from "react";
import {Show, TextField, DateField, useSelect, ListButton, EditButton, DeleteButton,} from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import {Col, Image, Row, Typography, Button, Space} from "antd";
import { API_URL } from "../../App"; 
import { DownloadOutlined } from "@ant-design/icons";

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

    console.log(API_URL + '/' + record?.photo, 'this is lox')

    // Function to handle photo download
    const handleDownloadPhoto = async () => {
        if (record?.photo) {
            try {
                const photoUrl = `${API_URL}/${record.photo}`;
                
                // Fetch the image as a blob
                const response = await fetch(photoUrl);
                const blob = await response.blob();
                
                // Create object URL from blob
                const objectUrl = URL.createObjectURL(blob);
                
                // Create a link element
                const link = document.createElement('a');
                link.href = objectUrl;
                
                // Extract filename from path
                const filename = record.photo.split('/').pop() || 'photo.jpg';
                link.download = filename;
                
                // Append to the document, click and then remove
                document.body.appendChild(link);
                link.click();
                
                // Clean up
                setTimeout(() => {
                    document.body.removeChild(link);
                    URL.revokeObjectURL(objectUrl);
                }, 100);
            } catch (error) {
                console.error('Error downloading photo:', error);
                // You could add notification here if desired
            }
        }
    };

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
                        <Space direction="vertical" size="middle">
                            <Image
                                style={{objectFit: 'cover'}}
                                width={300}
                                height={300}
                                src={API_URL + '/' + record?.photo}
                            />
                            <Button 
                                type="primary" 
                                icon={<DownloadOutlined />}
                                onClick={handleDownloadPhoto}
                            >
                                Скачать фото
                            </Button>
                        </Space>
                    ) : (
                        <TextField value="Нет фото" />
                    )}
                </Col>
            </Row>
        </Show>
    );
};