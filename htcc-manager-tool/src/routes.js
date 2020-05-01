import Dashboard from './views/Dashboard';
import Employee from './views/Employee';
import Attendance from './views/Attendance';
import CompanyInfo from './views/CompanyInfo';
import Complaint from './views/Complaint';
import LeaveRequest from './views/LeaveRequest';
import ConfigDayOff from './views/ConfigDayOff';
import ShiftTime from './views/ShiftTime';

var routes = [
    {
        path: '/thong-ke',
        name: 'Thống kê',
        icon: 'tim-icons icon-chart-pie-36',
        component: Dashboard,
        layout: '/',
    },
    {
        path: '/thong-tin-cty',
        name: 'Công Ty',
        icon: 'tim-icons icon-istanbul',
        component: CompanyInfo,
        layout: '/',
    },
    {
        path: '/nhan-vien',
        name: 'Nhân viên',
        icon: 'tim-icons icon-single-02',
        component: Employee,
        layout: '/',
    },
    {
        path: '/khieu-nai',
        name: 'Khiếu Nại',
        icon: 'tim-icons icon-chat-33',
        component: Complaint,
        layout: '/',
    },
    {
        path: '/diem-danh',
        name: 'Điểm Danh',
        icon: 'tim-icons icon-check-2',
        component: Attendance,
        layout: '/',
        id: 'complaint-icon',
    },
    {
        path: '/nghi-phep',
        name: 'Nghỉ Phép',
        icon: 'tim-icons icon-send',
        component: LeaveRequest,
        layout: '/',
    },
    {
        path: '/lich-lam',
        name: 'Lịch Làm',
        icon: 'tim-icons icon-calendar-60',
        component: '',
        layout: '/',
        id: 'canManageOffices',
        childs: [
            {
                name: 'Ngày',
                icon: 'tim-icons icon-book-bookmark',
                class: 'sub-menu canManageOffices',
                path: '/lich-lam/ngay',
                brand: 'Lịch Làm / Ngày',
                component: LeaveRequest,
                layout: '/',
            },
            {
                name: 'Ca',
                icon: 'tim-icons icon-time-alarm',
                class: 'sub-menu canManageOffices',
                path: '/lich-lam/ca',
                brand: 'Lịch Làm / Ca',
                component: ShiftTime,
                layout: '/',
            },
        ],
    },
    {
        path: '/ngay-nghi',
        name: 'Quản lý phép',
        icon: 'tim-icons icon-settings',
        component: ConfigDayOff,
        layout: '/',
    },
];
export default routes;
