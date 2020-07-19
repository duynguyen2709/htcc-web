import homeAction from './action';

const INITIAL_STATE = {
    data: undefined,
    isLoadingHome: false,
};

const applyToggleLoading = (state, action) => {
    if (action.payload.isLoadingHome === state.isLoadingHome) {
        return {...state};
    }

    return {
        ...state,
        isLoadingHome: action.payload.isLoadingHome
    }
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
        roleDetail: action.payload.roleDetail,
        canAssignRoles: action.payload.canAssignRoles,
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
        case homeAction.TOGGLE_LOADING_HOME: {
            return applyToggleLoading(state, action);
        }
        default:
            return state;
    }
};

export default reducer;
