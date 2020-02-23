import Dashboard from './views/Dashboard';
import Employee from './views/Employee';

var routes = [
  {
    path: '/thong-ke',
    name: 'Thống kê',
    icon: 'tim-icons icon-chart-pie-36',
    component: Dashboard,
    layout: '/'
  },
  {
    path: '/nhan-vien',
    name: 'Nhân viên',
    icon: 'tim-icons icon-single-02',
    component: Employee,
    layout: '/'
  }
];
export default routes;
