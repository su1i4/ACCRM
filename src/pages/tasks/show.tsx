import {
  Show,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
} from "@refinedev/antd";
import {
  useNavigation,
  useParsed,
  useShow,
  useGetIdentity,
} from "@refinedev/core";
import { Typography, Row, Col, Button, Tabs } from "antd";
import { useState } from "react"; // Импортируем компонент чата
import ChatComponent from "./chat";

const { Title } = Typography;
const { TabPane } = Tabs;

export const TasksyShow: React.FC = () => {
  const { id } = useParsed();
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const { data: identity } = useGetIdentity<{ id: number; fullName: string }>();

  const record = data?.data;

  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("details");

  const { push } = useNavigation();

  return (
    <Show
      headerButtons={({ deleteButtonProps, editButtonProps }) => (
        <>
          <Button
            onClick={() => {
              if (record?.discount?.id) {
                push(`/discount/edit/${record?.discount?.id}`);
              } else {
                setEditId(Number(record?.id));
                setOpenEdit(true);
              }
            }}
          >
            {record?.discount?.id ? "Изменить скидку" : "Добавить скидку"}
          </Button>
          {editButtonProps && <EditButton {...editButtonProps} />}
          {deleteButtonProps && <DeleteButton {...deleteButtonProps} />}
        </>
      )}
      isLoading={isLoading}
    >
      {/* <DiscountModal
        id={editId || 0}
        open={openEdit}
        onClose={() => setOpenEdit(false)}
      /> */}

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        style={{ marginBottom: 24 }}
      >
        <TabPane tab="Детали задачи" key="details">
          <Row gutter={[16, 16]}>
            {/* Левая колонка */}
            <Col xs={24} sm={12}>
              <Title level={5}>ID</Title>
              <TextField value={record?.id} />

              <Title level={5}>Код клиента</Title>
              <TextField
                value={`${record?.clientPrefix}-${String(
                  record?.clientCode
                ).padStart(4, "0")}`}
              />

              <Title level={5}>ФИО</Title>
              <TextField value={record?.name} />

              <Title level={5}>Пвз</Title>
              <TextField
                value={`${record?.branch?.name}-${
                  record?.under_branch?.address || ""
                }`}
              />

              <Title level={5}>Номер телефона</Title>
              <TextField value={record?.phoneNumber} />

              <Title level={5}>Email</Title>
              <TextField value={record?.email || "-"} />
            </Col>

            {/* Правая колонка */}
            <Col xs={24} sm={12}>
              <Title level={5}>Тариф клиента</Title>
              <TextField
                value={`${
                  Number(record?.branch?.tarif) -
                  Number(record?.discount?.discount || 0)
                }$`}
              />

              <Title level={5}>Скидка</Title>
              <TextField value={record?.discount?.discount || "0$"} />

              {/* <Title level={5}>Общий вес (кг)</Title>
              <TextField value={`${totalWeight} кг`} />

              <Title level={5}>Общая сумма (USD)</Title>
              <TextField value={`${totalAmount} $`} /> */}

              <Title level={5}>Комментарий</Title>
              <TextField value={record?.comment || "-"} />

              {record?.createdAt && (
                <>
                  <Title level={5}>Дата создания</Title>
                  <DateField value={record?.createdAt} />
                </>
              )}
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Чат задачи" key="chat">
          <div style={{ height: "600px", position: "relative" }}>
            {identity?.id && record?.id && (
              <TaskChatWrapper
                userId={identity.id}
                userName={identity.fullName}
                taskId={Number(record.id)}
              />
            )}
          </div>
        </TabPane>
      </Tabs>

      {/* Также добавляем иконку чата для быстрого доступа */}
      {identity?.id && record?.id && (
        <ChatComponent
          currentUserId={identity.id}
          currentUserName={identity.fullName}
          taskId={Number(record.id)}
        />
      )}
    </Show>
  );
};

// Обертка для чата в формате встроенного интерфейса
const TaskChatWrapper: React.FC<{
  userId: number;
  userName: string;
  taskId: number;
}> = ({ userId, userName, taskId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  // Здесь будет встроенная версия чата с полным интерфейсом
  return (
    <div
      className="task-chat-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid #f0f0f0",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          background: "#fafafa",
          borderBottom: "1px solid #f0f0f0",
          fontWeight: "bold",
        }}
      >
        Чат задачи #{taskId}
      </div>

      <EmbeddedChatComponent
        currentUserId={userId}
        currentUserName={userName}
        taskId={taskId}
      />
    </div>
  );
};

// Встроенная версия чата (используется во вкладке)
const EmbeddedChatComponent: React.FC<{
  currentUserId: number;
  currentUserName: string;
  taskId: number;
}> = ({ currentUserId, currentUserName, taskId }) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      <iframe
        src={`/_chat?userId=${currentUserId}&userName=${encodeURIComponent(
          currentUserName
        )}&taskId=${taskId}&embedded=true`}
        style={{
          border: "none",
          width: "100%",
          height: "100%",
          flex: 1,
        }}
        title="Task Chat"
      />
    </div>
  );
};

export default TasksyShow;
