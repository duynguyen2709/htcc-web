export const PATTERN_EMAIL = /^[a-z0-9_.]{1,31}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$/;
//10 so
export const PATTERN_PHONE_NUMBER = /^[0-9][0-9|-]{7,}$/;

//a password at least 7 characters which contain at least one numeric digit and a special character
export const PATTERN_PASSWORD = /^(?=.*[0-9])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{7,}$/;

export const PATTERN_INT_FLOAT = /(\d+(\.\d+)?)/;
