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

  const { data: usersData, isLoading: usersIsLoading } = useMany({
    resource: "users",
    ids:
      tableProps?.dataSource
        ?.map((item) => item?.counterparty?.id)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const { data: branchData, isLoading: branchIsLoading } = useMany({
    resource: "branch",
    ids:
      tableProps?.dataSource?.map((item) => item?.branch?.id).filter(Boolean) ??
      [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const { show, push } = useNavigation();

  return (
    <List>
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
          title={"Дата"}
          render={({ created_at }) =>
            dayjs(created_at).format("DD.MM.YYYY HH:mm")
          }
        />
        <Table.Column dataIndex="flightNumber" title={"Номер рейса"} />
        <Table.Column dataIndex="boxCode" title={"Код коробки"} />
        <Table.Column
          dataIndex="branch_id"
          title={"Место погрузки"}
          render={(value) =>
            branchIsLoading ? (
              <>Loading...</>
            ) : (
              branchData?.data?.find((item) => item.id === value)?.name
            )
          }
        />
        <Table.Column dataIndex="flightNumber" title={"Количество мест"} />
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
          dataIndex="user_id"
          title={"Сотрудник"}
          render={(value) => {
            console.log(value);

            if (usersIsLoading) {
              return <>Loading....</>;
            }
            const user = usersData?.data?.find((item) => item.id === value);
            console.log(user);
            return user ? `${user.firstName} ${user.lastName}` : null;
          }}
        />
      </Table>
    </List>
  );
};

export default ReceivingList;
