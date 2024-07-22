import { useCallback, useEffect, useState } from 'react';
import {
  getLocalStorage,
  setLocalStorage,
  dayJs,
  newDate,
  secondsToHMS,
  GetThisWeekTime,
} from '../utils';
import { CheckInType, dayData, CheckInButtonProps } from '../types';
import { Dayjs } from 'dayjs';
import { copyToClipboard } from 'zhuba-tools';

const CheckInButton = ({ addToast }: CheckInButtonProps) => {
  const [type, setType] = useState<CheckInType>('morning');
  const [morning, setMorning] = useState<string | null>(null);
  const [night, setNight] = useState<string | null>(null);
  const [weekData, setWeekData] = useState<Array<dayData>>([]);
  const [duration, setDuration] = useState<string | null>(null);
  const [weeklyDuration, setWeeklyDuration] = useState<string | null>(null);
  const [residualDuration, setResidualDuration] = useState<string | null>(null);

  // 获取周打卡数据
  const getWeekData = useCallback((): Array<dayData> => {
    const weekData = getLocalStorage('weekData');
    try {
      if (weekData) {
        return JSON.parse(weekData);
      }
    } catch (error) {
      console.log(error);
      return [];
    }
    return [];
  }, []);

  // 更新WeekData
  const updateWeekData = useCallback(
    (now: Date) => {
      const stringNow = String(now);
      const dateKey = dayJs(now).format('YYYY-MM-DD');
      // 更新weekData
      setWeekData((prevData) => {
        const newData = [...prevData];
        const index = newData.findIndex((item) => item.date === dateKey);
        if (index !== -1) {
          if (type === 'morning') {
            newData[index].morning = stringNow;
          } else {
            newData[index].night = stringNow;
          }
        } else {
          newData.push({
            date: dateKey,
            morning: type === 'morning' ? stringNow : null,
            night: type === 'night' ? stringNow : null,
          });
        }

        setLocalStorage(`weekData`, JSON.stringify(newData));
        return newData;
      });
    },
    [type]
  );

  // 点击打卡按钮
  const handleCheckIn = useCallback(() => {
    const now = newDate();
    setLocalStorage(`${type}`, String(now));
    if (type === 'morning') {
      setMorning(dayJs(now).format('MM-DD HH-mm'));
      setType('night');
    } else {
      setNight(dayJs(now).format('MM-DD HH-mm'));
    }

    // 更新weekData
    updateWeekData(now);
  }, [type, updateWeekData]);

  // 初始化
  useEffect(() => {
    const morningDate = getLocalStorage('morning');
    const nightDate = getLocalStorage('night');
    const weekData = getWeekData();
    if (weekData.length > 0) {
      setWeekData(weekData);
    }

    if (morningDate) {
      const dayJSmorningDate = dayJs(morningDate);
      if (dayJSmorningDate.format('dd') === dayJs().format('dd')) {
        setType('night');
      }
      setMorning(dayJSmorningDate.format('MM-DD HH-mm'));
    }

    nightDate && setNight(dayJs(nightDate).format('MM-DD HH-mm'));
  }, [getWeekData]);

  // 本周已经工作时长
  useEffect(() => {
    let totalSeconds = 0;
    const currentWeek = dayJs().week();
    const morningToNightDiff = (morning: Dayjs, night: Dayjs) => night.diff(morning, 'second');
    // 遍历weekData，只计算当前周的工作时长
    for (let i = 0; i < weekData.length; i++) {
      const data = weekData[i];
      const { date, morning, night } = data;

      // 快速检查，避免不必要的dayJs转换和计算
      if (!morning || !night || dayJs(date).week() !== currentWeek) continue;

      // 计算差值，确保为正数
      const diffSeconds = morningToNightDiff(dayJs(morning), dayJs(night));
      if (diffSeconds > 0) totalSeconds += diffSeconds;
    }

    // 只有当总秒数大于0时才进行格式化
    if (totalSeconds > 0) {
      setWeeklyDuration(secondsToHMS(totalSeconds));
      setResidualDuration(secondsToHMS(GetThisWeekTime() - totalSeconds));
    }
  }, [weekData]);

  // 今天已经工作时长
  useEffect(() => {
    let timerId: number | undefined = void 0;
    if (morning && night) {
      const morningTime = dayJs(getLocalStorage('morning'));
      const updateDuration = () => {
        const now = newDate();
        const currentTime = dayJs(now);
        const diffSeconds = currentTime.diff(morningTime, 'second');
        const hours = Math.floor(diffSeconds / 3600);
        const minutes = Math.floor((diffSeconds - hours * 3600) / 60);
        const seconds = diffSeconds % 60;
        setDuration(`${hours} 小时 ${minutes} 分 ${seconds} 秒`);
        setLocalStorage(`night`, String(now));

        updateWeekData(now);
      };

      updateDuration();

      timerId = setInterval(updateDuration, 1000); // 每秒更新一次
    }

    return () => {
      clearInterval(timerId); // 清除计时器，即使没有night值也要执行
    };
  }, [morning, night, updateWeekData]);

  // 导出周打卡数据到剪贴板
  const exportData = useCallback(() => {
    const weekData = getWeekData();
    copyToClipboard(JSON.stringify(weekData));
    addToast({ text: '复制成功' });
  }, [getWeekData, addToast]);

  return (
    <>
      <div>
        <button
          className={type === 'morning' ? 'btn mr-6 btn-outline' : 'btn mr-6 btn-accent'}
          onClick={handleCheckIn}
        >
          <h2 className="text-lg font-bold">{type === 'morning' ? '早上打卡' : '晚上打卡'}</h2>
        </button>
        <button className="btn btn-outline btn-info" onClick={exportData}>
          <h2 className="text-lg font-bold">导出数据</h2>
        </button>
      </div>
      <div className="card w-90 shadow-xl bg-teal-100 mt-6">
        <div className="card-body p-6">
          <h2 className="text-lg font-semibold">上次早上打卡时间: {morning}</h2>
          <h2 className="text-lg font-semibold">上次晚上打卡时间: {night}</h2>
          <h2 className="text-lg font-semibold">今天已经工作时长: {duration}</h2>
          <h2 className="text-lg font-semibold">本周已经工作时长: {weeklyDuration}</h2>
          <h2 className="text-lg font-semibold">本周剩余工作时长: {residualDuration}</h2>
        </div>
      </div>
    </>
  );
};

export default CheckInButton;
