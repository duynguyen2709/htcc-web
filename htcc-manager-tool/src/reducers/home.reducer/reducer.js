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
        case homeAction.CLEAR_DATA: {
            return applyClearData(state, action);
        }
        default:
            return state;
    }
};

export default reducer;
