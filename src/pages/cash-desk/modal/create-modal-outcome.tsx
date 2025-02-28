import React, { useEffect, useState } from "react";
import { useModalForm, useSelect } from "@refinedev/antd";
import { useOne } from "@refinedev/core";
import {DatePicker, Form, Input, Modal, Select} from "antd";

export const MyCreateModalOutcome: React.FC<{ open: boolean; onClose: () => void }> = ({
                                                                                    open,
                                                                                    onClose,
                                                                                }) => {
    const { modalProps, formProps, submit } = useModalForm({
        resource: "cash-desk",
        action: "create",
        onMutationSuccess: () => {
            onClose(); // Закрываем модальное окно после успешного создания
        },



    });

    const { selectProps: counterpartySelectProps } = useSelect({
        resource: "counterparty",
        optionLabel: "code",
    });

    const { selectProps: bankSelectProps } = useSelect({
        resource: "bank",
        optionLabel: "name",
    });

    const { selectProps: goodSelectProps } = useSelect({
        resource: "goods-processing",
        optionLabel: "name",
    });

    const { selectProps: userSelectProps } = useSelect({
        resource: "users",
        optionLabel: "firstName",
    });

    // Сохраняем выбранный id клиента
    const [selectedCounterpartyId, setSelectedCounterpartyId] = useState<string | null>(
        null
    );

    // Получаем данные клиента по выбранному id с помощью useOne
    const {
        data: counterpartyData,
        isLoading: isCounterpartyLoading,
        isError: isCounterpartyError,
    } = useOne({
        resource: "counterparty",
        id: selectedCounterpartyId ?? "",
        queryOptions: {
            enabled: !!selectedCounterpartyId, // Хук активен только если выбран id
        },
    });

    // При получении данных обновляем поле "Имя" в форме
    useEffect(() => {
        if (counterpartyData && counterpartyData.data) {
            // @ts-ignore
            formProps.form.setFieldsValue({
                name: counterpartyData.data.name, // Предполагается, что данные клиента содержат поле name
            });
        }
    }, [counterpartyData, formProps.form]);

    // Обработчик выбора клиента в Select
    const handleCounterpartyChange = (value: string, option: any) => {
        setSelectedCounterpartyId(value);
    };

    const expenseTypes = [
        { value: "supplier_payment", label: "Оплата поставщику" },
        { value: "repair_payment", label: "Оплата за ремонт" },
        { value: "salary_payment", label: "Выплата заработной платы работнику" },
        { value: "advance_payment", label: "Выдача подотчет" },
    ];


    const incomeTypes = [
        { value: "cash", label: "Оплата наличными" },
    ];




    return (
        <Modal
            {...modalProps}
            title={<h2 style={{ margin: 0 }}>Добавить Расход</h2>}
            onOk={submit}
            open={open}
            onCancel={onClose}
            cancelButtonProps={{ style: { display: "none" } }}
            // okButtonProps={{ style: { backgroundColor: "#52c41a" } }}
            width={483}
            okText="Добавить"
            // Пример стилизации "шапки" модалки
        >
            <Form
                {...formProps}
                layout="vertical"
                style={{ marginBottom: 0 }}
                initialValues={{
                    type: "outcome",
                }}
            >

                <Form.Item
                    label="Дата расход"
                    name={["date"]}
                    rules={[{ required: true, message: "Пожалуйста, выберите дату" }]}
                    // Настройка отступов между лейблом и инпутом
                    style={{ marginBottom: 16 }}
                >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" showTime />
                </Form.Item>

                <Form.Item
                    label="Банк"
                    name={["bank_id"]}
                    rules={[{ required: true, message: "Пожалуйста, выберите Банк" }]}
                    // Настройка отступов между лейблом и инпутом
                    style={{ marginBottom: 16 }}
                >
                    <Select
                        {...bankSelectProps}
                        placeholder="Выберите код банк"
                        style={{ width: "100%" }}
                    />
                </Form.Item>


                <Form.Item
                    label="Сотрудник"
                    name={["user_id"]}
                    rules={[{ required: true, message: "Пожалуйста, выберите Сотрудника" }]}
                    // Настройка отступов между лейблом и инпутом
                    style={{ marginBottom: 16 }}
                >
                    <Select
                        {...userSelectProps}
                        placeholder="Выберите Сотрудника"
                        style={{ width: "100%" }}
                    />
                </Form.Item>

                <Form.Item
                    label="Вид расхода"
                    name={["type_operation"]}
                    rules={[{ required: false, message: "Пожалуйста, выберите  вид расхода" }]}
                    // Настройка отступов между лейблом и инпутом
                    style={{ marginBottom: 16  }}
                >
                    <Select
                        options={expenseTypes}
                        placeholder="Выберите вид расхода"
                        style={{ width: "100%" }}
                    />
                </Form.Item>



                <Form.Item
                    label="Вид операции"
                    name="type"
                    rules={[{ required: false, message: "Укажите имя" }]}
                    style={{ marginBottom: 16 , display: "none"}}
                >
                    <Input
                        disabled
                        style={{ backgroundColor: "#f5f5f5" }}
                    />
                </Form.Item>

                <Form.Item
                    label="Сумма"
                    name="amount"
                    rules={[{ required: true, message: "Укажите сумму" }]}
                    style={{ marginBottom: 24 }}
                >
                    <Input
                        placeholder="Введите сумму прихода"
                        style={{ width: "100%" }}
                    />
                </Form.Item>

                <Form.Item
                    label="Комментарий"
                    name="comment"
                    rules={[{ required: false, }]}
                    style={{ marginBottom: 24 }}
                >
                    <Input
                        placeholder="Комментарий"
                        style={{ width: "100%" }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
