import React, { useState, useEffect } from "react";
import { CreateButton, List } from "@refinedev/antd";
import { Button, Col, Row, Table } from "antd";
import dayjs from "dayjs";
import { useCustom, useNavigation } from "@refinedev/core";
import { API_URL } from "../../App";

export const TasksList = () => {
  const [sortField, setSortField] = useState<"id" | "title" | "status">("id");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, refetch } = useCustom<any>({
    url: `${API_URL}/tasks`,
    method: "get",
    config: {
      query: {
        sort: `${sortField},${sortDirection}`,
        limit: pageSize,
        page: currentPage,
      },
    },
  });

  useEffect(() => {
    refetch();
  }, [sortDirection, sortField, currentPage, pageSize]);

  const tasks = data?.data?.data || [];

  const { push, show } = useNavigation();

  return (
    <List
      headerButtons={() => (
        <CreateButton onClick={() => push("/tasks/create")} />
      )}
    >
      <Table
        dataSource={tasks}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          total: data?.data?.total || 0,
        }}
        // onRow={(record) => ({
        //   onDoubleClick: () => {
        //     show("tasks", record.id as number);
        //   },
        // })}
      >
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="title" title="Название" />
        <Table.Column dataIndex="description" title="Описание" />
        <Table.Column dataIndex="status" title="Статус" />
        <Table.Column
          dataIndex="createdAt"
          title="Дата создания"
          render={(date) => dayjs(date).format("DD.MM.YYYY HH:mm")}
        />
      </Table>
    </List>
  );
};
