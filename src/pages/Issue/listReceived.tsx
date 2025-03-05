import { List, useTable, DeleteButton, ShowButton } from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import {
  Space,
  Table,
  Image,
} from "antd";
import dayjs from "dayjs";
import { API_URL } from "../../App";

export const IssueProcessingListReceived = () => {
  const { tableProps, setFilters } = useTable({
    resource: "goods-processing",
    syncWithLocation: true,
    filters: {
      initial: [
        {
          field: "status",
          operator: "eq",
          value: "Выдали",
        },
      ],
    },
  });

  return (
    <List>
      <Table {...tableProps}>
        <Table.Column
          dataIndex="created_at"
          title={"Дата"}
          width={120}
          render={(value) =>
            value ? dayjs(value).format("DD.MM.YYYY HH:MM") : ""
          }
        />
        <Table.Column dataIndex="trackCode" title="Треккод" />
        <Table.Column dataIndex="cargoType" title="Тип груза" />
        <Table.Column
          dataIndex="counterparty"
          title="Код получателя"
          render={(value) => {
            return `${value?.clientPrefix}-${value?.clientCode}`;
          }}
        />
        <Table.Column
          dataIndex="counterparty"
          title="ФИО получателя"
          render={(value) => value?.name}
        />
        <Table.Column
          render={(value) => value?.name}
          dataIndex="branch"
          title={"Пункт назначения"}
        />
        <Table.Column dataIndex="weight" title="Вес" />
        <Table.Column dataIndex="amount" title="Сумма" />
        <Table.Column dataIndex="paymentMethod" title="Способ оплаты" />
        <Table.Column
          dataIndex="employee"
          title="Сотрудник"
          render={(value) => {
            return `${value?.firstName || ""}-${value?.lastName || ""}`;
          }}
        />
        <Table.Column
          dataIndex="employee"
          title="Филиал"
          render={(value) => value?.branch?.name}
        />
        <Table.Column dataIndex="comments" title="Комментарий" />
        <Table.Column
          dataIndex="photo"
          title="Фото"
          render={(photo) =>
            photo ? (
              <Image
                width={30}
                height={30}
                src={API_URL.replace("/api", "") + "/" + photo}
              />
            ) : null
          }
        />
        <Table.Column dataIndex="status" title="Статус" />
        <Table.Column
          title="Действия"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
