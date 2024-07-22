import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { chineseDays } from 'zhuba-tools';

const { getDayDetail } = chineseDays;

dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);

export const dayJs = dayjs;

export const newDate = () => {
  return new Date();
};

// 转换成时分秒
const secondsToHMS = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours} 小时 ${minutes} 分 ${seconds} 秒`;
};

// 获取本周工作时长
const GetThisWeekTime = () => {
  const week = getThisWeekDates();

  let weekTimeHours = 0;
  week.forEach((item) => {
    const dayDetail = getDayDetail(item);
    if (dayDetail.work) {
      weekTimeHours++;
    }
  });

  return weekTimeHours * 11.5 * 3600;
};

// 获取本周的日期范围
const getThisWeekDates = () => {
  const today = dayjs(); // 获取今天的日期
  const weekStart = today.startOf('week'); // 获取本周开始的日期，通常是周日或周一，具体取决于你的地区设置
  const weekEnd = today.endOf('week'); // 获取本周结束的日期

  const dates = [];
  let currentDate = weekStart;

  while (currentDate.isSameOrBefore(weekEnd)) {
    dates.push(currentDate.format('YYYY-MM-DD')); // 将日期格式化为字符串
    currentDate = currentDate.add(1, 'day'); // 移动到下一天
  }

  return dates;
};

export { secondsToHMS, GetThisWeekTime, getThisWeekDates };
