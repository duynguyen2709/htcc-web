import homeAction from './action';

const INITIAL_STATE = {
    data: undefined,
};

const applyGetDataHome = (state, action) => ({
    ...state,
    data: {
        canManageOffices: action.payload.canManageOffices,
        pendingComplaint: action.payload.pendingComplaint,
        pendingLeavingRequest: action.payload.pendingLeavingRequest,
        canManageEmployees: action.payload.canManageEmployees,
        iconList: action.payload.iconList,
        isSuperAdmin: action.payload.isSuperAdmin,
        unreadNotifications: action.payload.unreadNotifications,
        pendingCheckIn: action.payload.pendingCheckIn,
        leavingRequestCategories: action.payload.leavingRequestCategories,
    },
});

const applyUpdateDataHome = (state, action) => ({
    ...state,
    data: {
        ...state.data,
        ...action.payload,
    },
});

const applyClearData = (state, action) => ({
    ...INITIAL_STATE,
});

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case homeAction.GET_DATA_HOME: {
            return applyGetDataHome(state, action);
        }
        case homeAction.UPDATE_DATA_HOME: {
            return applyUpdateDataHome(state, action);
        }
        case homeAction.CLEAR_DATA: {
            return applyClearData(state, action);
        }
        default:
            return state;
    }
};

export default reducer;
