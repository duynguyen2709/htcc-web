import axios from 'axios';
import { API_URL_EMPLOYEE } from '../constant/url';
import { TOKEN } from '../constant/localStorageKey';

const getAllUsers = () => {
  const token = localStorage.getItem(TOKEN);
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL_EMPLOYEE}/users`, {
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
  getAllUsers
};
