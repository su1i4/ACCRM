import { Show, useTable } from "@refinedev/antd";
import { Table } from "antd";
import { useParams } from "react-router";

const ReceivingShowReceived = () => {
  const { id } = useParams();

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
          field: "shipment_id",
          operator: "eq",
          value: Number(id),
        },
        {
          operator: "or",
          value: [
            {
              field: "status",
              operator: "eq",
              value: "Готов к выдаче",
            },
            {
              field: "status",
              operator: "eq",
              value: "Выдали",
            },
          ],
        },
      ],
    },
  });

  return (
    <Show headerButtons={() => false}>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="updated_at"
          title="Дата"
          width={120}
          render={(value) => {
            return `${value?.split("T")[0]} ${value
              ?.split("T")[1]
              ?.slice(0, 5)}`;
          }}
        />
        <Table.Column dataIndex="cargoType" title="Тип груза" />
        <Table.Column dataIndex="trackCode" title="Трек-код" />
        <Table.Column
          dataIndex="counterparty"
          title="Код клиента"
          render={(value) => value?.clientCode}
        />
        <Table.Column
          dataIndex="counterparty"
          title="Получатель"
          render={(value) => value?.name}
        />
        <Table.Column
          dataIndex="counterparty"
          title="Город"
          render={(value) => value?.branch?.name}
        />
        <Table.Column dataIndex="weight" title="Вес" />
        <Table.Column dataIndex="status" title="Статус" />
      </Table>
    </Show>
  );
};

export default ReceivingShowReceived;
