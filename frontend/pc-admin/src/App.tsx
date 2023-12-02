import './index.css';
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Index } from './pages/Index/Index';
import { ErrorPage } from './pages/ErrorPage/ErrorPage';
import { UserManage } from './pages/UserManage/UserManage';
import { Login } from './pages/Login/Login';
import { Menu } from './pages/Menu/Menu';
import { ModifyMenu } from './pages/ModifyMenu/ModifyMenu';
import { InfoModify } from './pages/InfoModify/InfoModify';
import { PasswordModify } from './pages/PasswordModify/PasswordModify';
import { MeetingRoomManage } from './pages/MeetingRoomManage/MeetingRoomManage';
import { BookingManage } from './pages/BookingManage/BookingManage';
import { Statistics } from './pages/Statistics/Statistics';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { BookingManageDetail } from './pages/BookingManage/detail';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Menu />,
        children: [
          {
            index: true,
            element: <MeetingRoomManage/>
          },
          {
            path: 'user_manage',
            element: <UserManage/>
          },
          {
            path: 'meeting_room_manage',
            element: <MeetingRoomManage/>
          },
          {
            path: 'booking_manage',
            Component: BookingManage,
            // children: [
            //   { path: 'detail',Component: BookingManageDetail, }
            // ]
          },
          {
            path: 'statistics',
            element: <Statistics/>
          },
        ]
      },
      {
        path: 'booking_manage/:id',
        Component:BookingManageDetail,
      },
      {
        path: "/user",
        element: <ModifyMenu />,
        children: [
          {
            path: 'info_modify',
            element: <InfoModify/>
          },
          {
            path: 'password_modify',
            element: <PasswordModify/>
          },
        ]
      },
    ]
  },
  {
    path: "login",
    element: <Login />,
  }
];
export const router = createBrowserRouter(routes);


const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router}/>
    </ConfigProvider>
  )
}

export default App
