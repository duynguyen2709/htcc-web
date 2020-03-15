import axios from 'axios';
import { API_URL } from '../constant/url';

const login = (companyId, username, password, clientId = 2) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${API_URL}/api/gateway/public/login`,
      data: {
        clientId,
        companyId,
        password,
        username
      }
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const fetchUser = token => {
  return new Promise((resolve, reject) => {
    resolve({
      returnCode: 1,
      data: {
        user: {
          companyCode: 'api',
          userCode: 'api'
        },
        token: token
      }
    });
  });
};

export default {
  login,
  fetchUser
};
