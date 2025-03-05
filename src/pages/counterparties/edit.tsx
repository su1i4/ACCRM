import React from "react";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import InputMask from "react-input-mask";

export const CounterpartyEdit: React.FC = () => {
  const { formProps, saveButtonProps, formLoading, queryResult } = useForm();

  const { selectProps: underBranchSelectProps } = useSelect({
    resource: "under-branch",
    optionLabel: "address",
    defaultValue: formProps.initialValues?.under_branch_id,
    pagination: {
      mode: "off",
    },
  });

  return (
    <Edit
      headerButtons={() => false}
      saveButtonProps={saveButtonProps}
      isLoading={formLoading}
    >
      <Form
        {...formProps}
        layout="vertical"
        initialValues={queryResult?.data?.data}
      >
        <Form.Item
          style={{ width: "100%" }}
          name="under_branch_id"
          label="Пвз"
          rules={[{ required: true, message: "Введите пвз" }]}
        >
          <Select
            options={underBranchSelectProps?.options?.filter(
              (option) =>
                option.value === formProps.initialValues?.branch_id
            )}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Имя"
          name="name"
          rules={[{ required: true, message: "Пожалуйста, введите имя" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Номер телефона"
          name="phoneNumber"
          rules={[
            { required: true, message: "Пожалуйста, введите номер телефона" },
          ]}
        >
          <InputMask mask="+7 (999) 999-99-99" maskChar="_">
            {(inputProps: any) => <Input {...inputProps} />}
          </InputMask>
        </Form.Item>
        <Form.Item
          style={{ width: "100%" }}
          label="Адрес"
          name="address"
          rules={[{ required: false }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Пожалуйста, введите email" },
            { type: "email", message: "Неверный формат email" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Комментарий" name="comment">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Edit>
  );
};
