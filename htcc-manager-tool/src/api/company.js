import axios from 'axios';
import { API_URL_EMPLOYEE } from '../constant/url';
import { TOKEN, USER } from '../constant/localStorageKey';

const getInfoCompany = () => {
  const token = localStorage.getItem(TOKEN);
  const user = JSON.parse(localStorage.getItem(USER));

  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL_EMPLOYEE}/companies/${user.companyId}`, {
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

const updateInfoCompany = data => {
  const token = localStorage.getItem(TOKEN);
  const user = JSON.parse(localStorage.getItem(USER));

  return new Promise((resolve, reject) => {
    axios({
      method: 'put',
      url: `${API_URL_EMPLOYEE}/companies/${user.companyId}`,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`
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

export default {
  getInfoCompany,
  updateInfoCompany
};
