import { useState, useEffect } from "react";
import { Edit, useForm, useSelect, useTable, Show } from "@refinedev/antd";
import { useUpdateMany, useOne, useNavigation, useCustom } from "@refinedev/core";
import { Form, Input, Row, Flex, Select, Col, Table, Button } from "antd";
import { useParams } from "react-router";
import { FileAddOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { API_URL } from "../../App";

const ShipmentAdd = () => {
  const { id } = useParams();
  const { push } = useNavigation();

  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [sortField, setSortField] = useState<"id" | "counterparty.name">("id");
  const [searchFilters, setSearchFilters] = useState<any[]>([
    { status: { $eq: "В складе" } },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const buildQueryParams = () => {
    return {
      s: JSON.stringify({ $and: searchFilters }),
      sort: `${sortField},${sortDirection}`,
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

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);

    // Обрабатываем сортировку, если она пришла из таблицы
    if (sorter && sorter.field) {
      setSortField(
        sorter.field === "counterparty.name" ? "counterparty.name" : "id"
      );
      setSortDirection(sorter.order === "ascend" ? "ASC" : "DESC");
    }
  };

  const dataSource = data?.data?.data || [];

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
            <p style={{width: "200px"}}>
              {`${value?.branch?.name},${value?.under_branch?.address || ""}`}
            </p>
          }
          title="Пункт назначения, Пвз"
        />
        <Table.Column dataIndex="weight" title="Вес" />
      </Table>
    </Show>
  );
};

export default ShipmentAdd;
