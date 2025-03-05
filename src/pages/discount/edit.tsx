import React, { useState } from "react";
import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
  useSelect,
  useForm,
  Edit,
} from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export const DiscountEdit: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();

  const { tableProps } = useTable({
    resource: "counterparty",
    filters: {
      initial: [
        {
          field: "discount",
          operator: "null",
          value: null,
        },
      ],
    },
  });

  return (
    <Edit headerButtons={() => false} saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          name="counter_party_id"
          label="Контрагент"
          rules={[{ required: true, message: "Введите Контрагент" }]}
        >
          <Select
            options={tableProps.dataSource
              ?.filter((item: any) => item.discount === null)
              .map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
          />
        </Form.Item>
        <Form.Item
          name="discount"
          label="Скидка"
          rules={[{ required: true, message: "Введите Скидку" }]}
        >
          <Input min={0} max={100} type="number" />
        </Form.Item>
      </Form>
    </Edit>
  );
};
