import Dashboard from './views/Dashboard';
import Employee from './views/Employee';
import Attendance from './views/Attendance';
import CompanyInfo from './views/CompanyInfo';

var routes = [
  {
    path: '/thong-ke',
    name: 'Thống kê',
    icon: 'tim-icons icon-chart-pie-36',
    component: Dashboard,
    layout: '/'
  },
  {
    path: '/thong-tin-cty',
    name: 'Công Ty',
    icon: 'tim-icons icon-istanbul',
    component: CompanyInfo,
    layout: '/'
  },
  {
    path: '/nhan-vien',
    name: 'Nhân viên',
    icon: 'tim-icons icon-single-02',
    component: Employee,
    layout: '/'
  },
  {
    path: '/diem-danh',
    name: 'Điểm Danh',
    icon: 'tim-icons icon-calendar-60',
    component: Attendance,
    layout: '/'
  }
];
export default routes;
