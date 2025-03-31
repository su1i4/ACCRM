import React, { useState, useEffect } from "react";
import {
  Create,
  TextField,
  Title,
  useForm,
  useSelect,
  useTable,
} from "@refinedev/antd";
import { useCustom, useNavigation, useUpdateMany } from "@refinedev/core";
import { Input, Table, Flex, Button, Modal, Typography, notification } from "antd";
import { catchDateTable, translateStatus } from "../../../lib/utils";
import { API_URL } from "../../../App";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useSearchParams } from "react-router";
import { CustomTooltip } from "../../../shared";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ResendModalProps {
  open: boolean;
  handleClose: () => void;
  onSuccess?: () => void;
  selectedRowKeys: any[];
  filterId?: number;
}

export const ResendModal = ({
  open,
  handleClose,
  onSuccess,
  selectedRowKeys,
  filterId,
}: ResendModalProps) => {
  const [selectedShipment, setSelectedShipment] = useState<number | null>(null);
  const [searchparams, setSearchParams] = useSearchParams();
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [filters, setFilters] = useState<any[]>([]);
  const { show } = useNavigation();
  const [notificationApi, contextHolder] = notification.useNotification();

  const buildQueryParams = () => ({
    sort: `id,${sortDirection}`,
    page: currentPage,
    limit: pageSize,
    offset: currentPage * pageSize,
    s: JSON.stringify({
      $and: [
        ...filters,
        { status: { $eq: "В пути" } },
        { reshipment: { $eq: true } },
        { id: { $ne: filterId } },
      ],
    }),
  });

  const { data, isLoading, refetch } = useCustom<any>({
    url: `${API_URL}/shipments`,
    method: "get",
    config: {
      query: buildQueryParams(),
    },
  });

  useEffect(() => {
    if (!searchparams.get("page") && !searchparams.get("size")) {
      searchparams.set("page", String(currentPage));
      searchparams.set("size", String(pageSize));
      setSearchParams(searchparams);
    } else {
      const page = searchparams.get("page");
      const size = searchparams.get("size");
      setCurrentPage(Number(page));
      setPageSize(Number(size));
    }
    refetch();
  }, [filters, sortDirection, currentPage, pageSize]);

  const dataSource = data?.data?.data || [];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    searchparams.set("page", pagination.current);
    searchparams.set("size", pagination.pageSize);
    setSearchParams(searchparams);
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const rowSelection = {
    type: "radio" as const,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedShipment(selectedRows[0]?.id || null);
    },
  };

  const tableProps = {
    dataSource: dataSource,
    loading: isLoading,
    rowSelection: rowSelection,
    pagination: {
      current: currentPage,
      pageSize: pageSize,
      total: data?.data?.total || 0,
    },
    onChange: handleTableChange,
  };

  const { mutate: updateManyGoods } = useUpdateMany({
    resource: "goods-processing",
    mutationOptions: {
      onSuccess: (data, variables, context) => {
        // Показываем уведомление вручную
        notificationApi.success({
          message: "Успешно обновлено!",
          description: `${selectedRowKeys.length} товаров отправлено в рейс #${selectedShipment}`,
          placement: "topRight",
          duration: 4,
        });
        
        if (onSuccess) {
          onSuccess();
        }
        handleClose();
      },
      onError: (error) => {
        notificationApi.error({
          message: "Ошибка обновления",
          description: "Не удалось выполнить обновление товаров",
          placement: "topRight",
          duration: 4,
        });
      }
    },
    // Отключаем встроенные уведомления
    successNotification: false,
    errorNotification: false,
  });

  const handleSave = async () => {
    if (selectedShipment) {
      updateManyGoods({
        ids: selectedRowKeys,
        values: {
          shipment_id: selectedShipment,
        },
      });
    } else {
      alert("Пожалуйста, выберите рейс");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        style={{ minWidth: "fit-content" }}
        open={open}
        onClose={handleClose}
        onCancel={handleClose}
        cancelText="Закрыть"
        okText="Сохранить"
        onOk={handleSave}
      >
        <Typography.Title level={4} style={{ marginBottom: 16 }}>
          Выберите рейс для отправки
        </Typography.Title>
        
        <Flex gap={10} style={{ width: "100%", marginBottom: 10 }}>
          <CustomTooltip title="Сортировка">
            <Button
              icon={
                sortDirection === "ASC" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              onClick={() => {
                setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
              }}
              style={{ height: 33, width: 33, minWidth: 33 }}
            />
          </CustomTooltip>
          <Input
            placeholder="Поиск по номеру рейса, коду коробки и по номеру фуры"
            prefix={<SearchOutlined />}
            style={{ width: "90%", height: 33 }}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) {
                setFilters([]);
                return;
              }
              setCurrentPage(1);
              searchparams.set("page", "1");
              setSearchParams(searchparams);

              setFilters([
                {
                  $or: [
                    { id: { $contL: value } },
                    { boxCode: { $contL: value } },
                    { truck_number: { $contL: value } },
                  ],
                },
              ]);
            }}
          />
        </Flex>
        <Flex
          vertical
          style={{ maxHeight: 600, maxWidth: 1200, overflowY: "scroll" }}
        >
          <Table
            onRow={(record) => ({
              onDoubleClick: () => {
                show("resend", record.id as number);
              },
            })}
            {...tableProps}
            rowKey="id"
            scroll={{ x: 1500 }}
          >
            {catchDateTable("Дата отправки", "В пути")}
            <Table.Column
              dataIndex="id"
              title={"Номер рейса"}
              render={(value) => (
                <TextField
                  style={{
                    padding: 5,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  value={value}
                />
              )}
            />
            <Table.Column dataIndex="boxCode" title={"Код коробки"} />
            <Table.Column dataIndex="truck_number" title={"Номер фуры"} />
            <Table.Column
              dataIndex="employee"
              title={"Место погрузки"}
              render={(value) => value?.branch?.name}
            />
            <Table.Column dataIndex="count" title={"Количество посылок"} />
            <Table.Column
              dataIndex="weight"
              title={"Вес"}
              render={(value, record) => (
                <p
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {Number(value) + Number(record?.box_weight)} кг
                </p>
              )}
            />
            <Table.Column
              dataIndex="Dimensions"
              title={"Размеры (Д × Ш × В)"}
              render={(value, record) => {
                return `${record?.length} x ${record?.width} x ${record?.height}`;
              }}
            />
            <Table.Column dataIndex="cube" title={"Куб"} />
            <Table.Column dataIndex="density" title={"Плотность"} />
            <Table.Column dataIndex="box_weight" title={"Вес коробки"} />
            <Table.Column dataIndex="type" title={"Тип"} />
            <Table.Column
              render={(value) => value?.name}
              dataIndex="branch"
              title={"Пункт назначения"}
            />
            <Table.Column
              dataIndex="status"
              title="Статус"
              render={(value) => translateStatus(value)}
            />
            <Table.Column
              dataIndex="employee"
              title={"Сотрудник"}
              render={(value) => {
                return `${value?.firstName || ""}-${value?.lastName || ""}`;
              }}
            />
          </Table>
        </Flex>
      </Modal>
    </>
  );
};