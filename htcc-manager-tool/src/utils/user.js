import { TOKEN } from '../constant/localStorageKey';

export const getTokenFromLocalStorage = () => {
  return localStorage.getItem(TOKEN);
};

export const setTokenToLocalStorage = token => {
  localStorage.setItem(TOKEN, JSON.stringify(token));
};

export const removeTokenFromLocalStorage = () => {
  localStorage.removeItem(TOKEN);
};
