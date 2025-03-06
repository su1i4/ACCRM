import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useSelect,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany, useNavigation } from "@refinedev/core";
import { Button, Space, Table } from "antd";
import dayjs from "dayjs";

const ReceivingList = () => {
  const { tableProps } = useTable({
    resource: "shipments",
    syncWithLocation: true,
  });

  const { show } = useNavigation();

  return (
    <List headerButtons={() => false}>
      <Table
        onRow={(record) => ({
          onDoubleClick: () => {
            // Переход в детальный вид по идентификатору записи
            show("receiving", record.id as number);
          },
        })}
        {...tableProps}
        rowKey="id"
      >
        <Table.Column
          dataIndex="created_at"
          title={"Дата получения"}
          width={120}
          render={(value) => {
            return `${value?.split("T")[0]} ${value
              ?.split("T")[1]
              ?.slice(0, 5)}`;
          }}
        />
        <Table.Column dataIndex="id" title={"Номер рейса"} />
        <Table.Column dataIndex="boxCode" title={"Код коробки"} />
        <Table.Column
          dataIndex="employee"
          title={"Место погрузки"}
          render={(value) => value?.branch?.name}
        />
        <Table.Column dataIndex="count" title={"Количество посылок"} />
        <Table.Column dataIndex="weight" title={"Вес"} />
        <Table.Column
          dataIndex="Dimensions"
          title={"Размеры (Д × Ш × В)"}
          render={(value, record, index) => {
            return `${record.width} x ${record.height} x ${record.length}`;
          }}
        />
        <Table.Column dataIndex="cube" title={"Куб"} />
        <Table.Column dataIndex="density" title={"Плотность"} />¥
        <Table.Column dataIndex="type" title={"Тип"} />
        <Table.Column
          render={(value) => value.name}
          dataIndex="branch"
          title={"Пункт назначения"}
        />
        <Table.Column
          dataIndex="employee"
          title={"Сотрудник"}
          render={(value) => {
            return `${value?.firstName || ""}-${value?.lastName || ""}`;
          }}
        />
      </Table>
    </List>
  );
};

export default ReceivingList;
