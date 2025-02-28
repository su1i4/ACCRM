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

export const BranchList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="name" title={"Филиал"} />
          <Table.Column dataIndex="tarif" title={"Тариф"} />
          <Table.Column dataIndex="prefix" title={"Префикс"} />

          <Table.Column
              title={"Действия"}
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
