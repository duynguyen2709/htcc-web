import Dashboard from './views/Dashboard';
import Employee from './views/Employee';
import Attendance from './views/Attendance';
import CompanyInfo from './views/CompanyInfo';
import Complaint from './views/Complaint';
import LeaveRequest from './views/LeaveRequest';
import ConfigDayOff from './views/ConfigDayOff';
import ShiftTime from './views/containers/ShiftTimeContainer';
import WorkingDay from './views/containers/WorkingDayContainer';
import Notification from './views/Notification/index';
import ShiftArrangement from './views/ShiftArrangement';

const routes = [
    {
        path: '/thong-bao',
        key: '/thong-bao',
        name: 'Thông Báo',
        icon: 'tim-icons icon-bell-55',
        component: Notification,
        layout: '/',
    },
    {
        path: '/thong-ke',
        key: '/thong-ke',
        name: 'Thống kê',
        icon: 'tim-icons icon-chart-pie-36',
        component: Dashboard,
        layout: '/',
    },
    {
        path: '/thong-tin-cty',
        key: '/thong-tin-cty',
        name: 'Công Ty',
        icon: 'tim-icons icon-istanbul',
        component: CompanyInfo,
        layout: '/',
    },
    {
        path: '/nhan-vien',
        key: '/nhan-vien',
        name: 'Nhân viên',
        icon: 'tim-icons icon-single-02',
        component: Employee,
        layout: '/',
    },
    {
        path: '/khieu-nai',
        key: '/khieu-nai',
        name: 'Khiếu Nại',
        icon: 'tim-icons icon-chat-33',
        component: Complaint,
        layout: '/',
    },
    {
        path: '/diem-danh',
        key: '/diem-danh',
        name: 'Điểm Danh',
        icon: 'tim-icons icon-check-2',
        component: Attendance,
        layout: '/',
        id: 'complaint-icon',
    },
    {
        path: '/nghi-phep',
        key: '/nghi-phep',
        name: 'Nghỉ Phép',
        icon: 'tim-icons icon-send',
        component: LeaveRequest,
        layout: '/',
    },
    {
        path: '/lich-lam',
        key: '/lich-lam',
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
                key: '/lich-lam/ngay',
                brand: 'Ngày Làm Việc',
                component: WorkingDay,
                layout: '/',
            },
            {
                name: 'Danh sách ca',
                icon: 'tim-icons icon-time-alarm',
                class: 'sub-menu canManageOffices',
                path: '/lich-lam/ca',
                key: '/lich-lam/ca',
                brand: 'Danh Sách Ca',
                component: ShiftTime,
                layout: '/',
            },
            {
                name: 'Xếp ca',
                icon: 'tim-icons icon-calendar-60',
                class: 'sub-menu',
                path: '/lich-lam/xep-ca',
                key: '/lich-lam/xep-ca',
                brand: 'Xếp Ca Làm Việc',
                component: ShiftArrangement,
                layout: '/',
            },
        ],
    },
    {
        path: '/ngay-nghi',
        key: '/ngay-nghi',
        name: 'Quản lý ngày phép',
        icon: 'tim-icons icon-settings',
        component: ConfigDayOff,
        layout: '/',
    },
];
export default routes;
