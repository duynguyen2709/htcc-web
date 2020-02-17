import axios from 'axios';
import { API_URL } from '../constant/url';

const login = (companyCode, userCode, password) => {
  return new Promise((resolve, reject) => {
    const data = {
      user: {
        companyCode: 'api',
        userCode: 'api'
      },
      token: 'api'
    };

    const res = {
      returnCode: 1,
      data
    };
    resolve(res);
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
