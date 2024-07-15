import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

export const dayJs = dayjs;

export const newDate = () => {
  return new Date();
};
