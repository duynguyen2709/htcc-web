import { combineReducers } from 'redux';
import { authReducer } from './auth.reducer';
import { homeReducer } from './home.reducer';

const rootReducer = combineReducers({
    authReducer,
    homeReducer,
});

export default rootReducer;
