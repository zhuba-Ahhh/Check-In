import { useCallback, useEffect, useState } from 'react';
import dayJs from 'dayjs';
import { getLocalStorage, setLocalStorage } from '../utils';

type dayData = { date: string; morning: string | null; night: string | null };

const CheckInButton = () => {
  const [type, setType] = useState<'night' | 'morning'>('morning');
  const [morning, setMorning] = useState<string | null>(null);
  const [night, setNight] = useState<string | null>(null);
  const [weekData, setWeekData] = useState<Array<dayData>>([]);
  const handleCheckIn = () => {
    const now = new Date();
    setLocalStorage(`${type}`, String(now));
    if (type === 'morning') {
      setMorning(dayJs(now).format('MM-DD HH-mm'));
      setType('night');
    } else {
      setNight(dayJs(now).format('MM-DD HH-mm'));
    }

    // 更新weekData
    updateWeekData(now);
  };

  const updateWeekData = useCallback(
    (now: Date) => {
      // 更新weekData
      setWeekData((prevData) => {
        const newData = [...prevData];
        const dateKey = dayJs(now).format('YYYY-MM-DD');
        const index = newData.findIndex((item) => item.date === dateKey);
        if (index !== -1) {
          if (type === 'morning') {
            newData[index].morning = String(dayJs(now));
          } else {
            newData[index].night = String(dayJs(now));
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

  useEffect(() => {
    const morningDate = dayJs(getLocalStorage('morning'));
    const nightDate = dayJs(getLocalStorage('night'));
    const weekData = getLocalStorage('weekData');
    try {
      if (weekData) {
        setWeekData(JSON.parse(weekData));
      }
    } catch (error) {
      console.error(error);
    }
    if (morningDate.format('dd') === dayJs(new Date()).format('dd')) {
      setType('night');
    }
    morningDate && setMorning(morningDate.format('MM-DD HH-mm'));
    nightDate && setNight(nightDate.format('MM-DD HH-mm'));
  }, []);

  const [duration, setDuration] = useState<string | null>(null);

  const [weeklyDuration, setWeeklyDuration] = useState<string | null>(null);

  useEffect(() => {
    let totalSeconds = 0;
    weekData.forEach((data) => {
      if (data.morning && data.night) {
        const morningTime = dayJs(data.morning);
        const nightTime = dayJs(data.night);
        const diffSeconds = nightTime.diff(morningTime, 'second');
        totalSeconds += diffSeconds;
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    const seconds = totalSeconds % 60;
    setWeeklyDuration(`${hours} 小时 ${minutes} 分 ${seconds} 秒`);
  }, [weekData]);

  useEffect(() => {
    let timerId: number | undefined = void 0;
    if (morning && night) {
      const morningTime = dayJs(getLocalStorage('morning'));
      const updateDuration = () => {
        const now = new Date();
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
      <button className={type === 'morning' ? 'btn btn-outline' : 'btn'} onClick={handleCheckIn}>
        {type === 'morning' ? '早上打卡' : '晚上打卡'}
      </button>
      <div className="card w-96 shadow-xl bg-teal-100 mt-6">
        <div className="card-body">
          <h2>上次早上打卡时间: {morning}</h2>
          <h2>上次晚上打卡时间: {night}</h2>
          <h2>今天已经工作时间: {duration}</h2>
          <h2>本周已经工作时间: {weeklyDuration}</h2>
        </div>
      </div>
    </>
  );
};

export default CheckInButton;
