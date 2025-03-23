import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Button, Popover, Upload } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import { API_URL } from "../../App";
import { InboxOutlined } from "@ant-design/icons";

export const NotificationsCreate = () => {
  const { formProps, saveButtonProps, form } = useForm();
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [text, setText] = useState("");

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

  const handleFileUpload = (info: any, fieldName: string) => {
    if (info.file.status === "done") {
      console.log('loc')
      const uploadedFileUrl = info.file.response.filePath;
      const existingFiles = form.getFieldValue(fieldName) || [];
      form.setFieldsValue({
        [fieldName]: [...existingFiles, uploadedFileUrl],
      });
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps}>
        <Form.Item
          rules={[{ required: true }]}
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

        {/* Фото */}
        <Form.Item label="Фото" name="photos">
          <Upload.Dragger
            name="file"
            action={`${API_URL}/file-upload`}
            listType="picture"
            accept=".png,.jpg,.jpeg"
            onChange={(info) => handleFileUpload(info, "photos")}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Нажмите или перетащите файлы в эту область для загрузки
            </p>
            <p className="ant-upload-hint">
              Поддерживаются форматы PNG, JPG, GIF
            </p>
          </Upload.Dragger>
        </Form.Item>

        {/* Видео */}
        <Form.Item label="Видео" name="videos">
          <Upload.Dragger
            name="file"
            action={`${API_URL}/file-upload`}
            listType="picture"
            accept=".mp4,.webm,.mov"
            onChange={(info) => handleFileUpload(info, "videos")}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Нажмите или перетащите файлы в эту область для загрузки
            </p>
            <p className="ant-upload-hint">
              Поддерживаются форматы MP4, WebM, MOV
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Create>
  );
};
