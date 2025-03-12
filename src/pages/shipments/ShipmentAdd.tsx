import { useState, useEffect } from "react";
import { Edit, useForm, useSelect, useTable, Show } from "@refinedev/antd";
import { useUpdateMany, useOne, useNavigation } from "@refinedev/core";
import { Form, Input, Row, Flex, Select, Col, Table, Button } from "antd";
import { useParams } from "react-router";
import { FileAddOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const ShipmentAdd = () => {
  const { id } = useParams();
  const { show, push } = useNavigation();

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
      initial: [
        {
          field: "status",
          operator: "eq",
          value: "В складе",
        },
      ],
    },
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const { mutate: updateManyGoods } = useUpdateMany({
    resource: "goods-processing",
  });

  const {
    formProps,
    saveButtonProps: originalSaveButtonProps,
    form,
    formLoading,
  } = useForm({
    resource: "shipments",
    action: "edit",
    id,
    redirect: false,
    onMutationSuccess: async (updatedShipment) => {
      // Обновляем выбранные товары (устанавливаем статус "В складе")
      if (selectedRowKeys.length > 0) {
        await updateManyGoods({
          ids: selectedRowKeys,
          values: {
            shipment_id: Number(id),
            status: "В пути",
          },
        });
      }

      push(`/shipments/edit/${id}`);
    },
  });

  // Функция для обработки сохранения
  const handleSave = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        await updateManyGoods({
          ids: selectedRowKeys,
          values: {
            shipment_id: Number(id),
            status: "В пути",
          },
        });
        push(`/shipments/edit/${id}`);
      } catch (error) {
        console.error("Ошибка при сохранении:", error);
      }
    } else {
      push(`/shipments/edit/${id}`);
    }
  };

  return (
    <Show
      headerButtons={() => (
        <Flex gap={8}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => push(`/shipments/edit/${id}`)}
          >
            Назад
          </Button>
          <Button type="primary" onClick={handleSave} loading={formLoading}>
            Сохранить
          </Button>
        </Flex>
      )}
    >
      <Table
        {...tableProps}
        rowKey="id"
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: selectedRowKeys,
          onChange: (keys, rows) => {
            setSelectedRowKeys(keys as number[]);
            setSelectedRows(rows);

            // Сбрасываем ошибку при выборе товаров
            if (keys.length > 0 && form.getFieldError("_goods")?.length > 0) {
              form.setFields([{ name: "_goods", errors: [] }]);
            }
          },
        }}
        locale={{
          emptyText: "Нет доступных товаров для отправки",
        }}
      >
        <Table.Column
          dataIndex="created_at"
          title="Дата"
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

        <Table.Column dataIndex="status" title="Статус" />
        <Table.Column
          dataIndex="counterparty"
          render={(value) =>
            `${value?.branch?.name},${value?.under_branch?.address || ""}`
          }
          title="Пункт назначения, Пвз"
        />
        <Table.Column dataIndex="weight" title="Вес" />
      </Table>
    </Show>
  );
};

export default ShipmentAdd;
