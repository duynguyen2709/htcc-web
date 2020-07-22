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
import ShiftTemplate from './views/ShiftTemplate';
import Role from "./views/Role";
import {canDoAction} from "./utils/permission";
import {ACTION, ROLE_GROUP_KEY} from "./constant/constant";
import EmployeePermission from "./views/EmployeePermission";

const routes = [
    {
        path: '/thong-ke',
        key: '/thong-ke',
        name: 'Thống kê',
        icon: 'tim-icons icon-chart-pie-36',
        component: Dashboard,
        layout: '/',
        rule: (data) => canDoAction(data, ROLE_GROUP_KEY.STATISTICS, ACTION.READ)
    },
    {
        path: '/thong-tin-cty',
        key: '/thong-tin-cty',
        name: 'Công Ty',
        icon: 'tim-icons icon-istanbul',
        component: CompanyInfo,
        layout: '/',
        rule: (data) => {
            return (canDoAction(data, ROLE_GROUP_KEY.COMPANY, ACTION.READ) ||
                canDoAction(data, ROLE_GROUP_KEY.OFFICE, ACTION.READ) ||
                canDoAction(data, ROLE_GROUP_KEY.DEPARTMENT, ACTION.READ))
        },
    },
    {
        path: '/nhan-vien',
        key: '/nhan-vien',
        name: 'Nhân viên',
        icon: 'tim-icons icon-single-02',
        component: Employee,
        layout: '/',
        rule: (data) => canDoAction(data, ROLE_GROUP_KEY.EMPLOYEE_MANAGE, ACTION.READ)
    },
    {
        path: '/diem-danh',
        key: '/diem-danh',
        name: 'Điểm Danh',
        icon: 'tim-icons icon-check-2',
        component: Attendance,
        layout: '/',
        id: 'complaint-icon',
        rule: (data) => canDoAction(data, ROLE_GROUP_KEY.CHECKIN, ACTION.READ)
    },
    {
        path: '/khieu-nai',
        key: '/khieu-nai',
        name: 'Khiếu Nại',
        icon: 'tim-icons icon-chat-33',
        component: Complaint,
        layout: '/',
        rule: (data) => canDoAction(data, ROLE_GROUP_KEY.COMPLAINT, ACTION.READ)
    },
    {
        path: '/nghi-phep',
        key: '/nghi-phep',
        name: 'Nghỉ Phép',
        icon: 'tim-icons icon-send',
        component: LeaveRequest,
        layout: '/',
        rule: (data) => canDoAction(data, ROLE_GROUP_KEY.LEAVING_REQUEST, ACTION.READ)
    },
    {
        path: '/ngay-nghi',
        key: '/ngay-nghi',
        name: 'Quản lý ngày phép',
        icon: 'tim-icons icon-settings',
        component: ConfigDayOff,
        layout: '/',
        rule: (data) => canDoAction(data, ROLE_GROUP_KEY.DAY_OFF, ACTION.READ)
    },
    {
        path: '/lich-lam/ngay',
        key: '/lich-lam',
        name: 'Lịch Làm',
        icon: 'tim-icons icon-calendar-60',
        component: '',
        layout: '/',
        id: 'canManageOffices',
        rule: (data) => {
            return (canDoAction(data, ROLE_GROUP_KEY.WORKING_DAY, ACTION.READ) ||
                canDoAction(data, ROLE_GROUP_KEY.SHIFT, ACTION.READ) ||
                canDoAction(data, ROLE_GROUP_KEY.SHIFT_ARRANGEMENT, ACTION.READ) ||
                canDoAction(data, ROLE_GROUP_KEY.SHIFT_TEMPLATE, ACTION.READ))
        },
        childs: [
            {
                // name: 'Ngày',
                icon: 'tim-icons icon-book-bookmark',
                class: 'sub-menu canManageOffices',
                path: '/lich-lam/ngay',
                key: '/lich-lam/ngay',
                name: 'Ngày Làm Việc',
                component: WorkingDay,
                layout: '/',
                rule: (data) => canDoAction(data, ROLE_GROUP_KEY.WORKING_DAY, ACTION.READ)
            },
            {
                // name: 'Danh sách ca',
                icon: 'tim-icons icon-time-alarm',
                class: 'sub-menu canManageOffices',
                path: '/lich-lam/ca',
                key: '/lich-lam/ca',
                name: 'Danh Sách Ca',
                component: ShiftTime,
                layout: '/',
                rule: (data) => canDoAction(data, ROLE_GROUP_KEY.SHIFT, ACTION.READ)
            },
            {
                // name: 'Xếp ca',
                icon: 'tim-icons icon-calendar-60',
                class: 'sub-menu',
                path: '/lich-lam/xep-ca',
                key: '/lich-lam/xep-ca',
                name: 'Xếp Ca Làm Việc',
                component: ShiftArrangement,
                layout: '/',
                rule: (data) => canDoAction(data, ROLE_GROUP_KEY.SHIFT_ARRANGEMENT, ACTION.READ)
            },
            {
                // name: 'Ca mẫu',
                icon: 'tim-icons icon-calendar-60',
                class: 'sub-menu',
                path: '/lich-lam/ca-mau',
                key: '/lich-lam/ca-mau',
                name: 'Ca Làm Việc Mẫu',
                component: ShiftTemplate,
                layout: '/',
                rule: (data) => canDoAction(data, ROLE_GROUP_KEY.SHIFT_TEMPLATE, ACTION.READ)
            },
        ],
    },
    {
        path: '/thong-bao',
        key: '/thong-bao',
        name: 'Thông Báo',
        icon: 'tim-icons icon-bell-55',
        component: Notification,
        layout: '/',
        rule: (data) => canDoAction(data, ROLE_GROUP_KEY.NOTIFICATION, ACTION.READ),
    },
    {
        path: '/phan-quyen',
        key: '/phan-quyen',
        name: 'Phân quyền',
        icon: 'tim-icons icon-settings',
        component: Role,
        layout: '/',
        rule: (data) => canDoAction(data, ROLE_GROUP_KEY.PERMISSION, ACTION.READ)
    },
    {
        path: '/quyen-nhan-vien',
        key: '/quyen-nhan-vien',
        name: 'Quyền',
        icon: 'tim-icons icon-settings',
        component: EmployeePermission,
        layout: '/',
        rule: (data) => canDoAction(data, ROLE_GROUP_KEY.PERMISSION, ACTION.READ)
    },

];
export default routes;
