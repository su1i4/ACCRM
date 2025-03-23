import React from "react";
import { useModalForm } from "@refinedev/antd";
import { Form, Input, Modal } from "antd";
import InputMask from "react-input-mask";
import PhoneInput from "react-phone-input-2";

export const MyEditModal: React.FC<{
  id?: number | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}> = ({ id, open, onClose, onSuccess }) => {
  const { modalProps, formProps, submit } = useModalForm({
    resource: "discount",
    action: "edit",
    // @ts-ignore
    id,
    onMutationSuccess: () => {
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  return (
    <Modal
      {...modalProps}
      title="Редактировать контрагента"
      onOk={submit}
      open={open} // Управляем открытием через props
      onCancel={onClose} // Закрываем модалку
      style={{ width: 200 }}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          name="discount"
          label="Скидка"
          rules={[{ required: true, message: "Введите Скидку" }]}
        >
          <Input min={0} max={100} type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
