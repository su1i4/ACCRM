import React from "react";
import {
  Show,
  TextField,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Col, Image, Row, Typography, Button, Space } from "antd";
import { API_URL } from "../../App";
import { DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { translateStatus } from "../../lib/utils";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title } = Typography;

export const GoodsShow: React.FC = () => {
  const { queryResult } = useShow();
  const { data } = queryResult;

  const record = data?.data;

  const PHOTO_URL = API_URL + "/" + record?.photo;

  const handleDownloadPhoto = async () => {
    if (record?.photo) {
      try {
        const response = await fetch(PHOTO_URL);
        const blob = await response.blob();

        const objectUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = objectUrl;

        const filename = record?.trackCode || "photo.jpg";
        link.download = filename;

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(objectUrl);
        }, 100);
      } catch (error) {
        console.error("Error downloading photo:", error);
      }
    }
  };

  // @ts-ignore
  return (
    <Show
      headerButtons={({ deleteButtonProps, editButtonProps }) => (
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
          <TextField value={record?.amount} />
        </Col>

        <Col xs={24} md={6}>
          <Title level={5}>Вид упаковки</Title>
          <TextField value={record?.packageType} />
        </Col>

        <Col xs={24} md={6}>
          <Title level={5}>Цена упаковки</Title>
          <TextField value={record?.pricePackageType} />
        </Col>

        <Col xs={24} md={6}>
          <Title level={5}>Код получателя</Title>
          <TextField
            value={
              record?.counterparty?.clientPrefix +
              "-" +
              record?.counterparty?.clientCode
            }
          />
        </Col>

        <Col xs={24} md={6}>
          <Title level={5}>ФИО получателя</Title>
          <TextField
            value={record?.counterparty?.name || record?.counterparty_id}
          />
        </Col>

        <Col xs={24} md={6}>
          <Title level={5}>Статус</Title>
          <TextField value={translateStatus(record?.status)} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Тариф клиента</Title>
          <TextField
            value={`${(
              Number(record?.counterparty?.branch?.tarif || 0) -
              Number(record?.counterparty?.discount?.discount || 0)
            ).toFixed(2)}`}
          />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Комментарии</Title>
          <TextField value={record?.comments} />
        </Col>

        <Col xs={24} md={6}>
          <Title level={5}>Дата приёма</Title>
          <TextField
            value={dayjs(record?.created_at).utc().format("DD.MM.YYYY HH:mm")}
          />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Место погрузки</Title>
          <TextField value={record?.employee?.branch?.name} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Пункт назначение</Title>
          <TextField
            value={`${record?.counterparty?.branch?.name}, ${
              record?.counterparty?.under_branch?.address || ""
            }`}
          />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Скидка</Title>
          <TextField value={record?.discount} />
        </Col>

        <Col xs={24} md={6}>
          <Title level={5}>Ручная скидка</Title>
          <TextField value={record?.discount_custom} />
        </Col>

        <Col xs={24} md={24}>
          <Title level={5}>Фото</Title>
          {record?.photo ? (
            <Space direction="vertical" size="middle">
              <Image
                style={{ objectFit: "cover" }}
                width={300}
                height={300}
                src={PHOTO_URL}
              />
              <Space direction="horizontal">
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadPhoto}
                >
                  Скачать фото
                </Button>
              </Space>
            </Space>
          ) : (
            <TextField value="Нет фото" />
          )}
        </Col>
      </Row>
    </Show>
  );
};
