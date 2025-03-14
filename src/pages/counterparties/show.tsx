import {
  Show,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const CounterpartyShow: React.FC = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  const totalWeight = record?.goods.reduce((acc: number, curr: any) => acc + Number(curr.weight), 0);
  const totalAmount = record?.goods.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);

  return (
    <Show
      headerButtons={({ deleteButtonProps, editButtonProps }) => (
        <>
          {editButtonProps && (
            <EditButton {...editButtonProps} meta={{ foo: "bar" }} />
          )}
          {deleteButtonProps && (
            <DeleteButton {...deleteButtonProps} meta={{ foo: "bar" }} />
          )}
        </>
      )}
      isLoading={isLoading}
    >
      <Title level={5}>ID</Title>
      <TextField value={record?.id} />

      <Title level={5}>Код клиента</Title>
      <TextField value={`${record?.clientPrefix}-${String(record?.clientCode).padStart(4, '0')}`} />

      <Title level={5}>Фио</Title>
      <TextField value={record?.name} />

      <Title level={5}>Адрес </Title>
      <TextField value={record?.address} />

      <Title level={5}>Номер телефона</Title>
      <TextField value={record?.phoneNumber} />

      <Title level={5}>Email</Title>
      <TextField value={record?.email || "-"} />

      <Title level={5}>Тариф клиента</Title>
      <TextField value={Number(record?.branch?.tarif) - Number(record?.discount?.discount) || "-"} />

      <Title level={5}>Скидка</Title>
      <TextField value={record?.discount?.discount || "0"} />

      <Title level={5}>Сумма заказов кг</Title>
      <TextField value={totalWeight} />

      <Title level={5}>Сумма заказов USD</Title>
      <TextField value={totalAmount} />

      <Title level={5}>Комментарий</Title>
      <TextField value={record?.comment || "-"} />

      {record?.createdAt && (
        <>
          <Title level={5}>Дата создания</Title>
          <DateField value={record?.createdAt} />
        </>
      )}
    </Show>
  );
};
