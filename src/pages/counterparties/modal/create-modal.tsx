import React from "react";
import { useModalForm } from "@refinedev/antd";
import {Col, Form, Input, Modal, Select} from "antd";
import InputMask from "react-input-mask";
import {useSelect} from "@refinedev/antd";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export const MyCreateModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const {
        modalProps,
        formProps,
        submit,
    } = useModalForm({
        resource: "counterparty",
        action: "create",
        onMutationSuccess: () => {
            onClose(); // Закрываем модальное окно после успешного создания
        },
    });


    const { selectProps: branchSelectProps } = useSelect({
        resource: "branch",
        optionLabel:"name"
    });

    return (
        <Modal
            {...modalProps}
            title="Создать контрагента"
            onOk={submit}
            open={open} // Управляем открытием через props
            onCancel={onClose} // Закрываем модалку
            okText="Добавить"

        >
            <Form {...formProps} layout="vertical">

                <Col span={6}>
                    <Form.Item
                        name="branch_id"
                        label="Пунк назначения"
                        rules={[{ required: true, message: "Введите Пунк назначения" }]}
                    >
                        <Select {...branchSelectProps} style={{ width: "100%" }}  />
                    </Form.Item>
                </Col>

                <Form.Item
                    label="Фио"
                    name="name"
                    rules={[{ required: true, message: "Укажите Фио" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Адрес"
                    name="address"
                    rules={[{ required: false, }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Номер телефона"
                    name="phoneNumber"
                    rules={[{ required: true, message: "Введите номер телефона" }]}
                >
                    <PhoneInput
                        country={'kg'}
                    />
                </Form.Item>

                <Form.Item
                    label="Почта"
                    name="email"
                    rules={[{ type: "email", message: "Неверный формат email" }]}
                >
                    <Input />
                </Form.Item>


                <Form.Item label="Комментарий" name="comment">
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};
