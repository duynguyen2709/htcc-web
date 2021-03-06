import {
    PATTERN_EMAIL,
    PATTERN_INT_FLOAT,
    PATTERN_PASSWORD,
    PATTERN_PHONE_NUMBER,
    PATTERN_CMND,
} from '../constant/pattern';

export const checkValidEmail = (input) => {
    return PATTERN_EMAIL.test(input);
};

export const checkValidPassword = (input) => {
    return PATTERN_PASSWORD.test(input);
};

export const checkValidPhoneNumber = (input) => {
    return PATTERN_PHONE_NUMBER.test(input);
};

export const checkValidNumber = (input) => {
    return PATTERN_INT_FLOAT.test(input);
};

export const checkValidCMND = (input) => {
    return PATTERN_CMND.test(input);
};
