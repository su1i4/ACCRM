import React, { useState, useEffect } from "react";
import { List, useTable } from "@refinedev/antd";
import {
  Space,
  Table,
  Input,
  Button,
  Row,
  Col,
  Dropdown,
  Select,
  Card,
  Image,
  Descriptions,
  Typography,
} from "antd";
import { useCustom, useNavigation } from "@refinedev/core";
import {
  FileAddOutlined,
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { API_URL } from "../../../App";
import { typeOperationMap } from "../../bank";

const { Text } = Typography;

export const IncomingFundsReport: React.FC = () => {
  const { tableProps: bankTableProps } = useTable({
    resource: "bank",
  });

  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [sortField, setSortField] = useState<"id" | "counterparty.name">("id");
  const [searchFilters, setSearchFilters] = useState<any[]>([
    { type: { $eq: "income" } },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [sorterVisible, setSorterVisible] = useState(false);

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
    url: `${API_URL}/cash-desk`,
    method: "get",
    config: {
      query: buildQueryParams(),
    },
  });

  const {
    data: goods,
    isLoading: goodsLoading,
    refetch: goodsRefetch,
  } = useCustom<any>({
    url: `${API_URL}/goods-processing`,
    method: "get",
  });

  console.log(goods?.data?.filter((item: any) => !!item.operation_id), "goods");

  const setFilters = (
    filters: any[],
    mode: "replace" | "append" = "append"
  ) => {
    if (mode === "replace") {
      setSearchFilters(filters);
    } else {
      setSearchFilters((prevFilters) => [...prevFilters, ...filters]);
    }
  };

  useEffect(() => {
    refetch();
  }, [searchFilters, sortDirection, sortField, currentPage, pageSize]);

  const sortContent = (
    <Card style={{ width: 200, padding: "0px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div
          style={{
            marginBottom: "8px",
            color: "#666",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          Сортировать по
        </div>
        {/* Сортировка по дате создания */}
        <Button
          type="text"
          style={{
            textAlign: "left",
            fontWeight: sortField === "id" ? "bold" : "normal",
          }}
          onClick={() => {
            setSortField("id");
            setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
          }}
        >
          Дате создания{" "}
          {sortField === "id" && (sortDirection === "ASC" ? "↑" : "↓")}
        </Button>
        <Button
          type="text"
          style={{
            textAlign: "left",
            fontWeight: sortField === "counterparty.name" ? "bold" : "normal",
          }}
          onClick={() => {
            setSortField("counterparty.name");
            setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
          }}
        >
          По контрагенту{" "}
          {sortField === "counterparty.name" &&
            (sortDirection === "ASC" ? "↑" : "↓")}
        </Button>
      </div>
    </Card>
  );

  // Создаем функции для пагинации
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Формируем пропсы для таблицы из данных useCustom
  const tableProps = {
    dataSource: data?.data?.data || [],
    loading: isLoading,
    pagination: {
      current: currentPage,
      pageSize: pageSize,
      total: data?.data?.total || 0,
    },
    onChange: handleTableChange,
  };

  const handleDownloadPhoto = async (photo: string) => {
    if (photo) {
      try {
        const photoUrl = `${API_URL}/${photo}`;

        // Fetch the image as a blob
        const response = await fetch(photoUrl);
        const blob = await response.blob();

        // Create object URL from blob
        const objectUrl = URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement("a");
        link.href = objectUrl;

        // Extract filename from path
        const filename = photo.split("/").pop() || "photo.jpg";
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
        console.error("Error downloading photo:", error);
        // You could add notification here if desired
      }
    }
  };

  const { push } = useNavigation();

  // Expandable row render function
  const expandedRowRender = (record: any) => {

    return (
      <Table dataSource={[]} rowKey="id" scroll={{ x: 1200 }}>
        <Table.Column dataIndex="trackCode" title="Трек-код" />
        <Table.Column dataIndex="cargoType" title="Тип груза" />
        <Table.Column
          dataIndex="counterparty"
          title="Код клиента"
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
        <Table.Column
          dataIndex="weight"
          title="Вес"
          render={(value) => value + " кг"}
        />
        <Table.Column
          dataIndex="counterparty"
          title="Тариф клиента"
          render={(value, record) => {
            return `${(
              Number(value?.branch?.tarif || 0) -
              Number(record?.counterparty?.discount?.discount || 0)
            ).toFixed(2)}$`;
          }}
        />

        <Table.Column
          dataIndex="amount"
          title="Сумма"
          render={(value) => value + " $"}
        />
        <Table.Column
          dataIndex="discount"
          title="Скидка"
          render={(value, record) => {
            return `${(Number(value) + Number(record?.discount_custom)).toFixed(
              2
            )}`;
          }}
        />
        <Table.Column dataIndex="comments" title="Комментарий" />
      </Table>
    );
  };

  // @ts-ignore
  return (
    <List headerButtons={() => null}>
      {/* <MyCreateModal open={open} onClose={() => setOpen(false)} /> */}

      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space size="middle">
            <Button
              icon={<FileAddOutlined />}
              style={{}}
              onClick={() => push("create")}
            />
            <Dropdown
              overlay={sortContent}
              trigger={["click"]}
              placement="bottomLeft"
              open={sorterVisible}
              onOpenChange={(visible) => {
                setSorterVisible(visible);
              }}
            >
              <Button
                icon={
                  sortDirection === "ASC" ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )
                }
              ></Button>
            </Dropdown>
          </Space>
        </Col>
        <Col flex="auto">
          <Input
            placeholder="Поиск по трек-коду или коду клиента"
            prefix={<SearchOutlined />}
            onChange={(e) => {
              const value = e.target.value;
              if (!value) {
                setFilters([{ type: { $eq: "income" } }], "replace");
                return;
              }

              setFilters(
                [
                  {
                    $and: [
                      { type: { $eq: "income" } },
                      {
                        $or: [
                          { trackCode: { $contL: value } },
                          { "counterparty.clientCode": { $contL: value } },
                        ],
                      },
                    ],
                  },
                ],
                "replace"
              );
            }}
          />
        </Col>
        <Col>
          <Select
            mode="multiple"
            placeholder="Выберите банк"
            style={{ width: 200 }}
            onChange={(value) => {
              if (!value || value.length === 0) {
                setFilters([{ type: { $eq: "income" } }], "replace");
                return;
              }

              setFilters(
                [
                  {
                    $and: [
                      { type: { $eq: "income" } },
                      { bank_id: { $in: value } },
                    ],
                  },
                ],
                "replace"
              );
            }}
            options={bankTableProps?.dataSource?.map((bank: any) => ({
              label: bank.name,
              value: bank.id,
            }))}
          />
        </Col>
      </Row>

      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: 1000 }}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => true,
          expandRowByClick: true,
        }}
        onRow={(record) => ({
          onClick: (e) => {},
        })}
      >
        <Table.Column
          dataIndex="date"
          title="Дата оплаты"
          render={(date) => dayjs(date).format("DD.MM.YYYY HH:mm")}
        />

        <Table.Column
          dataIndex="bank_id"
          title="Банк"
          render={(value) => {
            const bank = bankTableProps?.dataSource?.find(
              (bank) => bank.id === value
            );
            return bank?.name;
          }}
        />
        <Table.Column dataIndex="method_payment" title="Метод оплаты" />
        <Table.Column
          dataIndex="type_operation"
          title="Вид прихода"
          render={(value) => typeOperationMap[value] || value}
        />

        <Table.Column
          dataIndex="counterparty"
          title="Код клиента"
          render={(value) => `${value?.clientPrefix}-${value?.clientCode}`}
        />

        <Table.Column
          dataIndex="counterparty"
          title="Фио клиента"
          render={(counterparty) => (counterparty ? counterparty.name : "")}
        />

        <Table.Column dataIndex="amount" title="Сумма" />

        <Table.Column dataIndex="type_currency" title="валюта" />

        <Table.Column dataIndex="comment" title="Комментарий" />
        <Table.Column
          dataIndex="check_file"
          title="Чек"
          render={(check_file) => {
            const downloadUrl = `http://192.168.5.158:5001/${check_file}`;
            return (
              <Space direction="vertical" align="center">
                <Image
                  style={{ objectFit: "cover" }}
                  width={50}
                  height={50}
                  src={downloadUrl}
                  preview={{
                    src: downloadUrl,
                  }}
                />
                {check_file && (
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadPhoto(check_file)}
                    size="small"
                  >
                    Скачать
                  </Button>
                )}
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
};
