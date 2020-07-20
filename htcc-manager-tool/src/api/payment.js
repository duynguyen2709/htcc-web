import axios from 'axios';
import {API_URL_ADMIN} from '../constant/url';

const payOrder = (companyId) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: `${API_URL_ADMIN}/public/nextpay/${companyId}`,
            data: {}
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.error(err);
                reject('Hệ thống có lỗi. Vui lòng thử lại sau.');
            });
    });
};

export default {
    payOrder,
};
