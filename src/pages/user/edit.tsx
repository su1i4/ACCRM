import { Edit, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import {Col, Form, Input, Select, Table} from "antd";
import React from "react";

export const UserEdit = () => {
  const { formProps, saveButtonProps, queryResult, formLoading } = useForm({});

  const userData = queryResult?.data?.data;
    const { selectProps: branchSelectProps } = useSelect({
        resource: "branch",
        optionLabel:"name"
    });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
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
              label={"Роль"}
              name={["role"]}
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
              name={["firstName"]}
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
              name={["lastName"]}
              rules={[
                  {
                      required: true,
                  },
              ]}
          >
              <Input />
          </Form.Item>

          <Form.Item
              label={"Должность"}
              name={["position"]}
              rules={[
                  {
                      required: true,
                  },
              ]}
          >
              <Input />
          </Form.Item>


          <Form.Item
              label={"Фото"}
              name={["photo"]}
              rules={[
                  {
                      required: true,
                  },
              ]}
          >
              <Input />
          </Form.Item>


          <Col span={6}>
              <Form.Item
                  name="branch_id"
                  label="Сотрудник какого филиала"
                  rules={[{ required: true, message: "Сотрудник какого филиала" }]}
              >
                  <Select {...branchSelectProps}  />
              </Form.Item>
          </Col>





      </Form>
    </Edit>
  );
};
