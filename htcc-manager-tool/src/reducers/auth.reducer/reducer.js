import authAction from './action';

const INITIAL_STATE = {
  isAuthenticated: false,
  isLogining: false,
  user: undefined,
  token: undefined,
  error: false
};

const applyLogout = (state, action) => ({
  ...INITIAL_STATE
});

const applyClearResult = (state, action) => ({
  ...state,
  result: undefined
});

const applyLogin = (state, action) => ({
  ...state,
  isLogining: true,
  user: undefined,
  token: undefined,
  error: false
});

const applyLoginSuccess = (state, action) => ({
  ...state,
  isLogining: false,
  isAuthenticated: true,
  user: action.payload.user,
  error: false
});

const applyLoginFail = (state, action) => ({
  ...state,
  isLogining: false,
  error: true
});

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case authAction.CLEAR_RESULT: {
      return applyClearResult(state, action);
    }

    case authAction.LOGIN: {
      return applyLogin(state, action);
    }

    case authAction.LOGIN_SUCCESS: {
      return applyLoginSuccess(state, action);
    }

    case authAction.LOGIN_FAIL: {
      return applyLoginFail(state, action);
    }

    case authAction.LOGOUT: {
      return applyLogout(state, action);
    }

    default:
      return state;
  }
};

export default reducer;
