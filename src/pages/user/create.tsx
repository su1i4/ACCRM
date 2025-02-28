import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import {Col, Form, Input, Select} from "antd";
import React from "react";

export const UserCreate = () => {
  const { formProps, saveButtonProps } = useForm({});



    const { selectProps: branchSelectProps } = useSelect({
        resource: "branch",
        optionLabel:"name",
    });

  return (
    <Create saveButtonProps={saveButtonProps}>

      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Email"}
          name={["email"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Имя"}
          name="firstName"
          rules={[
            {
              required: true,
            },
          ]}
        >
            <Input />
        </Form.Item>

            <Form.Item
                label={"Фамилия"}
                name="lastName"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
        </Form.Item>

        <Form.Item
          label={"Роль"}
          name={"role"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            options={[
              { value: "admin", label: "Админ" },
              { value: "user", label: "Пользователь " },
            ]}
          />
        </Form.Item>

          <Col span={6}>
              <Form.Item
                  name="branch_id"
                  label="Сотрудник какого филиала"
                  rules={[{ required: true, message: "Введите филиала" }]}
              >
                  <Select  {...branchSelectProps}  />
              </Form.Item>
          </Col>

          <Form.Item
              label={"Пароль"}
              name="password"
              rules={[
                  {
                      required: true,
                  },
              ]}
          >
              <Input />
          </Form.Item>
      </Form>
    </Create>
  );
};
