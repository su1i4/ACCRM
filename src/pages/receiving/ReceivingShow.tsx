import React, { useState } from "react";
import {
  DeleteButton,
  EditButton,
  Show,
  TextField,
  useTable,
} from "@refinedev/antd";
import {
  useUpdateMany,
  useParsed,
  useShow,
  useNavigation,
} from "@refinedev/core";
import { Typography, Row, Col, Table, Button, Space } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router";
import { API_URL } from "../../App";
import { translateStatus } from "../../lib/utils";

const { Title } = Typography;

const ReceivingShow = () => {
  const { id } = useParams();

  const { queryResult } = useShow({
    resource: "shipments",
    id,
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { tableProps } = useTable({
    resource: "goods-processing",
    syncWithLocation: false,
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    filters: {
      permanent: [
        {
          field: "shipment_id",
          operator: "eq",
          value: Number(id),
        },
        {
          field: "status",
          operator: "eq",
          value: "В пути",
        },
      ],
    },
  });

  const postIds = async (ids: Record<string, number[]>) => {
    const token = localStorage.getItem("access_token");

    await fetch(`${API_URL}/goods-processing/send-notification-tg`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ids),
    });
  };
  // -----------------------
  // 1. Состояние для выделенных строк
  // -----------------------
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [transformData, setTransformData] = useState({});

  // Настройка антовского rowSelection
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedKeys: React.Key[], newSelectedRows: any[]) => {
      setSelectedRowKeys(newSelectedKeys);

      let tpsIds: Record<string, number[]> = {};

      newSelectedRows.forEach((item: any) => {
        const clientCode = item.counterparty?.clientCode;
        const itemId = item.id;

        if (!clientCode) return;

        if (!tpsIds[clientCode]) {
          tpsIds[clientCode] = [];
        }

        if (tpsIds[clientCode].includes(itemId)) {
          tpsIds[clientCode] = tpsIds[clientCode].filter((id) => id !== itemId);
        } else {
          tpsIds[clientCode].push(itemId);
        }
      });

      setTransformData(tpsIds);
    },
  };

  console.log(transformData, "transformData");

  // -----------------------
  // 2. Массовое обновление
  // -----------------------
  const { mutate, isLoading: isUpdating } = useUpdateMany();

  const handleSetReadyToIssue = () => {
    mutate(
      {
        resource: "goods-processing",
        // @ts-ignore
        ids: selectedRowKeys,
        values: { status: "Готов к выдаче" },
      },
      {
        onSuccess: () => {
          setSelectedRowKeys([]);
          postIds(transformData);
        },
      }
    );
  };

  const { push } = useNavigation();

  return (
    <Show headerButtons={() => false} isLoading={isLoading}>
      {/* Данные о текущем рейсе */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Title level={5}>Номер рейса</Title>
          <TextField value={id} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Тип груза</Title>
          <TextField value={record?.type} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}> Код коробки</Title>
          <TextField value={record?.boxCode} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Номер фуры</Title>
          <TextField value={record?.truck_number} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Пункт назначения</Title>
          <TextField value={record?.branch?.name} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Место погрузки</Title>
          <TextField value={record?.employee?.branch?.name} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Сотрудник</Title>
          <TextField
            value={`${record?.employee?.firstName || ""}-${
              record?.employee?.lastName || ""
            }`}
          />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Вес</Title>
          <TextField value={record?.weight} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Размеры (Д × Ш × В)</Title>
          <TextField
            value={`${record?.length}_x 
               _${record?.width}_x_${record?.height}`}
          />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Куб</Title>
          <TextField value={record?.cube} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Плотность</Title>
          <TextField value={record?.density} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Количество посылок</Title>
          <TextField value={record?.goodsCount} />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Дата</Title>
          <TextField
            value={`${record?.created_at?.split("T")[0]} ${record?.created_at
              ?.split("T")[1]
              ?.slice(0, 5)}`}
          />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Обновлено</Title>
          <TextField
            value={`${record?.updated_at?.split("T")[0]} ${record?.updated_at
              ?.split("T")[1]
              ?.slice(0, 5)}`}
          />
        </Col>
        <Col xs={24} md={6}>
          <Title level={5}>Статус</Title>
          <TextField value={translateStatus(record?.status)} />
        </Col>
      </Row>

      <Title level={4} style={{ marginTop: 24 }}>
        Товары в этом рейсе
      </Title>

      {/* Кнопки массового изменения статуса */}
      <Space style={{ marginBottom: 16 }}>
        <Button
          onClick={handleSetReadyToIssue}
          disabled={selectedRowKeys.length === 0 || isUpdating}
        >
          Принять
        </Button>
      </Space>

      {/* Таблица со списком товаров и чекбоксами */}
      <Table {...tableProps} rowKey="id" rowSelection={rowSelection}>
        <Table.Column
          dataIndex="created_at"
          title="Дата приемки"
          width={120}
          render={(value) => {
            return `${value?.split("T")[0]} ${value
              ?.split("T")[1]
              ?.slice(0, 5)}`;
          }}
        />
        <Table.Column dataIndex="cargoType" title="Тип груза" />
        <Table.Column dataIndex="trackCode" title="Треккод" />
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
          render={(value) => (
            <p
              style={{
                width: "200px",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {`${value?.branch?.name}, ${value?.under_branch?.address || ""}`}
            </p>
          )}
          title="Пункт назначения, Пвз"
        />
        <Table.Column dataIndex="weight" title="Вес" />
        <Table.Column
          dataIndex="status"
          title="Статус"
          render={(value) => translateStatus(value)}
        />
      </Table>
    </Show>
  );
};

export default ReceivingShow;
