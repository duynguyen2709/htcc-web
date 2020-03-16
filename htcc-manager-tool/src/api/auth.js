import axios from 'axios';
import { API_URL_GATEWAY, API_URL_EMPLOYEE, CLIENTID } from '../constant/url';
import { USER, TOKEN } from '../constant/localStorageKey';

const login = (companyId, username, password) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${API_URL_GATEWAY}/api/gateway/public/login`,
      data: {
        clientId: CLIENTID,
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

const logout = () => {
  const user = JSON.parse(localStorage.getItem(USER));
  const token = localStorage.getItem(TOKEN);
  const data = {
    companyId: user.companyId,
    username: user.username
  };

  return new Promise((resolve, reject) => {
    axios
      .post(
        `${API_URL_GATEWAY}/api/gateway/private/logout/${CLIENTID}?companyId=${user.companyId}&username=${user.username}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          timeout: 20000
        }
      )
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const fetchUser = (companyId, username, token) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL_EMPLOYEE}/users/${companyId}/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 20000
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default {
  login,
  fetchUser,
  logout
};
