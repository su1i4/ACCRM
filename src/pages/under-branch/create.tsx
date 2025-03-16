import { Create, useForm, useSelect, useTable } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Flex, Form, Input, Select } from "antd";

export const UnderBranchCreate = () => {
  const { selectProps: branchSelectProps } = useSelect({
    resource: "branch",
    optionLabel: "name",
  });
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Филлиал"}
          name={["branch_id"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Выберите филиал"
            style={{ width: 200 }}
            {...branchSelectProps}
          />
        </Form.Item>

        <Form.Item
          label={"Адрес"}
          name={["address"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={"Рабочее время"}
          name={["work_schedule"]}
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
