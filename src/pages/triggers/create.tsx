import { Create } from "@refinedev/antd"
import { Form, Input, Button, Select } from "antd"
import TextArea from "antd/lib/input/TextArea"

export const TriggersCreate = () => {
  return <Create>
    <Form.Item label="Триггер" name="name">
      <Input />
    </Form.Item>
    <Form.Item label="Описание" name="description">
      <TextArea />
    </Form.Item>
  </Create>
}