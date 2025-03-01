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
import { Space, Table } from "antd";
import dayjs from "dayjs";

const ShipmentList = () => {
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
            show("shipments", record.id as number);
          },
        })}
        {...tableProps}
        rowKey="id"
      >
        {/* <Table.Column dataIndex="id" title={"ID"} /> */}
        <Table.Column
          dataIndex="created_at"
          title={"Дата"}
          render={({ created_at }) =>
            dayjs(created_at).format("DD.MM.YYYY HH:mm")
          }
        />
        <Table.Column dataIndex="flightNumber" title={"Номер рейса"} />
        <Table.Column dataIndex="flightNumber" title={"Код коробки"} />
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
        <Table.Column dataIndex="cube" title={"Плотность"} />¥
        <Table.Column dataIndex="type" title={"Тип"} />
        <Table.Column dataIndex="type" title={"Пункт назначения"} />
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
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export default ShipmentList;
