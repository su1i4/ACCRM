import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Select } from "antd";

export const BranchCreate = () => {
  const { formProps, saveButtonProps } = useForm({});


  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Филлиал"}
          name={["name"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />

        </Form.Item>

          <Form.Item
              label={"Тариф"}
              name={["tarif"]}
              rules={[
                  {
                      required: true,
                  },
              ]}
          >
              <Input />

          </Form.Item>


          <Form.Item
              label={"Префикс"}
              name={["prefix"]}
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
