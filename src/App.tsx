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

import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header } from "./components/header";
import { CustomSider } from "./components/sider";
import { ColorModeContextProvider } from "./contexts/color-mode";
import React, { Suspense } from "react";

import {
  GoodsCreate,
  GoodsShow,
  GoogsProcessingList,
  GoodsEdit,
} from "./pages/goods-processing";

const AcceptedGoodsList = React.lazy(() => import("./pages/accepted-goods").then(module => ({ default: module.AcceptedGoodsList })));
const AcceptedGoodsShow = React.lazy(() => import("./pages/accepted-goods").then(module => ({ default: module.AcceptedGoodsShow })));
const AcceptedGoodsEdit = React.lazy(() => import("./pages/accepted-goods/edit").then(module => ({ default: module.AcceptedGoodsEdit })));

const BranchList = React.lazy(() => import("./pages/branch").then(module => ({ default: module.BranchList })));
const BranchCreate = React.lazy(() => import("./pages/branch").then(module => ({ default: module.BranchCreate })));
const BranchEdit = React.lazy(() => import("./pages/branch").then(module => ({ default: module.BranchEdit })));
const BranchShow = React.lazy(() => import("./pages/branch").then(module => ({ default: module.BranchShow })));

const UserList = React.lazy(() => import("./pages/user").then(module => ({ default: module.UserList })));
const UserCreate = React.lazy(() => import("./pages/user").then(module => ({ default: module.UserCreate })));
const UserEdit = React.lazy(() => import("./pages/user").then(module => ({ default: module.UserEdit })));
const UserShow = React.lazy(() => import("./pages/user").then(module => ({ default: module.UserShow })));

const List = React.lazy(() => import("./pages/shipments").then(module => ({ default: module.List })));
const Create = React.lazy(() => import("./pages/shipments").then(module => ({ default: module.Create })));
const Show = React.lazy(() => import("./pages/shipments").then(module => ({ default: module.Show })));
const Edit = React.lazy(() => import("./pages/shipments").then(module => ({ default: module.Edit })));

const CounterpartyList = React.lazy(() => import("./pages/counterparties").then(module => ({ default: module.CounterpartyList })));
const CounterpartyCreate = React.lazy(() => import("./pages/counterparties").then(module => ({ default: module.CounterpartyCreate })));
const CounterpartyShow = React.lazy(() => import("./pages/counterparties").then(module => ({ default: module.CounterpartyShow })));
const CounterpartyEdit = React.lazy(() => import("./pages/counterparties").then(module => ({ default: module.CounterpartyEdit })));

const ReceivingList = React.lazy(() => import("./pages/receiving/ReceivingList"));
const ReceivingCreate = React.lazy(() => import("./pages/receiving/ReceivingCreate"));
const ReceivingShow = React.lazy(() => import("./pages/receiving/ReceivingShow"));
const ReceivingEdit = React.lazy(() => import("./pages/receiving/ReceivingEdit"));
const ReceivingShowReceived = React.lazy(() => import("./pages/receiving/ReceivingShowReceived"));
const ReceivingHistory = React.lazy(() => import("./pages/receiving/ReceivingHistory").then(module => ({ default: module.ReceivingHistory })));
const ReceivingHistoryShow = React.lazy(() => import("./pages/receiving/ReceivingHistoryShow").then(module => ({ default: module.ReceivingHistoryShow })));
const ReceivingAll = React.lazy(() => import("./pages/receiving/ReceivingAll"));

const IssueProcessingList = React.lazy(() => import("./pages/Issue").then(module => ({ default: module.IssueProcessingList })));
const IssueProcessingListReceived = React.lazy(() => import("./pages/Issue/listReceived").then(module => ({ default: module.IssueProcessingListReceived })));

const CashBackList = React.lazy(() => import("./pages/cash-back").then(module => ({ default: module.CashBackList })));

const BankList = React.lazy(() => import("./pages/bank").then(module => ({ default: module.BankList })));
const BankCreate = React.lazy(() => import("./pages/bank").then(module => ({ default: module.BankCreate })));
const BankShow = React.lazy(() => import("./pages/bank").then(module => ({ default: module.BankShow })));
const BankEdit = React.lazy(() => import("./pages/bank").then(module => ({ default: module.BankEdit })));

const CashDeskList = React.lazy(() => import("./pages/cash-desk").then(module => ({ default: module.CashDeskList })));
const CashDeskCreate = React.lazy(() => import("./pages/cash-desk").then(module => ({ default: module.CashDeskCreate })));
const CashDeskOutcomeList = React.lazy(() => import("./pages/cash-desk/outcome").then(module => ({ default: module.CashDeskOutcomeList })));
const IncomeShow = React.lazy(() => import("./pages/cash-desk/incomeShow").then(module => ({ default: module.IncomeShow })));

const RemainingStockProcessingList = React.lazy(() => import("./pages/remaining-stock").then(module => ({ default: module.RemainingStockProcessingList })));

const ExeptionCodeList = React.lazy(() => import("./pages/exception-code").then(module => ({ default: module.ExeptionCodeList })));
const ExeptionCodeCreate = React.lazy(() => import("./pages/exception-code").then(module => ({ default: module.ExeptionCodeCreate })));

const UnderBranchList = React.lazy(() => import("./pages/under-branch").then(module => ({ default: module.UnderBranchList })));
const UnderBranchCreate = React.lazy(() => import("./pages/under-branch").then(module => ({ default: module.UnderBranchCreate })));
const UnderBranchEdit = React.lazy(() => import("./pages/under-branch").then(module => ({ default: module.UnderBranchEdit })));
const UnderBranchShow = React.lazy(() => import("./pages/under-branch").then(module => ({ default: module.UnderBranchShow })));

const ReportList = React.lazy(() => import("./pages/reports").then(module => ({ default: module.ReportList })));
const ReportCreate = React.lazy(() => import("./pages/reports").then(module => ({ default: module.ReportCreate })));
const ReportShow = React.lazy(() => import("./pages/reports").then(module => ({ default: module.ReportShow })));
const ReportEdit = React.lazy(() => import("./pages/reports").then(module => ({ default: module.ReportEdit })));
const CargoReceivedReport = React.lazy(() => import("./pages/reports").then(module => ({ default: module.CargoReceivedReport })));
const CashBookReport = React.lazy(() => import("./pages/reports").then(module => ({ default: module.CashBookReport })));
const CargoTypesReport = React.lazy(() => import("./pages/reports").then(module => ({ default: module.CargoTypesReport })));
const IncomeReport = React.lazy(() => import("./pages/reports").then(module => ({ default: module.IncomeReport })));
const ExpenseReport = React.lazy(() => import("./pages/reports").then(module => ({ default: module.ExpenseReport })));
const EmployeesReport = React.lazy(() => import("./pages/reports").then(module => ({ default: module.EmployeesReport })));
const BranchesReport = React.lazy(() => import("./pages/reports").then(module => ({ default: module.BranchesReport })));
const CashOperationsReport = React.lazy(() => import("./pages/reports").then(module => ({ default: module.CashOperationsReport })));
const IncomingFundsReport = React.lazy(() => import("./pages/reports").then(module => ({ default: module.IncomingFundsReport })));
const ExpenseFinanceReport = React.lazy(() => import("./pages/reports").then(module => ({ default: module.ExpenseFinanceReport })));
const RepresentativeReport = React.lazy(() => import("./pages/reports/representative").then(module => ({ default: module.RepresentativeReport })));
const IncomeShowReport = React.lazy(() => import("./pages/reports/income-report/show").then(module => ({ default: module.IncomeShowReport })));

const ChatbotList = React.lazy(() => import("./pages/chatbot-history").then(module => ({ default: module.ChatbotList })));
const ChatbotCreate = React.lazy(() => import("./pages/chatbot-history").then(module => ({ default: module.ChatbotCreate })));
const ChatbotShow = React.lazy(() => import("./pages/chatbot-history").then(module => ({ default: module.ChatbotShow })));
const ChatbotEdit = React.lazy(() => import("./pages/chatbot-history").then(module => ({ default: module.ChatbotEdit })));

const DiscountList = React.lazy(() => import("./pages/discount/list").then(module => ({ default: module.DiscountList })));
const DiscountCreate = React.lazy(() => import("./pages/discount/create").then(module => ({ default: module.DiscountCreate })));
const DiscountShow = React.lazy(() => import("./pages/discount/show").then(module => ({ default: module.DiscountShow })));
const DiscountEdit = React.lazy(() => import("./pages/discount/edit").then(module => ({ default: module.DiscountEdit })));

const ShipmentAdd = React.lazy(() => import("./pages/shipments/ShipmentAdd"));
const ShipmentHistory = React.lazy(() => import("./pages/shipments/ShipmentHistory").then(module => ({ default: module.ShipmentHistory })));
const ShipmentHistoryShow = React.lazy(() => import("./pages/shipments/ShipmentHistoryShow").then(module => ({ default: module.ShipmentHistoryShow })));

const CurrencyList = React.lazy(() => import("./pages/currency/list").then(module => ({ default: module.CurrencyList })));
const CurrencyCreate = React.lazy(() => import("./pages/currency/create").then(module => ({ default: module.CurrencyCreate })));
const CurrencyShow = React.lazy(() => import("./pages/currency/show").then(module => ({ default: module.CurrencyShow })));
const CurrencyEdit = React.lazy(() => import("./pages/currency/edit").then(module => ({ default: module.CurrencyEdit })));

const TriggersList = React.lazy(() => import("./pages/triggers/list").then(module => ({ default: module.TriggersList })));
const TriggersCreate = React.lazy(() => import("./pages/triggers/create").then(module => ({ default: module.TriggersCreate })));
const TriggersEdit = React.lazy(() => import("./pages/triggers/edit").then(module => ({ default: module.TriggersEdit })));
const TriggersShow = React.lazy(() => import("./pages/triggers/show").then(module => ({ default: module.TriggersShow })));

const NotPaidGoodsList = React.lazy(() => import("./pages/not-paid-goods/list").then(module => ({ default: module.NotPaidGoodsList })));
const NotPaidGoodsShow = React.lazy(() => import("./pages/not-paid-goods/show").then(module => ({ default: module.NotPaidGoodsShow })));

const NotificationsList = React.lazy(() => import("./pages/notifications/list").then(module => ({ default: module.NotificationsList })));
const NotificationsCreate = React.lazy(() => import("./pages/notifications/create").then(module => ({ default: module.NotificationsCreate })));

const ResendList = React.lazy(() => import("./pages/resend/list"));
const ResendCreate = React.lazy(() => import("./pages/resend/create"));
const ResendShow = React.lazy(() => import("./pages/resend/show"));
const ResendEdit = React.lazy(() => import("./pages/resend/edit"));
const ResendHistory = React.lazy(() => import("./pages/resend/history").then(module => ({ default: module.ResendHistory })));
const ResendHistoryShow = React.lazy(() => import("./pages/resend/history-show").then(module => ({ default: module.ResendHistoryShow })));

const TasksList = React.lazy(() => import("./pages/tasks/list").then(module => ({ default: module.TasksList })));
const TasksCreate = React.lazy(() => import("./pages/tasks/create").then(module => ({ default: module.TasksCreate })));
const TasksyShow = React.lazy(() => import("./pages/tasks/show"));
const TasksEdit = React.lazy(() => import("./pages/tasks/edit").then(module => ({ default: module.TasksEdit })));
const TasksArchive = React.lazy(() => import("./pages/tasks/archive").then(module => ({ default: module.TasksArchive })));

const CounterpartyGrooz = React.lazy(() => import("./pages/grooz/list").then(module => ({ default: module.CounterpartyGrooz })));
const GroozShow = React.lazy(() => import("./pages/grooz/show").then(module => ({ default: module.GroozShow })));

import { i18nProvider_ru } from "./i18n/ru";
import { routes } from "./lib/routes";
import { ScrollRestoration } from "./hooks/save-scroll";
import { liveProvider } from "./contexts/liveProvider";
import "./styles/global.css";

export const API_URL = import.meta.env.VITE_DEV_URL;

const LoadingComponent = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '20px'
  }}>
    Загрузка...
  </div>
);

function App() {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const refreshToken = async () => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) throw new Error("No refresh token available");

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refresh_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);
      return data.accessToken;
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("id");
      window.location.href = "/login";
      return null;
    }
  };

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        const originalRequest = error.config;
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          const newAccessToken = await refreshToken();
          if (newAccessToken) {
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        }
      }
      return Promise.reject(error);
    }
  );

  const dataProvider = nestjsxCrudDataProvider(API_URL, axiosInstance);

  return (
    <BrowserRouter>
      <ScrollRestoration />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <Refine
              liveProvider={liveProvider}
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
              resources={routes}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                liveMode: "off",
              }}
            >
              <Suspense fallback={<LoadingComponent />}>
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-routes"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={() => <Header sticky />}
                          Sider={(props) => <CustomSider {...props} />}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="accepted-goods" />}
                    />

                    <Route path="/goods-processing">
                      <Route index element={<GoogsProcessingList />} />
                      <Route path="create" element={<GoodsCreate />} />
                      <Route path="edit/:id" element={<GoodsEdit />} />
                      <Route path="show/:id" element={<GoodsShow />} />
                    </Route>

                    <Route path="/accepted-goods">
                      <Route index element={<AcceptedGoodsList />} />
                      <Route path="show/:id" element={<AcceptedGoodsShow />} />
                      <Route path="edit/:id" element={<AcceptedGoodsEdit />} />
                    </Route>

                    <Route path="/not-paid-goods">
                      <Route index element={<NotPaidGoodsList />} />
                      <Route path="show/:id" element={<NotPaidGoodsShow />} />
                    </Route>

                    <Route path="/grooz">
                      <Route index element={<CounterpartyGrooz />} />
                      <Route path="show/:id" element={<GroozShow />} />
                    </Route>

                    <Route path="/issue">
                      <Route index element={<IssueProcessingList />} />
                      <Route path="show/:id" element={<GoodsShow />} />
                      <Route
                        path="received"
                        element={<IssueProcessingListReceived />}
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
                      <Route path="show/:id/adding" element={<ShipmentAdd />} />
                      <Route path="history" element={<ShipmentHistory />} />
                      <Route
                        path="history/show/:id"
                        element={<ShipmentHistoryShow />}
                      />
                    </Route>

                    <Route path="/resend">
                      <Route index element={<ResendList />} />
                      <Route path="create" element={<ResendCreate />} />
                      <Route path="show/:id" element={<ResendShow />} />
                      <Route path="edit/:id" element={<ResendEdit />} />
                      <Route path="history" element={<ResendHistory />} />
                      <Route
                        path="history/show/:id"
                        element={<ResendHistoryShow />}
                      />
                    </Route>

                    <Route path="/counterparty">
                      <Route index element={<CounterpartyList />} />
                      <Route path="create" element={<CounterpartyCreate />} />
                      <Route path="show/:id" element={<CounterpartyShow />} />
                      <Route path="edit/:id" element={<CounterpartyEdit />} />
                    </Route>

                    <Route path="/tasks">
                      <Route index element={<TasksList />} />
                      <Route path="create" element={<TasksCreate />} />
                      <Route path="show/:id" element={<TasksyShow />} />
                      <Route path="edit/:id" element={<TasksEdit />} />
                      <Route path="archive" element={<TasksArchive />} />
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
                      <Route path="history" element={<ReceivingHistory />} />
                      <Route path="all" element={<ReceivingAll />} />
                      <Route
                        path="history/show/:id"
                        element={<ReceivingHistoryShow />}
                      />
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

                      <Route
                        path="cargo-received"
                        element={<CargoReceivedReport />}
                      />
                      <Route path="cash-book" element={<CashBookReport />} />
                      <Route path="cargo-types" element={<CargoTypesReport />} />
                      <Route path="income" element={<IncomeReport />} />
                      <Route path="expense" element={<ExpenseReport />} />
                      <Route path="employees" element={<EmployeesReport />} />
                      <Route path="branches" element={<BranchesReport />} />
                      <Route
                        path="cash-operations"
                        element={<CashOperationsReport />}
                      />
                      <Route
                        path="incoming-funds"
                        element={<IncomingFundsReport />}
                      />
                      <Route
                        path="incoming-funds/:id"
                        element={<IncomeShowReport />}
                      />
                      <Route
                        path="expense-finance"
                        element={<ExpenseFinanceReport />}
                      />
                      <Route
                        path="expense-representative"
                        element={<RepresentativeReport />}
                      />
                    </Route>

                    <Route path="/notification">
                      <Route index element={<NotificationsList />} />
                      <Route path="create" element={<NotificationsCreate />} />
                    </Route>

                    <Route path="/chatbot-history">
                      <Route index element={<ChatbotList />} />
                      <Route path="create" element={<ChatbotCreate />} />
                      <Route path="show/:id" element={<ChatbotShow />} />
                      <Route path="edit/:id" element={<ChatbotEdit />} />
                    </Route>

                    <Route path="/answer-ready">
                      <Route index element={<TriggersList />} />
                      <Route path="create" element={<TriggersCreate />} />
                      <Route path="edit/:id" element={<TriggersEdit />} />
                      <Route path="show/:id" element={<TriggersShow />} />
                    </Route>

                    <Route path="/bank">
                      <Route index element={<BankList />} />
                      <Route path="create" element={<BankCreate />} />
                      <Route path="show/:id" element={<BankShow />} />
                      <Route path="edit/:id" element={<BankEdit />} />
                    </Route>

                    <Route path="/income">
                      <Route index element={<CashDeskList />} />
                      <Route path="create" element={<CashDeskCreate />} />
                      <Route path="show/:id" element={<IncomeShow />} />
                    </Route>

                    <Route path="/outcome">
                      <Route index element={<CashDeskOutcomeList />} />
                      <Route path="create" element={<CashDeskCreate />} />
                    </Route>

                    <Route path="/currency">
                      <Route index element={<CurrencyList />} />
                      <Route path="create" element={<CurrencyCreate />} />
                      <Route path="show/:id" element={<CurrencyShow />} />
                      <Route path="edit/:id" element={<CurrencyEdit />} />
                    </Route>

                    <Route path="/remaining-stock">
                      <Route index element={<RemainingStockProcessingList />} />
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
              </Suspense>

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