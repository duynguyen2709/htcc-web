import { homeApi } from '../../api';
import { doGetDataHome, doUpdateDataHome } from './action';

export const getDataHome = () => (dispatch) =>
    new Promise(async (resolve, reject) => {
        let res = {};
        try {
            res = await homeApi.getTotal();
            if (res.returnCode === 1) {
                resolve(dispatch(doGetDataHome(res.data)));
            }
        } catch (err) {}
    });

export const updateDataHome = (payload) => (dispatch) =>
    dispatch(doUpdateDataHome(payload));
