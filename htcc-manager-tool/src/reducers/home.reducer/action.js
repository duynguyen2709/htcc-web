const GET_DATA_HOME = 'GET_DATA_HOME';
const CLEAR_DATA = 'CLEAR_DATA';

export default {
    GET_DATA_HOME,
    CLEAR_DATA,
};

const doGetDataHome = (data) => ({
    type: GET_DATA_HOME,
    payload: {
        canManageOffices: data.canManageOffices,
        pendingComplaint: data.pendingComplaint,
        pendingLeavingRequest: data.pendingLeavingRequest,
    },
});

const doClearData = () => ({
    type: CLEAR_DATA,
    payload: {},
});

export { doGetDataHome, doClearData };