import {
  PATTERN_EMAIL,
  PATTERN_PHONE_NUMBER,
  PATTERN_PASSWORD
} from '../constant/pattern';

export const checkValidEmail = input => {
  return PATTERN_EMAIL.test(input);
};

export const checkValidPassword = input => {
  return PATTERN_PASSWORD.test(input);
};

export const checkValidPhoneNumber = input => {
  return PATTERN_PHONE_NUMBER.test(input);
};
