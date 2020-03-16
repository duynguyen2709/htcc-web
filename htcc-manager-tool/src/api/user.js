import axios from 'axios';
import { API_URL_GATEWAY } from '../constant/url';
import { TOKEN } from '../constant/localStorageKey';

const getAllUsers = () => {
  const token = localStorage.getItem(TOKEN);
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_URL_GATEWAY}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 20000
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default {
  getAllUsers
};
