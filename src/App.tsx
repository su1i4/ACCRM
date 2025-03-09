import { Refine, Authenticated } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import authProvider from "./authProvider";

import {
  useNotificationProvider,
  ThemedLayoutV2,
  ErrorComponent,
  AuthPage,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import nestjsxCrudDataProvider, {
  axiosInstance,
} from "@refinedev/nestjsx-crud";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";

import { App as AntdApp, Flex } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header } from "./components/header";
import { CustomSider } from "./components/sider";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  GoodsCreate,
  GoodsShow,
  GoogsProcessingList,
  GoodsEdit,
} from "./pages/goods-processing";
import {
  BranchCreate,
  BranchEdit,
  BranchList,
  BranchShow,
} from "./pages/branch";
import { UserCreate, UserEdit, UserList, UserShow } from "./pages/user";
import { List, Create, Show, Edit } from "./pages/shipments";
import {
  CounterpartyCreate,
  CounterpartyEdit,
  CounterpartyList,
  CounterpartyShow,
} from "./pages/counterparties";
import ReceivingList from "./pages/receiving/ReceivingList";
import ReceivingCreate from "./pages/receiving/ReceivingCreate";
import ReceivingShow from "./pages/receiving/ReceivingShow";
import ReceivingEdit from "./pages/receiving/ReceivingEdit";
import {
  ShoppingCartOutlined,
  WalletOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { i18nProvider_ru } from "./i18n/ru";
import { IssueProcessingList } from "./pages/Issue";
import { CashBackList } from "./pages/cash-back";
import { BankCreate, BankList, BankShow } from "./pages/bank";
import { CashDeskList } from "./pages/cash-desk";
import { CashDeskOutcomeList } from "./pages/cash-desk/outcome";
import { RemainingStockProcessingList } from "./pages/remaining-stock";
import { ExeptionCodeCreate, ExeptionCodeList } from "./pages/exception-code";
import {
  UnderBranchCreate,
  UnderBranchEdit,
  UnderBranchList,
  UnderBranchShow,
} from "./pages/under-branch";
import {
  ReportCreate,
  ReportEdit,
  ReportList,
  ReportShow,
} from "./pages/reports";
import {
  NotificationsCreate,
  NotificationsEdit,
  NotificationsList,
  NotificationsShow,
} from "./pages/notifications";
import {
  ChatbotCreate,
  ChatbotEdit,
  ChatbotList,
  ChatbotShow,
} from "./pages/chatbot-history";
import ReceivingShowReceived from "./pages/receiving/ReceivingShowReceived";
import { DiscountList } from "./pages/discount/list";
import { DiscountCreate } from "./pages/discount/create";
import { DiscountShow } from "./pages/discount/show";
import { DiscountEdit } from "./pages/discount/edit";
import { IssueProcessingListReceived } from "./pages/Issue/listReceived";
import "./styles/global.css";

export const API_URL = import.meta.env.VITE_DEV_URL;

function App() {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const dataProvider = nestjsxCrudDataProvider(API_URL, axiosInstance);

  // @ts-ignore
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              i18nProvider={i18nProvider_ru}
              accessControlProvider={{
                can: async ({ resource, action }) => {
                  const role = localStorage.getItem("role");

                  if (role === "user" && resource === "users") {
                    return { can: false };
                  }

                  return { can: true };
                },
              }}
              resources={[
                {
                  name: "Продукты",
                  icon: <ShoppingCartOutlined />,
                  meta: {
                    label: "Продукты",
                  },
                },
                {
                  name: "Контрагенты",
                  icon: <UsergroupAddOutlined />,
                  meta: {
                    label: "Контрагенты",
                  },
                },
                {
                  name: "Касса",
                  icon: <WalletOutlined />,
                  meta: {
                    label: "Касса",
                  },
                },
                {
                  name: "Автоматизация",
                  icon: <RobotOutlined />,
                  meta: {
                    label: "Автоматизация",
                  },
                },
                {
                  name: "Настройки",
                  icon: <SettingOutlined />,
                  meta: {
                    label: "Настройки",
                  },
                },
                {
                  name: "goods-processing",
                  list: "/goods-processing",
                  create: "/goods-processing/create",
                  edit: "/goods-processing/edit/:id",
                  show: "/goods-processing/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Спецификация",
                    parent: "Продукты",
                  },
                },
                {
                  name: "shipments",
                  list: "/shipments",
                  create: "/shipments/create",
                  edit: "/shipments/edit/:id",
                  show: "/shipments/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Отправка ",
                    parent: "Продукты",
                  },
                },
                {
                  name: "receiving",
                  list: "/receiving",
                  create: "/receiving/create",
                  edit: "/receiving/edit/:id",
                  show: "/receiving/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Получение",
                    parent: "Продукты",
                  },
                },
                {
                  name: "received",
                  list: "/receiving/show/:id/received",
                  meta: {
                    parent: "receiving",
                    label: "Выгруженные товары",
                    hide: true,
                  },
                },
                {
                  name: "issue",
                  list: "/issue",
                  show: "/issue/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Выдача",
                    parent: "Продукты",
                  },
                },
                {
                  name: "issued",
                  list: "/issue/received",
                  meta: {
                    parent: "issue",
                    label: "Выданные посылки",
                    hide: true,
                  },
                },
                {
                  name: "remaining-stock",
                  list: "/remaining-stock",
                  show: "/remaining-stock/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Остатки на складе",
                    parent: "Продукты",
                  },
                },
                {
                  name: "branch",
                  list: "/branch",
                  create: "/branch/create",
                  edit: "/branch/edit/:id",
                  show: "/branch/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Филиал",
                    parent: "Настройки",
                  },
                },
                {
                  name: "under-branch",
                  list: "/under-branch",
                  create: "/under-branch/create",
                  edit: "/under-branch/edit/:id",
                  show: "/under-branch/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Пвз",
                    parent: "Настройки",
                  },
                },
                {
                  name: "users",
                  list: "/users",
                  create: "/users/create",
                  edit: "/users/edit/:id",
                  show: "/users/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Пользователи",
                    parent: "Настройки",
                  },
                },
                {
                  name: "counterparty",
                  list: "/counterparty",
                  create: "/counterparty/create",
                  edit: "/counterparty/edit/:id",
                  show: "/counterparty/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Контрагент",
                    parent: "Контрагенты",
                  },
                },
                {
                  name: "cash-back",
                  list: "/cash-back",
                  create: "/cash-back/create",
                  edit: "/cash-back/edit/:id",
                  show: "/cash-back/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Кешбек",
                    parent: "Контрагенты",
                  },
                },

                {
                  name: "discount",
                  list: "/discount",
                  create: "/discount/create",
                  edit: "/discount/edit/:id",
                  show: "/discount/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Скидки",
                    parent: "Контрагенты",
                  },
                },
                {
                  name: "bank",
                  list: "/bank",
                  create: "/bank/create",
                  edit: "/bank/edit/:id",
                  show: "/bank/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Банк",
                    parent: "Касса",
                  },
                },

                {
                  name: "income",
                  list: "/income",
                  create: "/income/create",
                  edit: "/income/edit/:id",
                  show: "/income/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Приход",
                    parent: "Касса",
                  },
                },

                {
                  name: "outcome",
                  list: "/outcome",
                  create: "/bank/outcome",
                  edit: "/bank/outcome/:id",
                  show: "/bank/outcome/:id",
                  meta: {
                    canDelete: true,
                    label: "Расход",
                    parent: "Касса",
                  },
                },
                {
                  name: "exception-code",
                  list: "/exception-code",
                  create: "/exception-code/create",
                  meta: {
                    canDelete: true,
                    label: "Исключение",
                    parent: "Настройки",
                  },
                },
                {
                  name: "reports",
                  list: "/reports",
                  create: "/reports/create",
                  edit: "/reports/:id",
                  show: "/reports/:id",
                  meta: {
                    canDelete: true,
                    label: "Отчеты",
                    parent: "Автоматизация",
                  },
                },
                {
                  name: "notifications",
                  list: "/notifications",
                  create: "/notifications/create",
                  edit: "/notifications/:id",
                  show: "/notifications/:id",
                  meta: {
                    canDelete: true,
                    label: "Уведомления",
                    parent: "Автоматизация",
                  },
                },
                {
                  name: "chatbot-history",
                  list: "/chatbot-history",
                  create: "/chatbot-history/create",
                  edit: "/chatbot-history/:id",
                  show: "/chatbot-history/:id",
                  meta: {
                    canDelete: true,
                    label: "История чат-бота",
                    parent: "Автоматизация",
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-routes"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2
                        Header={() => <Header sticky />}
                        Sider={(props) => (
                          <CustomSider {...props} />
                        )}
                      >
                        <div style={{ paddingLeft: 190 }}>
                          <Outlet />
                        </div>
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route
                    index
                    element={<NavigateToResource resource="goods-processing" />}
                  />

                  <Route path="/goods-processing">
                    <Route index element={<GoogsProcessingList />} />
                    <Route path="create" element={<GoodsCreate />} />
                    <Route path="edit/:id" element={<GoodsEdit />} />
                    <Route path="show/:id" element={<GoodsShow />} />
                  </Route>

                  <Route path="/issue">
                    <Route index element={<IssueProcessingList />} />
                    <Route path="show/:id" element={<GoodsShow />} />
                    <Route
                      path="received"
                      element={<IssueProcessingListReceived/>}
                    />
                  </Route>

                  <Route path="/branch">
                    <Route index element={<BranchList />} />
                    <Route path="create" element={<BranchCreate />} />
                    <Route path="edit/:id" element={<BranchEdit />} />
                    <Route path="show/:id" element={<BranchShow />} />
                  </Route>

                  <Route path="/under-branch">
                    <Route index element={<UnderBranchList />} />
                    <Route path="create" element={<UnderBranchCreate />} />
                    <Route path="edit/:id" element={<UnderBranchEdit />} />
                    <Route path="show/:id" element={<UnderBranchShow />} />
                  </Route>

                  <Route path="/users">
                    <Route index element={<UserList />} />
                    <Route path="create" element={<UserCreate />} />
                    <Route path="edit/:id" element={<UserEdit />} />
                    <Route path="show/:id" element={<UserShow />} />
                  </Route>

                  <Route path="/shipments">
                    <Route index element={<List />} />
                    <Route path="create" element={<Create />} />
                    <Route path="show/:id" element={<Show />} />
                    <Route path="edit/:id" element={<Edit />} />
                  </Route>

                  <Route path="/counterparty">
                    <Route index element={<CounterpartyList />} />
                    <Route path="create" element={<CounterpartyCreate />} />
                    <Route path="show/:id" element={<CounterpartyShow />} />
                    <Route path="edit/:id" element={<CounterpartyEdit />} />
                  </Route>

                  <Route path="/receiving">
                    <Route index element={<ReceivingList />} />
                    <Route path="create" element={<ReceivingCreate />} />
                    <Route path="show/:id" element={<ReceivingShow />} />
                    <Route
                      path="show/:id/received"
                      element={<ReceivingShowReceived />}
                    />
                    <Route path="edit/:id" element={<ReceivingEdit />} />
                  </Route>

                  <Route path="/cash-back">
                    <Route index element={<CashBackList />} />
                    <Route path="create" element={<ReceivingCreate />} />
                    <Route path="show/:id" element={<ReceivingShow />} />
                    <Route path="edit/:id" element={<ReceivingEdit />} />
                  </Route>

                  <Route path="/discount">
                    <Route index element={<DiscountList />} />
                    <Route path="create" element={<DiscountCreate />} />
                    <Route path="show/:id" element={<DiscountShow />} />
                    <Route path="edit/:id" element={<DiscountEdit />} />
                  </Route>

                  <Route path="/reports">
                    <Route index element={<ReportList />} />
                    <Route path="create" element={<ReportCreate />} />
                    <Route path="show/:id" element={<ReportShow />} />
                    <Route path="edit/:id" element={<ReportEdit />} />
                  </Route>

                  <Route path="/notifications">
                    <Route index element={<NotificationsList />} />
                    <Route path="create" element={<NotificationsCreate />} />
                    <Route path="show/:id" element={<NotificationsShow />} />
                    <Route path="edit/:id" element={<NotificationsEdit />} />
                  </Route>

                  <Route path="/chatbot-history">
                    <Route index element={<ChatbotList />} />
                    <Route path="create" element={<ChatbotCreate />} />
                    <Route path="show/:id" element={<ChatbotShow />} />
                    <Route path="edit/:id" element={<ChatbotEdit />} />
                  </Route>

                  <Route path="/bank">
                    <Route index element={<BankList />} />
                    <Route path="create" element={<BankCreate />} />
                    <Route path="show/:id" element={<BankShow />} />
                    <Route path="edit/:id" element={<ReceivingEdit />} />
                  </Route>

                  <Route path="/income">
                    <Route index element={<CashDeskList />} />
                    {/*<Route path="create" element={<BankCreate />} />*/}
                    {/*<Route path="show/:id" element={<ReceivingShow />} />*/}
                    {/*<Route path="edit/:id" element={<ReceivingEdit />} />*/}
                  </Route>

                  <Route path="/outcome">
                    <Route index element={<CashDeskOutcomeList />} />
                    {/*<Route path="create" element={<BankCreate />} />*/}
                    {/*<Route path="show/:id" element={<ReceivingShow />} />*/}
                    {/*<Route path="edit/:id" element={<ReceivingEdit />} />*/}
                  </Route>

                  <Route path="/remaining-stock">
                    <Route index element={<RemainingStockProcessingList />} />
                    {/*<Route path="create" element={<BankCreate />} />*/}
                    {/*<Route path="show/:id" element={<ReceivingShow />} />*/}
                    {/*<Route path="edit/:id" element={<ReceivingEdit />} />*/}
                  </Route>

                  <Route path="/exception-code">
                    <Route index element={<ExeptionCodeList />} />
                    <Route path="create" element={<ExeptionCodeCreate />} />
                  </Route>

                  <Route path="*" element={<ErrorComponent />} />
                </Route>

                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      registerLink={false}
                      forgotPasswordLink={false}
                      title={
                        <img
                          src="/alfa-china.png" // Путь к логотипу в public
                          alt="Logo"
                          style={{
                            width: 150,
                            marginBottom: 16,
                            backgroundColor: "transparent",
                          }}
                        />
                      }
                    />
                  }
                />
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
