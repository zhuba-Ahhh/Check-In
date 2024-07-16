import { useCallback, useEffect, useState } from 'react';
import { getLocalStorage, setLocalStorage, dayJs, newDate } from '../utils';
import { CheckInType, dayData } from '../types';

const CheckInButton = () => {
  const [type, setType] = useState<CheckInType>('morning');
  const [morning, setMorning] = useState<string | null>(null);
  const [night, setNight] = useState<string | null>(null);
  const [weekData, setWeekData] = useState<Array<dayData>>([]);
  const [duration, setDuration] = useState<string | null>(null);
  const [weeklyDuration, setWeeklyDuration] = useState<string | null>(null);

  const updateWeekData = useCallback(
    (now: Date) => {
      // 更新weekData
      setWeekData((prevData) => {
        const newData = [...prevData];
        const dateKey = dayJs(now).format('YYYY-MM-DD');
        const index = newData.findIndex((item) => item.date === dateKey);
        if (index !== -1) {
          if (type === 'morning') {
            newData[index].morning = String(now);
          } else {
            newData[index].night = String(now);
          }
        } else {
          newData.push({
            date: dateKey,
            morning: type === 'morning' ? dayJs(now).format('HH:mm') : null,
            night: type === 'night' ? dayJs(now).format('HH:mm') : null,
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
    const weekData = getLocalStorage('weekData');
    try {
      if (weekData) {
        setWeekData(JSON.parse(weekData));
      }
    } catch (error) {
      console.error(error);
    }
    if (morningDate) {
      const dayJSmorningDate = dayJs(morningDate);
      if (dayJSmorningDate.format('dd') === dayJs(newDate()).format('dd')) {
        setType('night');
      }
      setMorning(dayJSmorningDate.format('MM-DD HH-mm'));
    }

    nightDate && setNight(dayJs(nightDate).format('MM-DD HH-mm'));
  }, []);

  // 本周已经工作时长
  useEffect(() => {
    let totalSeconds = 0;
    weekData.forEach((data) => {
      const currWeek = dayJs(newDate()).week();
      if (data.morning && data.night && currWeek === dayJs(data.date).week()) {
        const morningTime = dayJs(data.morning);
        const nightTime = dayJs(data.night);
        const diffSeconds = nightTime.diff(morningTime, 'second');
        if (diffSeconds > 0) totalSeconds += diffSeconds;
      }
    });

    if (totalSeconds < 1) return;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    const seconds = totalSeconds % 60;
    setWeeklyDuration(`${hours} 小时 ${minutes} 分 ${seconds} 秒`);
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

  return (
    <>
      <button
        className={type === 'morning' ? 'btn btn-outline' : 'btn btn-accent'}
        onClick={handleCheckIn}
      >
        {type === 'morning' ? '早上打卡' : '晚上打卡'}
      </button>
      <div className="card w-96 shadow-xl bg-teal-100 mt-6">
        <div className="card-body">
          <h2>上次早上打卡时间: {morning}</h2>
          <h2>上次晚上打卡时间: {night}</h2>
          <h2>今天已经工作时长: {duration}</h2>
          <h2>本周已经工作时长: {weeklyDuration}</h2>
        </div>
      </div>
    </>
  );
};

export default CheckInButton;
