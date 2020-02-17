import { USER, TOKEN } from '../constant/localStorageKey';

export const getUserFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem(USER));
};

export const setUserToLocalStorage = user => {
  localStorage.setItem(USER, JSON.stringify(user));
};

export const removeUserFromLocalStorage = user => {
  localStorage.removeItem(USER);
};

export const getTokenFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem(TOKEN));
};

export const setTokenToLocalStorage = token => {
  localStorage.setItem(TOKEN, JSON.stringify(token));
};

export const removeTokenFromLocalStorage = () => {
  localStorage.removeItem(TOKEN);
};
