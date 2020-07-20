import {homeApi} from '../../api';
import {doGetDataHome, doToggleLoading, doUpdateDataHome} from './action';

export const getDataHome = () => (dispatch) =>
    new Promise(async (resolve, reject) => {
        dispatch(doToggleLoading(true));
        let res = {};
        try {
            res = await homeApi.getTotal();
            if (res.returnCode === 1) {
                resolve(dispatch(doGetDataHome(res.data)));
            }
        } catch (err) {

        } finally {
            dispatch(doToggleLoading(false));
        }
    });

export const updateDataHome = (payload) => (dispatch) =>
    dispatch(doUpdateDataHome(payload));
