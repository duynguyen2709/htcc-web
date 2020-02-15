import { NOTIFY_TEMPLATE } from '../constant/notifier';

export const createNotify = (type, message) => {
  return {
    ...NOTIFY_TEMPLATE,
    type,
    message
  };
};
