const GET_DATA_HOME = 'GET_DATA_HOME';
const CLEAR_DATA = 'CLEAR_DATA';
const UPDATE_DATA_HOME = 'UPDATE_DATA_HOME';

export default {
    GET_DATA_HOME,
    CLEAR_DATA,
    UPDATE_DATA_HOME,
};

const doGetDataHome = (data) => ({
    type: GET_DATA_HOME,
    payload: {
        canManageOffices: data.canManageOffices,
        pendingComplaint: data.pendingComplaint,
        pendingLeavingRequest: data.pendingLeavingRequest,
        canManageEmployees: data.canManageEmployees,
        iconList: data.iconList,
        isSuperAdmin: data.isSuperAdmin,
        unreadNotifications: data.unreadNotifications,
        pendingCheckIn: data.pendingCheckIn,
        leavingRequestCategories: data.leavingRequestCategories,
    },
});

const doUpdateDataHome = (data) => ({
    type: UPDATE_DATA_HOME,
    payload: {
        [data.name]: data.data,
    },
});

const doClearData = () => ({
    type: CLEAR_DATA,
    payload: {},
});

export { doGetDataHome, doClearData, doUpdateDataHome };
