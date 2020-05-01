import { homeApi } from '../../api';
import { doGetDataHome } from './action';

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
