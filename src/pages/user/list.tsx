import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany } from "@refinedev/core";
import { Space, Table } from "antd";

export const UserList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });



  return (
    <List>
      <Table {...tableProps} rowKey="id">
         <Table.Column dataIndex="id" title={"ID"} />
         <Table.Column dataIndex="email" title={"Email"} />
         <Table.Column dataIndex="role" title={"Роль"} />
          <Table.Column dataIndex="firstName" title={"Имя"} />
          <Table.Column dataIndex="lastName" title={"Фамилия"} />
          <Table.Column dataIndex="position" title={"Должность"} />
          <Table.Column dataIndex="photo" title={"Фото"} />

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
