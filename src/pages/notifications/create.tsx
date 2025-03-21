import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Button, Popover } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";

export const NotificationsCreate = () => {
  const { formProps, saveButtonProps, form } = useForm();
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [text, setText] = useState("");

  // Синхронизация текста с формой
  useEffect(() => {
    form.setFieldsValue({
      notification: text,
    });
  }, [text, form]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData?.emoji);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps}>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          label="Сообщение"
          name="notification"
        >
          <TextArea
            value={text}
            onChange={handleTextChange}
            placeholder="Введите сообщение"
          />
          <Popover
            content={<EmojiPicker onEmojiClick={handleEmojiClick} />}
            trigger="click"
            visible={isEmojiPickerVisible}
            onVisibleChange={setIsEmojiPickerVisible}
          >
            <Button type="link">😀</Button>
          </Popover>
        </Form.Item>
      </Form>
    </Create>
  );
};
