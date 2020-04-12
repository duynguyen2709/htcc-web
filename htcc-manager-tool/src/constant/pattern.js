export const PATTERN_EMAIL = /^[a-z][a-z0-9_.]{4,31}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$/;
//10 so
export const PATTERN_PHONE_NUMBER = /(09|01[2|6|8|9]|1[9])+([0-9]{8})\b/;
//a password at least 7 characters which contain at least one numeric digit and a special character
export const PATTERN_PASSWORD = /^(?=.*[0-9])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{7,}$/;
