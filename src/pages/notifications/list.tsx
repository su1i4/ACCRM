import { List, useTable } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Button, message, Table } from "antd";
import { CopyOutlined } from "@ant-design/icons";

export const NotificationsList = () => {
  const { tableProps } = useTable({
    resource: "notification",
  });

  return (
    <List>
      <Table {...tableProps}>
        <Table.Column dataIndex="notification" title="Сообщение" />
      </Table>
    </List>
  );
};
